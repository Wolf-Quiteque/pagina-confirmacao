import { createClient } from "@supabase/supabase-js";

export type Rsvp = {
  id: string;
  nome: string;
  telefone: string;
  confirmado_em: string | null;
  sms_status: string | null;
};

export function getDashboardSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and a Supabase key are required for the dashboard."
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function formatTelefone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(-9);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function formatRsvpDate(
  value: string | null,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  }
) {
  if (!value) return "Sem data";

  return new Intl.DateTimeFormat("pt-AO", {
    ...options,
    timeZone: "Africa/Luanda",
  }).format(new Date(value));
}

export async function getAllRsvps() {
  const supabase = getDashboardSupabase();
  const pageSize = 1000;
  const allRsvps: Rsvp[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("event_rsvps")
      .select("id,nome,telefone,confirmado_em,sms_status")
      .order("confirmado_em", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      throw new Error(`Failed to load confirmations: ${error.message}`);
    }

    const page = (data ?? []) as Rsvp[];
    allRsvps.push(...page);

    if (page.length < pageSize) {
      return allRsvps;
    }
  }
}
