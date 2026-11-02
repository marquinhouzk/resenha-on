import { useMemo } from "react";
import { Link } from "react-router-dom";
import Cabecalho from "../../components/app/Cabecalho.jsx";
import NotaCard from "../../components/app/NotaCard.jsx";
import Botao from "../../components/ui/Botao.jsx";
import EstadoVazio from "../../components/ui/EstadoVazio.jsx";
import useAuth from "../../hooks/useAuth.js";
import useDados from "../../hooks/useDados.js";
import useNotificacoes from "../../hooks/useNotificacoes.js";
import useTitulo from "../../hooks/useTitulo.js";
import { atividadePorDia, contagemPorPasta, maiorValor, resumoNotas, sequenciaDeDias } from "../../lib/estatisticas.js";
import { ordenarNotas } from "../../lib/busca.js";

function Numero({ valor, rotulo }) {
  return (
    <div className="grid gap-1 rounded-2xl border border-linha bg-white p-5">
      <span className="font-display text-4xl font-extrabold">{valor}</span>
      <span className="text-sm text-grafite">{rotulo}</span>
    </div>
  );
}

export default function Dashboard() {
  useTitulo("Início");
  const { usuario } = useAuth();
  const { notas, notasAtivas, pastas, historico, config, alternarFavorita } = useDados();
  const avisos = useNotificacoes(notas, config);

  const resumo = useMemo(() => resumoNotas(notas), [notas]);
  const porPasta = useMemo(() => contagemPorPasta(notasAtivas, pastas), [notasAtivas, pastas]);
  const semana = useMemo(() => atividadePorDia(historico, 7), [historico]);
  const sequencia = useMemo(() => sequenciaDeDias(historico), [historico]);
  const recentes = useMemo(() => ordenarNotas(notasAtivas, "recentes").slice(0, 4), [notasAtivas]);
  const pastaPorId = useMemo(() => Object.fromEntries(pastas.map((p) => [p.id, p])), [pastas]);
  const topo = maiorValor(semana);
  const primeiroNome = usuario.nome.split(" ")[0];

  if (notasAtivas.length === 0) {
    return (
      <>
        <Cabecalho titulo={`Olá, ${primeiroNome}.`} descricao="Seu caderno ainda está em branco." />
        <EstadoVazio titulo="Faça a sua primeira captura" texto="Escolha um quadro, slide ou apostila e veja o texto aparecer organizado na pasta certa.">
          <Botao as={Link} to="/app/capturar" variante="marca">
            Capturar agora
          </Botao>
          <Botao as={Link} to="/app/notas/nova" variante="secundario">
            Escrever uma nota
          </Botao>
        </EstadoVazio>
      </>
    );
  }

  return (
    <>
      <Cabecalho titulo={`Olá, ${primeiroNome}.`} descricao={sequencia > 1 ? `Você usou o caderno ${sequencia} dias seguidos. Siga assim.` : "Veja o que você capturou e o que está para vencer."}>
        <Botao as={Link} to="/app/notas/nova" variante="secundario">
          Nova nota
        </Botao>
      </Cabecalho>

      <section aria-label="Resumo" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Numero valor={resumo.ativas} rotulo="notas no caderno" />
        <Numero valor={resumo.capturadas} rotulo="capturadas pela câmera" />
        <Numero valor={resumo.confiancaMedia == null ? "-" : `${resumo.confiancaMedia}%`} rotulo="confiança média do texto" />
        <Numero valor={`${resumo.privadas}/${resumo.publicas}`} rotulo="privadas / públicas" />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <section aria-labelledby="atividade" className="grid content-start gap-4 rounded-2xl border border-linha bg-white p-6 lg:col-span-7">
          <h2 id="atividade" className="text-2xl font-bold">
            Atividade da semana
          </h2>
          <ol className="grid h-40 grid-cols-7 items-end gap-2">
            {semana.map((d) => (
              <li key={d.data} className="grid h-full grid-rows-[1fr_auto] justify-items-center gap-1">
                <div className="flex w-full items-end">
                  <div
                    role="img"
                    aria-label={`${d.rotulo}: ${d.total} ações`}
                    className={`w-full rounded-t-md ${d.hoje ? "bg-jovi" : "bg-jovi/35"}`}
                    style={{ height: `${Math.max(d.total ? 8 : 3, Math.round((d.total / topo) * 100))}%` }}
                  />
                </div>
                <span className={`text-xs ${d.hoje ? "font-bold" : "text-grafite"}`}>{d.rotulo}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="por-pasta" className="grid content-start gap-4 rounded-2xl border border-linha bg-white p-6 lg:col-span-5">
          <h2 id="por-pasta" className="text-2xl font-bold">
            Por disciplina
          </h2>
          <ul className="grid gap-3">
            {porPasta.map((p) => (
              <li key={p.id} className="grid gap-1">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{p.nome}</span>
                  <span className="text-grafite">{p.total} ({p.percentual}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-papel">
                  <div className="h-full rounded-full" style={{ width: `${p.percentual}%`, background: p.cor }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {avisos.filter((a) => a.tipo === "lembrete" || a.tipo === "vencido").length > 0 && (
        <section aria-labelledby="lembretes" className="mt-6 grid gap-3 rounded-2xl bg-marca p-6">
          <h2 id="lembretes" className="text-2xl font-bold">
            Para não esquecer
          </h2>
          <ul className="grid gap-1">
            {avisos
              .filter((a) => a.tipo === "lembrete" || a.tipo === "vencido")
              .map((a) => (
                <li key={a.id}>
                  <Link to={`/app/notas/${a.notaId}`} className="font-semibold underline underline-offset-4">
                    {a.titulo}
                  </Link>
                  <span className="ml-2">{a.texto}</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="recentes" className="mt-10 grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 id="recentes" className="text-2xl font-bold">
            Capturadas por último
          </h2>
          <Link to="/app/notas" className="font-semibold text-jovi underline underline-offset-4">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {recentes.map((n) => (
            <NotaCard key={n.id} nota={n} pasta={pastaPorId[n.pastaId]} aoFavoritar={alternarFavorita} />
          ))}
        </div>
      </section>
    </>
  );
}
