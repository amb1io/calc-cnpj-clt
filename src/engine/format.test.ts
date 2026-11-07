import { describe, expect, it } from "vitest";
import { formatMoneyDigits, moneyDigitsToNumber, sanitizeMoneyDigits } from "./format";

describe("formatMoneyDigits", () => {
  it("formata centavos", () => {
    expect(formatMoneyDigits("1000000")).toBe("10.000,00");
    expect(formatMoneyDigits("1")).toBe("0,01");
  });

  it("sanitiza paste", () => {
    expect(sanitizeMoneyDigits("10a.000,50b")).toBe("1000050");
    expect(moneyDigitsToNumber("1000050")).toBe(10000.5);
  });
});
