/** Tabela progressiva IRRF 2026 — planilha `base!A2:D6` */
export const IRRF_ROWS = [
  { baseInicial: 0, baseFinal: 2259.2, aliquota: 0, deducao: 0 },
  { baseInicial: 2259.21, baseFinal: 2826.65, aliquota: 0.075, deducao: 164.44 },
  { baseInicial: 2826.66, baseFinal: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { baseInicial: 3751.06, baseFinal: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { baseInicial: 4664.69, baseFinal: 999999, aliquota: 0.275, deducao: 896 },
] as const;

export function vlookupIrrf(baseCalculo: number): { aliquota: number; deducao: number } {
  let row = IRRF_ROWS[0];
  for (const r of IRRF_ROWS) {
    if (baseCalculo >= r.baseInicial) row = r;
    else break;
  }
  return { aliquota: row.aliquota, deducao: row.deducao };
}
