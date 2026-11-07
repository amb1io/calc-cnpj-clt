import { vlookupIrrf } from "./irrfTable";
import { textExcel } from "./format";

export const DEDUCAO_DEPENDENTE = 189.59;

export interface CalculatorInputs {
  salario: number | "";
  plrAnoClt: number;
  plrAnoPj: number;
  dependentesClt: number;
  dependentesPj: number;
  impostoPjPercent: number;
  descontosClt: {
    beneficioVrSaude: number;
    pensao: number;
    valeRefeicao: number;
    planoSaude: number;
    valeTransporte: number;
    outros: number;
  };
  descontosPj: {
    contador: number;
    reservaFerias: number;
    proLabore: number;
    software: number;
    seguroSaude: number;
    valeTransporte: number;
    estacionamento: number;
  };
  beneficiosClt: {
    valeRefeicao: number;
    planoSaude: number;
    seguroVida: number;
    educacao: number;
    homeOffice: number;
    transporte: number;
    combustivel: number;
    estacionamento: number;
    previdencia: number;
    outros: number;
  };
  beneficiosPjOutros: number;
}

export const defaultInputs: CalculatorInputs = {
  salario: 0,
  plrAnoClt: 0,
  plrAnoPj: 0,
  dependentesClt: 0,
  dependentesPj: 0,
  impostoPjPercent: 0,
  descontosClt: {
    beneficioVrSaude: 0,
    pensao: 0,
    valeRefeicao: 0,
    planoSaude: 0,
    valeTransporte: 0,
    outros: 0,
  },
  descontosPj: {
    contador: 0,
    reservaFerias: 0,
    proLabore: 0,
    software: 0,
    seguroSaude: 0,
    valeTransporte: 0,
    estacionamento: 0,
  },
  beneficiosClt: {
    valeRefeicao: 0,
    planoSaude: 0,
    seguroVida: 0,
    educacao: 0,
    homeOffice: 0,
    transporte: 0,
    combustivel: 0,
    estacionamento: 0,
    previdencia: 0,
    outros: 0,
  },
  beneficiosPjOutros: 0,
};

function calcInss(d9: number): number {
  return (
    Math.min(d9, 1621) * 0.075 +
    Math.max(0, Math.min(d9, 2902.84) - 1621) * 0.09 +
    Math.max(0, Math.min(d9, 4354.27) - 2902.84) * 0.12 +
    Math.max(0, Math.min(d9, 8475.55) - 4354.27) * 0.14
  );
}

function sumDescontosClt(d: CalculatorInputs["descontosClt"]): number {
  return (
    d.beneficioVrSaude +
    d.pensao +
    d.valeRefeicao +
    d.planoSaude +
    d.valeTransporte +
    d.outros
  );
}

function sumDescontosPj(d: CalculatorInputs["descontosPj"]): number {
  return (
    d.contador +
    d.reservaFerias +
    d.proLabore +
    d.software +
    d.seguroSaude +
    d.valeTransporte +
    d.estacionamento
  );
}

function sumBeneficiosClt(b: CalculatorInputs["beneficiosClt"]): number {
  return (
    b.valeRefeicao +
    b.planoSaude +
    b.seguroVida +
    b.educacao +
    b.homeOffice +
    b.transporte +
    b.combustivel +
    b.estacionamento +
    b.previdencia +
    b.outros
  );
}

export interface CalculatorOutputs {
  salarioBase: number | "";
  decimoTerceiro: number | "";
  feriasTerco: number | "";
  plrMesClt: number | "";
  baseIrrf: number | "";
  inss: number | "";
  irrf: number | "";
  totalBeneficiosClt: number;
  totalDescontosClt: number;
  liquidoClt: number | "";
  brutoClt: number | "";
  beneficiosCltAnual: number;
  descontosCltAnual: number;
  liquidoCltAnual: number | "";
  brutoCltAnual: number | "";
  faturamentoPj: number | "";
  totalBeneficiosPj: number;
  totalDescontosPj: number | "";
  liquidoPj: number | "";
  brutoPj: number | "";
  beneficiosPjAnual: number | "";
  descontosPjAnual: number | "";
  liquidoPjAnual: number | "";
  vantagemTexto: string;
  totalMensalTexto: string;
  totalAnualTexto: string;
  diferencaAnual: number | "";
  simulacaoTexto: string;
}

