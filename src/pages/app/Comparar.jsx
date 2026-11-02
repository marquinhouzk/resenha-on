import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Cabecalho from "../../components/app/Cabecalho.jsx";
import Botao from "../../components/ui/Botao.jsx";
import EstadoVazio from "../../components/ui/EstadoVazio.jsx";
import useDados from "../../hooks/useDados.js";
import useTitulo from "../../hooks/useTitulo.js";
import { compararTextos, contarPalavras } from "../../lib/comparar.js";

function Coluna({ nota, linhas }) {
  return (
    <section aria-label={`Nota: ${nota.titulo}`} className="grid content-start gap-3 rounded-2xl border border-linha bg-white p-5">
      <h2 className="text-xl font-bold">
        <Link to={`/app/notas/${nota.id}`} className="hover:underline">
          {nota.titulo}
        </Link>
      </h2>
      <p className="text-sm text-grafite">{contarPalavras(nota.texto)} palavras</p>
      <ul className="grid gap-2">
        {linhas.map((l, i) => (
          <li key={i} className={`rounded-md px-3 py-2 ${l.comum ? "bg-verde/12" : "bg-papel"}`}>
            {l.texto}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Comparar() {
  useTitulo("Comparar notas");
  const [params, setParams] = useSearchParams();
  const { notasAtivas } = useDados();
  const a = notasAtivas.find((n) => n.id === params.get("a"));
  const b = notasAtivas.find((n) => n.id === params.get("b"));
  const resultado = useMemo(() => (a && b ? compararTextos(a.texto, b.texto) : null), [a, b]);

  const trocar = (campo, valor) => {
    const novos = new URLSearchParams(params);
    novos.set(campo, valor);
    setParams(novos, { replace: true });
  };

  if (notasAtivas.length < 2) {
    return (
      <EstadoVazio titulo="Você precisa de duas notas para comparar" texto="Crie ou capture mais uma nota e volte aqui.">
        <Botao as={Link} to="/app/capturar" variante="marca">
          Capturar
        </Botao>
      </EstadoVazio>
    );
  }

  const seletor = (campo, atual) => (
    <div className="grid gap-1.5">
      <label htmlFor={`sel-${campo}`} className="text-sm font-semibold">
        Nota {campo === "a" ? "da esquerda" : "da direita"}
      </label>
      <select id={`sel-${campo}`} value={atual?.id ?? ""} onChange={(e) => trocar(campo, e.target.value)} className="rounded-lg border border-linha bg-white px-3 py-2.5">
        <option value="" disabled>
          Escolha uma nota
        </option>
        {notasAtivas.map((n) => (
          <option key={n.id} value={n.id}>
            {n.titulo}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <Cabecalho titulo="Comparar notas" descricao="Linhas em verde aparecem nas duas notas. As demais são exclusivas de cada uma." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {seletor("a", a)}
        {seletor("b", b)}
      </div>

      {resultado ? (
        <>
          <p role="status" className="mb-4 rounded-xl bg-ceu px-4 py-3 font-semibold">
            {resultado.similaridade}% de similaridade · {resultado.comuns} {resultado.comuns === 1 ? "linha em comum" : "linhas em comum"}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Coluna nota={a} linhas={resultado.a} />
            <Coluna nota={b} linhas={resultado.b} />
          </div>
        </>
      ) : (
        <EstadoVazio titulo="Escolha duas notas" texto="Selecione uma nota em cada lado para ver a comparação." />
      )}
    </>
  );
}
