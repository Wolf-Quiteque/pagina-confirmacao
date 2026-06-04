import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatRsvpDate, formatTelefone, getDashboardSupabase, type Rsvp } from "@/lib/rsvps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type NawadashProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

function parsePage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "1", 10);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}

function pageHref(page: number) {
  return `/nawadash?page=${page}`;
}

function PaginationButton({
  disabled,
  href,
  children,
}: {
  disabled: boolean;
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-bold transition-all duration-200";

  if (disabled) {
    return (
      <span className={`${className} cursor-not-allowed bg-white/8 text-primary-muted/25`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${className} bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary-ring hover:shadow-primary/35`}
    >
      {children}
    </Link>
  );
}

export default async function NawadashPage({ searchParams }: NawadashProps) {
  const page = parsePage((await searchParams).page);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = getDashboardSupabase();

  const { data, count, error } = await supabase
    .from("event_rsvps")
    .select("id,nome,telefone,confirmado_em,sms_status", { count: "exact" })
    .order("confirmado_em", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to load confirmations: ${error.message}`);
  }

  const rsvps = (data ?? []) as Rsvp[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (total > 0 && page > totalPages) {
    redirect(pageHref(totalPages));
  }

  const firstResult = total === 0 ? 0 : from + 1;
  const lastResult = Math.min(from + rsvps.length, total);

  return (
    <main className="min-h-screen overflow-hidden bg-brand-ink text-white">
      <section className="relative min-h-screen px-6 py-10 sm:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-ink-raised via-brand-ink to-[#12110e]" />
        <div
          className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 24%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex w-fit items-center justify-center"
              aria-label="Voltar para a pagina inicial"
            >
              <Image
                src="/nawabus_logo_white.webp"
                alt="Nawabus"
                width={120}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/nawadash/export"
                className="inline-flex h-12 w-fit items-center justify-center rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary-ring hover:shadow-primary/35"
              >
                Exportar PDF
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 w-fit items-center justify-center rounded-2xl border border-primary/25 px-5 text-sm font-bold text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
              >
                Voltar ao convite
              </Link>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                Dashboard de Confirmacoes
              </p>
              <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
                Presencas
                <br />
                <span className="shimmer-text">Confirmadas</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-muted/60">
                Lista atualizada das pessoas que confirmaram presenca na inauguracao da nova sede Nawabus.
              </p>
            </div>

            <div className="rounded-3xl border border-primary/25 bg-white/8 p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="text-sm font-semibold uppercase tracking-widest text-primary-muted/55">
                Total confirmado
              </div>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-6xl font-black leading-none text-primary sm:text-7xl">
                  {total}
                </span>
                <span className="pb-2 text-sm font-semibold text-primary-muted/50">
                  pessoas
                </span>
              </div>
            </div>
          </div>

          <section className="overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-2xl shadow-black/25">
            <div className="flex flex-col gap-2 border-b border-primary/15 bg-primary-soft px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
              <div>
                <h2 className="text-xl font-black text-foreground">Lista de confirmados</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {total === 0
                    ? "Ainda nao existem confirmacoes."
                    : `A mostrar ${firstResult}-${lastResult} de ${total}.`}
                </p>
              </div>
              <div className="text-sm font-bold text-primary">
                Pagina {Math.min(page, totalPages)} de {totalPages}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {rsvps.length > 0 ? (
                rsvps.map((rsvp, index) => (
                  <div
                    key={rsvp.id}
                    className="grid gap-4 px-5 py-5 transition-colors hover:bg-primary-soft/40 sm:grid-cols-[4rem_1fr_11rem_12rem] sm:items-center sm:px-7"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-ring text-sm font-black text-primary-foreground shadow-lg shadow-primary/25">
                      {from + index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-base font-black text-foreground">
                        {rsvp.nome}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-gray-400">
                        +244 {formatTelefone(rsvp.telefone)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatRsvpDate(rsvp.confirmado_em)}
                    </div>
                    <div className="sm:text-right">
                      <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700 ring-1 ring-green-100">
                        {rsvp.sms_status === "sent" ? "SMS enviado" : "Confirmado"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-16 text-center sm:px-7">
                  <p className="text-lg font-black text-foreground">Sem confirmacoes</p>
                  <p className="mt-2 text-sm text-gray-400">
                    As presencas confirmadas vao aparecer aqui.
                  </p>
                </div>
              )}
            </div>
          </section>

          <nav className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <PaginationButton disabled={page <= 1} href={pageHref(page - 1)}>
              Anterior
            </PaginationButton>

            <div className="rounded-2xl border border-primary/15 bg-white/8 px-5 py-3 text-center text-sm font-semibold text-primary-muted/55">
              10 pessoas por pagina
            </div>

            <PaginationButton disabled={page >= totalPages} href={pageHref(page + 1)}>
              Seguinte
            </PaginationButton>
          </nav>
        </div>
      </section>
    </main>
  );
}
