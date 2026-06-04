import { formatRsvpDate, formatTelefone, getAllRsvps, type Rsvp } from "@/lib/rsvps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const ROWS_PER_PAGE = 32;

function toPdfSafeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
}

function escapePdfText(value: string) {
  return toPdfSafeText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function truncate(value: string, maxLength: number) {
  const safeValue = toPdfSafeText(value);

  if (safeValue.length <= maxLength) {
    return safeValue;
  }

  return `${safeValue.slice(0, Math.max(0, maxLength - 3))}...`;
}

function textLine(x: number, y: number, text: string, size = 10) {
  return `BT /F1 ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdfText(text)}) Tj ET`;
}

function fillColor(r: number, g: number, b: number) {
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`;
}

function strokeColor(r: number, g: number, b: number) {
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`;
}

function rectangle(x: number, y: number, width: number, height: number) {
  return `${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f`;
}

function horizontalLine(x1: number, x2: number, y: number) {
  return `${x1.toFixed(2)} ${y.toFixed(2)} m ${x2.toFixed(2)} ${y.toFixed(2)} l S`;
}

function formatExportDate(value: string | null) {
  return formatRsvpDate(value, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function buildPdfPage(rows: Rsvp[], pageIndex: number, totalPages: number, totalRows: number) {
  const lines: string[] = [];
  const generatedAt = formatRsvpDate(new Date().toISOString(), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  lines.push(fillColor(0.118, 0.106, 0.086));
  lines.push(rectangle(0, 0, PAGE_WIDTH, PAGE_HEIGHT));
  lines.push(fillColor(0.941, 0.694, 0));
  lines.push(rectangle(40, 770, 92, 28));
  lines.push(fillColor(1, 1, 1));
  lines.push(textLine(52, 780, "NAWABUS", 13));
  lines.push(fillColor(0.941, 0.694, 0));
  lines.push(textLine(40, 730, "Dashboard de Confirmacoes", 11));
  lines.push(fillColor(1, 1, 1));
  lines.push(textLine(40, 704, "Presencas Confirmadas", 24));
  lines.push(fillColor(0.82, 0.78, 0.66));
  lines.push(textLine(40, 682, `Total confirmado: ${totalRows} pessoas`, 11));
  lines.push(textLine(40, 666, `Gerado em: ${generatedAt}`, 9));
  lines.push(textLine(478, 666, `Pagina ${pageIndex + 1} de ${totalPages}`, 9));

  lines.push(fillColor(1, 0.973, 0.882));
  lines.push(rectangle(40, 626, 515, 28));
  lines.push(fillColor(0.16, 0.125, 0));
  lines.push(textLine(48, 636, "#", 9));
  lines.push(textLine(78, 636, "Nome", 9));
  lines.push(textLine(300, 636, "Telefone", 9));
  lines.push(textLine(390, 636, "Confirmado em", 9));
  lines.push(textLine(500, 636, "Estado", 9));

  let y = 602;
  const startIndex = pageIndex * ROWS_PER_PAGE;

  if (rows.length === 0) {
    lines.push(fillColor(1, 1, 1));
    lines.push(textLine(40, 580, "Ainda nao existem confirmacoes.", 12));
  }

  rows.forEach((rsvp, index) => {
    const rowNumber = startIndex + index + 1;

    if (index % 2 === 0) {
      lines.push(fillColor(0.16, 0.15, 0.13));
      lines.push(rectangle(40, y - 7, 515, 20));
    }

    lines.push(fillColor(1, 1, 1));
    lines.push(textLine(48, y, String(rowNumber), 8.5));
    lines.push(textLine(78, y, truncate(rsvp.nome, 34), 8.5));
    lines.push(textLine(300, y, `+244 ${formatTelefone(rsvp.telefone)}`, 8.5));
    lines.push(textLine(390, y, formatExportDate(rsvp.confirmado_em), 8.5));
    lines.push(
      textLine(500, y, rsvp.sms_status === "sent" ? "SMS enviado" : "Confirmado", 8.5)
    );
    lines.push(strokeColor(0.28, 0.25, 0.2));
    lines.push(horizontalLine(40, 555, y - 11));

    y -= 20;
  });

  lines.push(fillColor(0.82, 0.78, 0.66));
  lines.push(textLine(40, 34, "Nawabus - Rede Integrada de Transporte de Angola", 8));
  lines.push(textLine(431, 34, "nawabus.co.ao", 8));

  return lines.join("\n");
}

function buildPdf(contents: string[]) {
  const encoder = new TextEncoder();
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const pageRefs: string[] = [];

  contents.forEach((content) => {
    const pageObjectNumber = objects.length + 1;
    const contentObjectNumber = pageObjectNumber + 1;
    const contentLength = encoder.encode(content).length;

    pageRefs.push(`${pageObjectNumber} 0 R`);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`
    );
    objects.push(`<< /Length ${contentLength} >>\nstream\n${content}\nendstream`);
  });

  objects[1] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${contents.length} >>`;

  let pdf = "%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return encoder.encode(pdf);
}

function buildRsvpPdf(rsvps: Rsvp[]) {
  const chunks: Rsvp[][] = [];

  for (let index = 0; index < rsvps.length; index += ROWS_PER_PAGE) {
    chunks.push(rsvps.slice(index, index + ROWS_PER_PAGE));
  }

  if (chunks.length === 0) {
    chunks.push([]);
  }

  return buildPdf(
    chunks.map((chunk, index) => buildPdfPage(chunk, index, chunks.length, rsvps.length))
  );
}

export async function GET() {
  const rsvps = await getAllRsvps();
  const pdf = buildRsvpPdf(rsvps);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="nawabus-confirmados.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
