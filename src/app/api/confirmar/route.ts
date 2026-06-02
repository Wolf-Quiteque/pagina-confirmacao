import { NextRequest, NextResponse } from "next/server";
import { getConfirmacoes, addConfirmacao, findByTelefone } from "@/lib/db";

export async function GET() {
  const confirmacoes = getConfirmacoes();
  return NextResponse.json({ confirmacoes, total: confirmacoes.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nome, telefone } = body as { nome?: string; telefone?: string };

  if (!nome?.trim() || !telefone?.trim()) {
    return NextResponse.json(
      { error: "Nome e telefone são obrigatórios" },
      { status: 400 }
    );
  }

  const existe = findByTelefone(telefone);
  if (existe) {
    return NextResponse.json(
      { error: "Este número de telefone já foi confirmado", existente: existe },
      { status: 409 }
    );
  }

  const nova = addConfirmacao(nome, telefone);
  return NextResponse.json(
    { confirmacao: nova, total: getConfirmacoes().length },
    { status: 201 }
  );
}
