import { describe, expect, it } from "vitest";
import { calculate, defaultInputs } from "./calculator";

describe("Calculadora", () => {
  it("INSS/IRRF/líquido para R$ 10.000", () => {
    const out = calculate({ ...defaultInputs, salario: 10000 });
    expect(out.inss).toBeCloseTo(988.0914, 2);
    expect(out.baseIrrf).toBeCloseTo(9011.9086, 2);
    expect(out.irrf).toBeCloseTo(1582.2749, 2);
    expect(out.liquidoClt).toBeCloseTo(7429.6337, 2);
  });

  it("líquido PJ com 11%", () => {
    const out = calculate({ ...defaultInputs, salario: 10000, impostoPjPercent: 0.11 });
    expect(out.liquidoPj).toBeCloseTo(8900, 2);
    expect(out.vantagemTexto).toContain("MODELO PJ");
    expect(out.vantagemTexto).toContain("1.470,37");
  });
});
