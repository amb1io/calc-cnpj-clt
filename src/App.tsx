import { useMemo, useState } from "react";
import {
  calcularPjEquivalente,
  calculate,
  defaultInputs,
  type CalculatorInputs,
} from "./engine/calculator";
import { formatCurrencyInput } from "./engine/format";
import { faqContent } from "./content/faq";
import { entendaConclusao, entendaRows } from "./content/entenda";
import { IntField, MoneyField, PercentField } from "./components/MoneyField";

type Tab = "calculadora" | "faq" | "entenda";

function num(v: number | ""): number {
  return v === "" ? 0 : v;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("calculadora");
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);

  const outputs = useMemo(() => calculate(inputs), [inputs]);
  const pjEquivalente = useMemo(() => calcularPjEquivalente(inputs), [inputs]);

  const patch = (partial: Partial<CalculatorInputs>) =>
    setInputs((prev) => ({ ...prev, ...partial }));

  return (
    <div className="app">
      <div className="site-top">
        <header className="header">
          <div className="brand-row">
            <img src="./logo.svg" alt="amb1" className="brand-logo" />
            <div className="brand-text">
              <h1>Calculadora CLT × PJ</h1>
              <p>Comparativo salarial com fórmulas da planilha InfoMoney</p>
            </div>
          </div>
          <nav className="tabs" role="tablist">
          {(
            [
              ["calculadora", "Calculadora"],
              ["entenda", "Entenda CLT x PJ"],
              ["faq", "FAQ"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={tab === id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
          </nav>
        </header>
      </div>

      <main>
        {tab === "calculadora" && (
          <div className="calc-layout">
            <section className="salary-banner card">
              <MoneyField
                label="Informe o seu salário (CLT) ou faturamento de referência (PJ)"
                value={inputs.salario === "" ? 0 : inputs.salario}
                onChange={(salario) => patch({ salario })}
                hint="Digite apenas números — formatação em tempo real (ex.: 1000000 → 10.000,00)."
              />
            </section>

            <div className="columns">
              <section className="card regime clt">
                <h2>Regime CLT</h2>
                <div className="grid-2">
                  <MoneyField label="Salário Base" value={num(outputs.salarioBase)} onChange={() => {}} readOnly />
                  <MoneyField
                    label="13º Salário (proporcional 1/12)"
                    value={num(outputs.decimoTerceiro)}
                    onChange={() => {}}
                    readOnly
                  />
                  <MoneyField
                    label="Férias + 1/3 (proporcional 1/12)"
                    value={num(outputs.feriasTerco)}
                    onChange={() => {}}
                    readOnly
                  />
                  <MoneyField
                    label="PLR Estimada (Ano)"
                    value={inputs.plrAnoClt}
                    onChange={(plrAnoClt) => patch({ plrAnoClt })}
                  />
                  <MoneyField
                    label="PLR Estimada (Mês)"
                    value={num(outputs.plrMesClt)}
                    onChange={() => {}}
                    readOnly
                  />
                  <IntField
                    label="Nº de dependentes (IRRF)"
                    value={inputs.dependentesClt}
                    onChange={(dependentesClt) => patch({ dependentesClt })}
                  />
                </div>

                <h3>Descontos</h3>
                <div className="grid-2">
                  <MoneyField label="Base IRRF" value={num(outputs.baseIrrf)} onChange={() => {}} readOnly />
                  <MoneyField label="(-) INSS (Desconto)" value={num(outputs.inss)} onChange={() => {}} readOnly />
                  <MoneyField label="(-) IRRF (Desconto)" value={num(outputs.irrf)} onChange={() => {}} readOnly />
                  <MoneyField
                    label="(-) Desconto Benefícios (VR/Saúde)"
                    value={inputs.descontosClt.beneficioVrSaude}
                    onChange={(v) => patch({ descontosClt: { ...inputs.descontosClt, beneficioVrSaude: v } })}
                  />
                  <MoneyField
                    label="(-) Pensão alimentícia judicial"
                    value={inputs.descontosClt.pensao}
                    onChange={(v) => patch({ descontosClt: { ...inputs.descontosClt, pensao: v } })}
                  />
                  <MoneyField
                    label="(-) Vale Refeição / Alim."
                    value={inputs.descontosClt.valeRefeicao}
                    onChange={(v) => patch({ descontosClt: { ...inputs.descontosClt, valeRefeicao: v } })}
                  />
                  <MoneyField
                    label="(-) Plano de Saúde (Valor Empresa)"
                    value={inputs.descontosClt.planoSaude}
                    onChange={(v) => patch({ descontosClt: { ...inputs.descontosClt, planoSaude: v } })}
                  />
                  <MoneyField
                    label="(-) Vale transporte"
                    value={inputs.descontosClt.valeTransporte}
                    onChange={(v) => patch({ descontosClt: { ...inputs.descontosClt, valeTransporte: v } })}
                  />
                  <MoneyField
                    label="(-) Outros descontos"
                    value={inputs.descontosClt.outros}
                    onChange={(v) => patch({ descontosClt: { ...inputs.descontosClt, outros: v } })}
                  />
                </div>

                <h3>Benefícios</h3>
                <div className="grid-2">
                  <MoneyField
                    label="Vale Refeição / Alim."
                    value={inputs.beneficiosClt.valeRefeicao}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, valeRefeicao: v } })}
                  />
                  <MoneyField
                    label="Plano de Saúde (Valor Empresa)"
                    value={inputs.beneficiosClt.planoSaude}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, planoSaude: v } })}
                  />
                  <MoneyField
                    label="Seguro de Vida"
                    value={inputs.beneficiosClt.seguroVida}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, seguroVida: v } })}
                  />
                  <MoneyField
                    label="Auxílio Educação/Creche"
                    value={inputs.beneficiosClt.educacao}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, educacao: v } })}
                  />
                  <MoneyField
                    label="Auxílio home office"
                    value={inputs.beneficiosClt.homeOffice}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, homeOffice: v } })}
                  />
                  <MoneyField
                    label="Vale transporte"
                    value={inputs.beneficiosClt.transporte}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, transporte: v } })}
                  />
                  <MoneyField
                    label="Vale combustível"
                    value={inputs.beneficiosClt.combustivel}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, combustivel: v } })}
                  />
                  <MoneyField
                    label="Estacionamento"
                    value={inputs.beneficiosClt.estacionamento}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, estacionamento: v } })}
                  />
                  <MoneyField
                    label="Previdência Privada (Match)"
                    value={inputs.beneficiosClt.previdencia}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, previdencia: v } })}
                  />
                  <MoneyField
                    label="Outros benefícios"
                    value={inputs.beneficiosClt.outros}
                    onChange={(v) => patch({ beneficiosClt: { ...inputs.beneficiosClt, outros: v } })}
                  />
                </div>

                <div className="totals">
                  <SummaryRow label="(+) Valor total dos benefícios (mensal)" value={outputs.totalBeneficiosClt} />
                  <SummaryRow label="(-) Total custos e descontos (mensal)" value={outputs.totalDescontosClt} negative />
                  <SummaryRow label="Líquido real — salário + benefícios (mensal)" value={num(outputs.liquidoClt)} highlight />
                  <SummaryRow label="Bruto real (mensal)" value={num(outputs.brutoClt)} />
                  <SummaryRow label="(+) Benefícios (anual)" value={outputs.beneficiosCltAnual} />
                  <SummaryRow label="(-) Custos e descontos (anual)" value={outputs.descontosCltAnual} negative />
                  <SummaryRow label="Líquido real (anual)" value={num(outputs.liquidoCltAnual)} highlight />
                  <SummaryRow label="Bruto real (anual)" value={num(outputs.brutoCltAnual)} />
                </div>
              </section>

              <section className="card regime pj">
                <h2>Regime PJ</h2>
                <div className="grid-2">
                  <MoneyField label="Faturamento" value={num(outputs.faturamentoPj)} onChange={() => {}} readOnly />
                  <PercentField
                    label="Imposto PJ (%) — alíquota total (DAS + outros)"
                    value={inputs.impostoPjPercent}
                    onChange={(impostoPjPercent) => patch({ impostoPjPercent })}
                    hint="Percentual efetivo sobre o faturamento."
                  />
                  <MoneyField
                    label="PLR Estimada (Ano)"
                    value={inputs.plrAnoPj}
                    onChange={(plrAnoPj) => patch({ plrAnoPj })}
                  />
                  <IntField
                    label="Nº de dependentes (campo J17 — usado no total anual PJ)"
                    value={inputs.dependentesPj}
                    onChange={(dependentesPj) => patch({ dependentesPj })}
                  />
                </div>

                <p className="note">
                  No PJ, o imposto costuma sair por guias (DAS etc.), não como retenção em folha. Ajuste o percentual
                  conforme seu contador.
                </p>

                <h3>Descontos</h3>
                <div className="grid-2">
                  <MoneyField
                    label="(-) Contador Mensal"
                    value={inputs.descontosPj.contador}
                    onChange={(v) => patch({ descontosPj: { ...inputs.descontosPj, contador: v } })}
                  />
                  <MoneyField
                    label="(-) Reserva Férias (Mês Parado)"
                    value={inputs.descontosPj.reservaFerias}
                    onChange={(v) => patch({ descontosPj: { ...inputs.descontosPj, reservaFerias: v } })}
                  />
                  <MoneyField
                    label="(-) Pró-labore (Impostos/Taxas)"
                    value={inputs.descontosPj.proLabore}
                    onChange={(v) => patch({ descontosPj: { ...inputs.descontosPj, proLabore: v } })}
                  />
                  <MoneyField
                    label="(-) Software/Equipamentos"
                    value={inputs.descontosPj.software}
                    onChange={(v) => patch({ descontosPj: { ...inputs.descontosPj, software: v } })}
                  />
                  <MoneyField
                    label="(-) Seguro Saúde (Próprio)"
                    value={inputs.descontosPj.seguroSaude}
                    onChange={(v) => patch({ descontosPj: { ...inputs.descontosPj, seguroSaude: v } })}
                  />
                  <MoneyField
                    label="(-) Vale transporte"
                    value={inputs.descontosPj.valeTransporte}
                    onChange={(v) => patch({ descontosPj: { ...inputs.descontosPj, valeTransporte: v } })}
                  />
                  <MoneyField
                    label="(-) Estacionamento"
                    value={inputs.descontosPj.estacionamento}
                    onChange={(v) => patch({ descontosPj: { ...inputs.descontosPj, estacionamento: v } })}
                  />
                </div>

                <h3>Benefícios</h3>
                <MoneyField
                  label="Outros benefícios"
                  value={inputs.beneficiosPjOutros}
                  onChange={(beneficiosPjOutros) => patch({ beneficiosPjOutros })}
                />

                <div className="totals">
                  <SummaryRow label="(+) Valor total dos benefícios (mensal)" value={outputs.totalBeneficiosPj} />
                  <SummaryRow label="(-) Total custos e descontos (mensal)" value={num(outputs.totalDescontosPj)} negative />
                  <SummaryRow label="Líquido real (mensal)" value={num(outputs.liquidoPj)} highlight />
                  <SummaryRow label="Bruto real (mensal)" value={num(outputs.brutoPj)} />
                  <SummaryRow label="(+) Benefícios (anual)" value={num(outputs.beneficiosPjAnual)} />
                  <SummaryRow label="(-) Custos e descontos (anual)" value={num(outputs.descontosPjAnual)} negative />
                  <SummaryRow label="Líquido real (anual)" value={num(outputs.liquidoPjAnual)} highlight />
                </div>
              </section>
            </div>

            <section className="card results">
              <h2 className="section-tag">Mensal</h2>
              <p className="highlight-box">{outputs.vantagemTexto}</p>
              <p>{outputs.totalMensalTexto}</p>

              <h2 className="section-tag">Anual</h2>
              <p>{outputs.totalAnualTexto}</p>
              {outputs.diferencaAnual !== "" && (
                <p className="diff">
                  Diferença anual (PJ − CLT incl. PLR): R$ {formatCurrencyInput(outputs.diferencaAnual)}
                </p>
              )}

              <p className="footnote">{outputs.simulacaoTexto}</p>

              <div className="equivalente">
                <h3>PJ equivalente (Atingir meta)</h3>
                <p>
                  Faturamento mensal PJ que aproxima o total anual do CLT (líquido + benefícios + PLR), com os mesmos
                  custos PJ informados.
                </p>
                {pjEquivalente != null ? (
                  <p className="highlight-box">
                    Faturamento PJ equivalente: R$ {formatCurrencyInput(pjEquivalente)} / mês
                  </p>
                ) : (
                  <p>Preencha o salário para calcular.</p>
                )}
              </div>
            </section>
          </div>
        )}

        {tab === "entenda" && (
          <section className="card content-page">
            <h2>Entenda CLT x PJ</h2>
            <div className="entenda-grid">
              <div className="entenda-head clt">🟦 CLT</div>
              <div className="entenda-head pj">🟨 PJ</div>
              {entendaRows.map((row, i) => (
                <EntendaPair key={i} row={row} />
              ))}
            </div>
            <div className="conclusao">
              <h3>{entendaConclusao.title}</h3>
              <p>{entendaConclusao.intro}</p>
              <ul>
                {entendaConclusao.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p>{entendaConclusao.footer}</p>
            </div>
          </section>
        )}

        {tab === "faq" && (
          <section className="card content-page faq">
            <h2>{faqContent.title}</h2>
            {faqContent.sections.map((s) => (
              <article key={s.heading}>
                <h3>{s.heading}</h3>
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          <a href="https://amb1.io">amb1</a> · Tabela IRRF 2026 · Hospedado na Cloudflare Pages
        </p>
      </footer>
    </div>
  );
}

function EntendaPair({ row }: { row: (typeof entendaRows)[number] }) {
  return (
    <>
      <article className="entenda-cell clt">
        <h3>{row.clt.title}</h3>
        <p>{row.clt.text}</p>
      </article>
      <article className="entenda-cell pj">
        <h3>{row.pj.title}</h3>
        <p>{row.pj.text}</p>
      </article>
    </>
  );
}

function SummaryRow({
  label,
  value,
  negative,
  highlight,
}: {
  label: string;
  value: number;
  negative?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`summary-row ${highlight ? "highlight" : ""}`}>
      <span>{label}</span>
      <strong className={negative ? "negative" : ""}>R$ {formatCurrencyInput(value)}</strong>
    </div>
  );
}
