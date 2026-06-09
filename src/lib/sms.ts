const SMS_API_URL =
  process.env.SMS_API_URL || "https://mimo-sms-rest-api.vercel.app/send-sms";

export function toSmsSafeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x0A\x0D\x20-\x7E]/g, "")
    .trim();
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-9);
}

export async function sendSms(
  telefone: string,
  text: string
): Promise<{ sent: boolean; status: string }> {
  const phoneClean = normalizePhone(telefone);

  if (phoneClean.length !== 9) {
    return { sent: false, status: "invalid_phone" };
  }

  try {
    const response = await fetch(SMS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phoneClean, text: toSmsSafeText(text) }),
    });

    if (response.ok) {
      return { sent: true, status: "sent" };
    }

    console.error("SMS API error:", response.status, await response.text());
    return { sent: false, status: "failed" };
  } catch (error) {
    console.error("SMS send error:", error);
    return { sent: false, status: "failed" };
  }
}
