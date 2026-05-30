export function getWhatsappLink(phone: string, message?: string) {
  if (!phone) return "#";
  const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits

  const base = `https://wa.me/${cleanPhone}`;

  if (!message) return base;

  const encodedMsg = message ? encodeURIComponent(message) : "";
  return `${base}?text=${encodedMsg}`;
}

export function shortId(id: string | number, length = 8) {
  if (!id) return "-";
  if (typeof id !== "string") return id;
  return id.slice(0, length);
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
