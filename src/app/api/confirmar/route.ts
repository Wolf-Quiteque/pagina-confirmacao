import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { normalizePhone, sendSms, toSmsSafeText } from "@/lib/sms";

export const runtime = "nodejs";

/**
 * Send thank-you SMS to the guest.
 * MIMO rejects some non-ASCII characters when storing the SMS, so keep this
 * payload plain ASCII.
 */
async function sendThankYouSms(
  nome: string,
  telefone: string
): Promise<{ sent: boolean; status: string }> {
  const phoneClean = normalizePhone(telefone);
  const nomeSms = toSmsSafeText(nome);

  const smsText = toSmsSafeText(`NAWABUS - Presenca confirmada

Ola ${nomeSms},
Obrigado por confirmar a sua presenca na inauguracao da nossa nova sede!

Data: Terca-feira, 9 de Junho de 2026
Hora: 18h00
Local: Rua do BFA, Travessa 26, Bairro Benfica, Talatona - Luanda
Mapa: https://maps.app.goo.gl/Szc5zP8NcJt17eTJA?g_st=ac
Contacto: 930 533 405

Esperamos por si!
Viajar aqui e facil. - NAWABUS`);

  return sendSms(phoneClean, smsText);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, telefone } = body as { nome?: string; telefone?: string };

  if (!nome?.trim() || !telefone?.trim()) {
    return NextResponse.json(
      { error: "Nome e telefone sao obrigatorios" },
      { status: 400 }
    );
  }

  const nomeClean = nome.trim();
  const telefoneNorm = normalizePhone(telefone);

  if (telefoneNorm.length !== 9) {
    return NextResponse.json(
      { error: "Por favor, insira um numero valido (9 digitos)." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

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
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Este numero ja foi confirmado" },
          { status: 409 }
        );
      }
      throw error;
    }

    const confirmacao = data?.[0];
    const smsResult = await sendThankYouSms(nomeClean, telefoneNorm);

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
