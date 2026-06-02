import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const SMS_API_URL = process.env.SMS_API_URL || "https://mimo-sms-rest-api.vercel.app/send-sms";

export const runtime = "nodejs";

/**
 * Normalize phone to 9 digits (Angola format)
 */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-9);
}

/**
 * Send thank-you SMS to the guest
 */
async function sendThankYouSms(nome: string, telefone: string): Promise<{ sent: boolean; status: string }> {
  const phoneClean = normalizePhone(telefone);
  
  const smsText = `NAWABUS — Presenca confirmada ✅

Ola ${nome},
Obrigado por confirmar a sua presenca na inauguracao da nossa nova sede!

• Data: Terca-feira, 9 de Junho de 2026
• Hora: 18h00
• Local: Rua do BFA, Travessa 26, Bairro Benfica, Talatona — Luanda
• Mapa: https://maps.app.goo.gl/oj64qEYTta2ChTkE8
• Contacto: 930 533 405
• Email: geral@nawabus.com

Esperamos por si!
Viajar aqui e facil. — NAWABUS`;

  try {
    const response = await fetch(SMS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phoneClean, text: smsText }),
    });

    if (response.ok) {
      return { sent: true, status: "sent" };
    } else {
      console.error("SMS API error:", response.status, await response.text());
      return { sent: false, status: "failed" };
    }
  } catch (error) {
    console.error("SMS send error:", error);
    return { sent: false, status: "failed" };
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, telefone } = body as { nome?: string; telefone?: string };

  // Validate input
  if (!nome?.trim() || !telefone?.trim()) {
    return NextResponse.json(
      { error: "Nome e telefone são obrigatórios" },
      { status: 400 }
    );
  }

  const nomeClean = nome.trim();
  const telefoneNorm = normalizePhone(telefone);

  if (telefoneNorm.length !== 9) {
    return NextResponse.json(
      { error: "Por favor, insira um número válido (9 dígitos)." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    // Insert into Supabase
    const { data, error } = await supabase
      .from("event_rsvps")
      .insert([
        {
          nome: nomeClean,
          telefone: telefoneNorm,
          sms_status: null,
        },
      ])
      .select();

    if (error) {
      // Check if it's a unique constraint violation (duplicate phone)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Este número já foi confirmado" },
          { status: 409 }
        );
      }
      throw error;
    }

    const confirmacao = data?.[0];

    // Send SMS (non-blocking, failure is non-fatal)
    const smsResult = await sendThankYouSms(nomeClean, telefoneNorm);

    // Update SMS status in Supabase. Failure is non-fatal for the RSVP.
    if (confirmacao?.id) {
      const { error: smsStatusError } = await supabase
        .from("event_rsvps")
        .update({ sms_status: smsResult.status })
        .eq("id", confirmacao.id);

      if (smsStatusError) {
        console.error("Failed to update SMS status:", smsStatusError);
      }
    }

    return NextResponse.json(
      { confirmacao: { ...confirmacao, sms_status: smsResult.status } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/confirmar:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro. Tente novamente." },
      { status: 500 }
    );
  }
}
