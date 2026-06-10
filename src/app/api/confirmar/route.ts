import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "As confirmacoes de presenca foram encerradas. Em breve podera descarregar as fotos da inauguracao.",
    },
    { status: 410 }
  );
}