export function calculate(inputs: CalculatorInputs): CalculatorOutputs {
  const d9 = inputs.salario;
  const empty = d9 === "";
  const salarioNum = empty ? 0 : d9;

  const e22 = empty ? ("" as const) : calcInss(salarioNum);
  const e21 =
    empty || e22 === ""
      ? ("" as const)
      : salarioNum - (e22 as number) - inputs.dependentesClt * DEDUCAO_DEPENDENTE;

  let e23: number | "" = "";
  if (e21 !== "") {
    const { aliquota, deducao } = vlookupIrrf(e21);
    e23 = e21 * aliquota - deducao;
    if (!Number.isFinite(e23)) e23 = 0;
  }

  const e45 = sumBeneficiosClt(inputs.beneficiosClt);
  const e46 = sumDescontosClt(inputs.descontosClt);

  const e47: number | "" = empty
    ? ""
    : salarioNum -
      (e22 === "" ? 0 : e22) -
      (e23 === "" ? 0 : e23) -
      e46 +
      e45;

  const j45 = inputs.beneficiosPjOutros;
  const j46: number | "" = empty ? "" : sumDescontosPj(inputs.descontosPj);

  const j13 = empty ? ("" as const) : salarioNum;
  const j47: number | "" =
    empty || j13 === ""
      ? ""
      : j13 * (1 - inputs.impostoPjPercent) - sumDescontosPj(inputs.descontosPj);

  const e51: number | "" = e47 === "" ? "" : e47 * 12;
  const j51: number | "" = empty || j47 === "" ? "" : j47 * 12;

  const e47n = e47 === "" ? 0 : e47;
  const j47n = j47 === "" ? 0 : j47;

  const vantagemTexto =
    `A VANTAGEM REAL É DE R$ ${textExcel(Math.abs(j47n - e47n), "#.##0,00")}` +
    ` A FAVOR DO ${j47n > e47n ? "MODELO PJ" : "MODELO CLT"}`;

  const plrMes = empty ? 0 : inputs.plrAnoClt / 12;

  const totalMensalTexto =
    `TOTAL CLT: R$ ${textExcel(e47n, "#.##0")} (inclui R$ ${textExcel(e45, "#.##0")} em benefícios)  |  ` +
    `PLR (anual, referência): R$ ${textExcel(inputs.plrAnoClt, "#.##0")} [média mensal: R$ ${textExcel(plrMes, "#.##0")}]  |  ` +
    `TOTAL PJ: R$ ${textExcel(j47n, "#.##0")} (inclui R$ ${textExcel(j45, "#.##0")} em benefícios)`;

  const e51n = e51 === "" ? 0 : e51;
  const j51n = j51 === "" ? 0 : j51;

  const totalAnualTexto =
    `EM 12 MESES: CLT=R$ ${textExcel(e51n + inputs.plrAnoClt, "#.##0,00")}` +
    `(R$ ${textExcel(e51n, "#.##0,00")} de salário líquido+benefícios,R$ ${textExcel(inputs.plrAnoClt, "#.##0,00")} de PLR)| PJ=R$ ${textExcel(j51n + inputs.dependentesPj, "#.##0,00")}` +
    `(R$ ${textExcel(j51n, "#.##0,00")} de líquido+benefícios,R$ ${textExcel(inputs.dependentesPj, "#.##0,00")} de bônus/PLR)`;

  const diferencaAnual = j51 === "" ? "" : j51n - (e51n + inputs.plrAnoClt);

  const simulacaoTexto = `A simulação compara CLT e PJ para um salário de R$ ${textExcel(salarioNum, "#.##0,00")} por mês (o mesmo valor é usado como faturamento mensal no cenário PJ).`;

  return {
    salarioBase: empty ? "" : salarioNum,
    decimoTerceiro: empty ? "" : salarioNum / 12,
    feriasTerco: empty ? "" : (salarioNum / 12) * 1.33,
    plrMesClt: empty ? "" : inputs.plrAnoClt / 12,
    baseIrrf: e21,
    inss: e22,
    irrf: e23,
    totalBeneficiosClt: e45,
    totalDescontosClt: e46,
    liquidoClt: e47,
    brutoClt: empty ? "" : salarioNum,
    beneficiosCltAnual: e45 * 12,
    descontosCltAnual: e46 * 12,
    liquidoCltAnual: e51,
    brutoCltAnual: empty ? "" : salarioNum * 12,
    faturamentoPj: j13,
    totalBeneficiosPj: j45,
    totalDescontosPj: j46,
    liquidoPj: j47,
    brutoPj: empty ? "" : salarioNum,
    beneficiosPjAnual: empty ? "" : j45 * 12,
    descontosPjAnual: j46 === "" ? "" : j46 * 12,
    liquidoPjAnual: j51,
    vantagemTexto,
    totalMensalTexto,
    totalAnualTexto,
    diferencaAnual,
    simulacaoTexto,
  };
}

export function calcularPjEquivalente(inputs: CalculatorInputs, maxFaturamento = 500_000): number | null {
  if (inputs.salario === "") return null;

  const clt = calculate(inputs);
  const alvoClt = (clt.liquidoCltAnual === "" ? 0 : clt.liquidoCltAnual) + inputs.plrAnoClt;

  const pjLiquidoAnual = (faturamento: number) => {
    const j47 = faturamento * (1 - inputs.impostoPjPercent) - sumDescontosPj(inputs.descontosPj);
    return j47 * 12 + inputs.dependentesPj;
  };

  let lo = 0;
  let hi = Math.max((inputs.salario as number) * 3, 1);
  while (pjLiquidoAnual(hi) < alvoClt && hi < maxFaturamento) hi *= 2;
  if (pjLiquidoAnual(hi) < alvoClt) return null;

  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (pjLiquidoAnual(mid) >= alvoClt) hi = mid;
    else lo = mid;
  }
  return hi;
}
