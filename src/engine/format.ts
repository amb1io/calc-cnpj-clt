export function textExcel(value: number, pattern: "#.##0,00" | "#.##0"): string {
  if (!Number.isFinite(value)) return pattern.includes(",") ? "0,00" : "0";

  const negative = value < 0;
  const abs = Math.abs(value);

  if (pattern === "#.##0,00") {
    const fixed = abs.toFixed(2);
    const [intPart, decPart] = fixed.split(".");
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const out = `${grouped},${decPart}`;
    return negative ? `-${out}` : out;
  }

  const rounded = Math.round(abs);
  const grouped = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return negative ? `-${grouped}` : grouped;
}

export function formatCurrencyInput(value: number): string {
  return textExcel(value, "#.##0,00");
}

export function parseCurrencyInput(raw: string): number {
  const cleaned = raw.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function sanitizeMoneyDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function formatMoneyDigits(digits: string): string {
  if (!digits) return "";
  const cents = Number.parseInt(digits, 10);
  if (!Number.isFinite(cents)) return "";
  return textExcel(cents / 100, "#.##0,00");
}

export function moneyDigitsToNumber(digits: string): number {
  if (!digits) return 0;
  const cents = Number.parseInt(digits, 10);
  return Number.isFinite(cents) ? cents / 100 : 0;
}

export function numberToMoneyDigits(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  return String(Math.round(value * 100));
}
