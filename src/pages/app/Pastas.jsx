import { useState } from "react";
import { Link } from "react-router-dom";
import Cabecalho from "../../components/app/Cabecalho.jsx";
import Botao from "../../components/ui/Botao.jsx";
import Campo from "../../components/ui/Campo.jsx";
import ConfirmaDialogo from "../../components/ui/ConfirmaDialogo.jsx";
import useDados from "../../hooks/useDados.js";
import useFormulario from "../../hooks/useFormulario.js";
import useTitulo from "../../hooks/useTitulo.js";
import useToast from "../../hooks/useToast.js";
import { validarTexto } from "../../lib/validacao.js";

const CORES = ["#2046E5", "#E8185F", "#14805A", "#7C4DFF", "#E58A00", "#0A8FA8"];
const validar = (v) => {
  const erro = validarTexto(v.nome, { rotulo: "o nome da pasta", min: 2, max: 40 });
  return erro ? { nome: erro } : {};
};

function ListaDeNotas({ notas, aoMover }) {
  if (!notas.length) return <p className="px-1 text-sm text-grafite">Nenhuma nota nesta pasta ainda.</p>;
  return (
    <ol className="grid gap-1.5">
      {notas.map((n, i) => (
        <li key={n.id} className="flex items-center gap-2 rounded-lg bg-papel px-3 py-2">
          <Link to={`/app/notas/${n.id}`} className="flex-1 truncate font-medium hover:underline">
            {n.titulo}
          </Link>
          <button type="button" onClick={() => aoMover(n.id, -1)} disabled={i === 0} aria-label={`Subir ${n.titulo}`} className="grid size-8 cursor-pointer place-items-center rounded-md border border-linha bg-white hover:border-tinta disabled:opacity-30">
            ↑
          </button>
          <button type="button" onClick={() => aoMover(n.id, 1)} disabled={i === notas.length - 1} aria-label={`Descer ${n.titulo}`} className="grid size-8 cursor-pointer place-items-center rounded-md border border-linha bg-white hover:border-tinta disabled:opacity-30">
            ↓
          </button>
        </li>
      ))}
    </ol>
  );
}

