import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Cabecalho from "../../components/app/Cabecalho.jsx";
import Botao from "../../components/ui/Botao.jsx";
import ConfirmaDialogo from "../../components/ui/ConfirmaDialogo.jsx";
import EstadoVazio from "../../components/ui/EstadoVazio.jsx";
import Selo from "../../components/ui/Selo.jsx";
import useDados from "../../hooks/useDados.js";
import useTitulo from "../../hooks/useTitulo.js";
import { diasEntre, formatarData } from "../../lib/datas.js";
import { acoesPorTipo, filtrarPorPeriodo, maiorValor, percentual } from "../../lib/estatisticas.js";

const ACOES = {
  criou: { rotulo: "Criadas", verbo: "Criou", tom: "verde" },
  editou: { rotulo: "Editadas", verbo: "Editou", tom: "azul" },
  moveu: { rotulo: "Movidas", verbo: "Moveu", tom: "neutro" },
  removeu: { rotulo: "Removidas", verbo: "Removeu", tom: "rosa" },
  restaurou: { rotulo: "Restauradas", verbo: "Restaurou", tom: "verde" },
  excluiu: { rotulo: "Apagadas", verbo: "Apagou para sempre", tom: "rosa" },
  exportou: { rotulo: "Exportadas", verbo: "Exportou", tom: "marca" },
};

const PERIODOS = [
  { valor: "7", rotulo: "Últimos 7 dias" },
  { valor: "30", rotulo: "Últimos 30 dias" },
  { valor: "0", rotulo: "Todo o período" },
];

function rotuloDoDia(iso) {
  const d = diasEntre(iso);
  if (d <= 0) return "Hoje";
  if (d === 1) return "Ontem";
  return formatarData(iso);
}

export default function Historico() {
  useTitulo("Histórico e estatísticas");
  const { historico, pastas, notas, limparHistorico } = useDados();
  const [periodo, setPeriodo] = useState("7");
  const [limpando, setLimpando] = useState(false);

  const filtrado = useMemo(() => filtrarPorPeriodo(historico, Number(periodo)), [historico, periodo]);
  const porTipo = useMemo(() => acoesPorTipo(filtrado), [filtrado]);

  const porPasta = useMemo(() => {
    const linhas = [...pastas.map((p) => ({ id: p.id, nome: p.nome, cor: p.cor })), { id: "sem", nome: "Sem pasta", cor: "#566078" }].map((p) => ({
      ...p,
      total: filtrado.filter((h) => (h.pastaId ?? "sem") === p.id || (p.id === "sem" && !pastas.some((x) => x.id === h.pastaId))).length,
    }));
    return linhas.filter((l) => l.total > 0).sort((a, b) => b.total - a.total);
  }, [filtrado, pastas]);

  const grupos = useMemo(() => {
    const mapa = new Map();
    filtrado.forEach((h) => {
      const chave = rotuloDoDia(h.em);
      mapa.set(chave, [...(mapa.get(chave) ?? []), h]);
    });
    return [...mapa.entries()];
  }, [filtrado]);

  const topo = maiorValor(porPasta);
  const existe = (id) => notas.some((n) => n.id === id && !n.excluidaEm);

  return (
    <>
      <Cabecalho titulo="Histórico e estatísticas" descricao="O que foi adicionado, editado e removido, e quanto você usou cada disciplina.">
        <div className="grid gap-1">
          <label htmlFor="periodo" className="sr-only">
            Período
          </label>
          <select id="periodo" value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="rounded-lg border border-linha bg-white px-3 py-2.5 font-medium">
            {PERIODOS.map((p) => (
              <option key={p.valor} value={p.valor}>
                {p.rotulo}
              </option>
            ))}
          </select>
        </div>
        {historico.length > 0 && (
          <Botao variante="secundario" onClick={() => setLimpando(true)}>
            Limpar histórico
          </Botao>
        )}
      </Cabecalho>

      {filtrado.length === 0 ? (
        <EstadoVazio titulo="Sem atividade neste período" texto="Crie, edite ou mova notas e o histórico aparece aqui. Tente também um período maior." />
      ) : (
        <>
          <section aria-label="Total por tipo de ação" className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Object.entries(ACOES)
              .filter(([chave]) => porTipo[chave])
              .map(([chave, info]) => (
                <div key={chave} className="grid gap-1 rounded-2xl border border-linha bg-white p-5">
                  <span className="font-display text-4xl font-extrabold">{porTipo[chave]}</span>
                  <span className="text-sm text-grafite">{info.rotulo}</span>
                </div>
              ))}
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <section aria-labelledby="uso" className="grid content-start gap-4 rounded-2xl border border-linha bg-white p-6 lg:col-span-5">
              <h2 id="uso" className="text-2xl font-bold">
                Uso por disciplina
              </h2>
              <ul className="grid gap-3">
                {porPasta.map((p) => (
                  <li key={p.id} className="grid gap-1">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{p.nome}</span>
                      <span className="text-grafite">
                        {p.total} {p.total === 1 ? "ação" : "ações"} ({percentual(p.total, filtrado.length)}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-papel">
                      <div className="h-full rounded-full" style={{ width: `${Math.round((p.total / topo) * 100)}%`, background: p.cor }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="linha-tempo" className="grid content-start gap-4 lg:col-span-7">
              <h2 id="linha-tempo" className="text-2xl font-bold">
                Linha do tempo
              </h2>
              {grupos.map(([dia, itens]) => (
                <div key={dia} className="grid gap-2">
                  <h3 className="font-display text-lg font-bold">{dia}</h3>
                  <ul className="grid gap-1.5">
                    {itens.map((h) => (
                      <li key={h.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-linha bg-white px-4 py-2.5">
                        <Selo tom={ACOES[h.acao]?.tom}>{ACOES[h.acao]?.verbo ?? h.acao}</Selo>
                        {existe(h.notaId) ? (
                          <Link to={`/app/notas/${h.notaId}`} className="font-medium hover:underline">
                            {h.titulo}
                          </Link>
                        ) : (
                          <span className="font-medium">{h.titulo}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>
        </>
      )}

      <ConfirmaDialogo
        aberto={limpando}
        titulo="Limpar o histórico?"
        mensagem="As notas continuam intactas. Só o registro de atividades é apagado."
        rotuloConfirmar="Limpar histórico"
        perigo
        aoConfirmar={() => {
          limparHistorico();
          setLimpando(false);
        }}
        aoCancelar={() => setLimpando(false)}
      />
    </>
  );
}