export default function Pastas() {
  useTitulo("Pastas");
  const { avisar } = useToast();
  const { pastas, notasAtivas, criarPasta, editarPasta, removerPasta, reordenarPasta, reordenarNota } = useDados();
  const [cor, setCor] = useState(CORES[0]);
  const [editando, setEditando] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [removendo, setRemovendo] = useState(null);
  const { valores, erroDe, alterar, sair, redefinir, enviar } = useFormulario({ nome: "" }, validar);

  const notasDa = (pastaId) => notasAtivas.filter((n) => (n.pastaId ?? null) === pastaId).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

  const aoCriar = ({ nome }) => {
    criarPasta(nome, cor);
    avisar(`Pasta “${nome.trim()}” criada.`);
    redefinir();
  };

  const salvarNome = (id) => {
    const erro = validarTexto(nomeEditado, { rotulo: "o nome", min: 2, max: 40 });
    if (erro) {
      avisar(erro, { tipo: "erro" });
      return;
    }
    editarPasta(id, { nome: nomeEditado.trim() });
    setEditando(null);
  };

  const semPasta = notasDa(null);

  return (
    <>
      <Cabecalho titulo="Pastas" descricao="Uma pasta por disciplina, do jeito que você estuda. Reordene pastas e notas com as setas." />

      <form onSubmit={enviar(aoCriar)} noValidate className="mb-8 grid gap-4 rounded-2xl border border-linha bg-white p-6">
        <h2 className="text-2xl font-bold">Nova pasta</h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <Campo id="campo-nome" name="nome" rotulo="Nome da pasta" value={valores.nome} onChange={alterar} onBlur={sair} erro={erroDe("nome")} maxLength={40} />
          <Botao type="submit">Criar pasta</Botao>
        </div>
        <fieldset className="grid gap-2">
          <legend className="mb-1 text-sm font-semibold">Cor</legend>
          <div className="flex flex-wrap gap-2">
            {CORES.map((c) => (
              <label key={c} className="cursor-pointer">
                <input type="radio" name="cor" value={c} checked={cor === c} onChange={() => setCor(c)} className="peer sr-only" />
                <span className="block size-9 rounded-full ring-offset-2 peer-checked:ring-2 peer-checked:ring-tinta peer-focus-visible:ring-2 peer-focus-visible:ring-jovi" style={{ background: c }}>
                  <span className="sr-only">{c}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <ul className="grid gap-3">
        {pastas.map((p, i) => {
          const dela = notasDa(p.id);
          return (
            <li key={p.id}>
              <details className="group rounded-2xl border border-linha bg-white open:border-tinta/40">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
                  <span aria-hidden="true" className="size-4 shrink-0 rounded-full" style={{ background: p.cor }} />
                  {editando === p.id ? (
                    <span className="flex flex-1 flex-wrap items-center gap-2" onClick={(e) => e.preventDefault()}>
                      <label className="sr-only" htmlFor={`nome-${p.id}`}>
                        Novo nome da pasta
                      </label>
                      <input
                        id={`nome-${p.id}`}
                        value={nomeEditado}
                        onChange={(e) => setNomeEditado(e.target.value)}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          if (e.key === "Enter") salvarNome(p.id);
                          if (e.key === "Escape") setEditando(null);
                        }}
                        className="min-w-0 flex-1 rounded-lg border border-jovi bg-white px-3 py-1.5"
                        autoFocus
                      />
                      <Botao tamanho="sm" onClick={() => salvarNome(p.id)}>
                        Salvar
                      </Botao>
                      <Botao tamanho="sm" variante="secundario" onClick={() => setEditando(null)}>
                        Cancelar
                      </Botao>
                    </span>
                  ) : (
                    <span className="flex-1 font-display text-xl font-bold">
                      {p.nome} <span className="font-sans text-base font-medium text-grafite">({dela.length})</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                    <button type="button" onClick={() => reordenarPasta(p.id, -1)} disabled={i === 0} aria-label={`Subir a pasta ${p.nome}`} className="grid size-9 cursor-pointer place-items-center rounded-md border border-linha hover:border-tinta disabled:opacity-30">
                      ↑
                    </button>
                    <button type="button" onClick={() => reordenarPasta(p.id, 1)} disabled={i === pastas.length - 1} aria-label={`Descer a pasta ${p.nome}`} className="grid size-9 cursor-pointer place-items-center rounded-md border border-linha hover:border-tinta disabled:opacity-30">
                      ↓
                    </button>
                  </span>
                </summary>
                <div className="grid gap-4 border-t border-linha p-4">
                  <ListaDeNotas notas={dela} aoMover={reordenarNota} />
                  <div className="flex flex-wrap gap-2">
                    <Botao as={Link} to={`/app/notas?pasta=${p.id}`} tamanho="sm" variante="secundario">
                      Abrir na central
                    </Botao>
                    <Botao as={Link} to={`/app/notas/nova?pasta=${p.id}`} tamanho="sm" variante="secundario">
                      Nova nota aqui
                    </Botao>
                    <Botao
                      tamanho="sm"
                      variante="secundario"
                      onClick={() => {
                        setEditando(p.id);
                        setNomeEditado(p.nome);
                      }}
                    >
                      Renomear
                    </Botao>
                    <Botao tamanho="sm" variante="perigo" onClick={() => setRemovendo(p)}>
                      Excluir pasta
                    </Botao>
                  </div>
                </div>
              </details>
            </li>
          );
        })}

        <li>
          <details className="rounded-2xl border border-dashed border-grafite/40 bg-white">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
              <span className="flex-1 font-display text-xl font-bold">
                Sem pasta <span className="font-sans text-base font-medium text-grafite">({semPasta.length})</span>
              </span>
            </summary>
            <div className="border-t border-linha p-4">
              <ListaDeNotas notas={semPasta} aoMover={reordenarNota} />
            </div>
          </details>
        </li>
      </ul>

      <ConfirmaDialogo
        aberto={Boolean(removendo)}
        titulo={`Excluir a pasta “${removendo?.nome ?? ""}”?`}
        mensagem="As notas dela não são apagadas: elas passam para “Sem pasta”."
        rotuloConfirmar="Excluir pasta"
        perigo
        aoConfirmar={() => {
          removerPasta(removendo.id);
          avisar("Pasta excluída. As notas foram para “Sem pasta”.");
          setRemovendo(null);
        }}
        aoCancelar={() => setRemovendo(null)}
      />
    </>
  );
}
