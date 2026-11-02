import { Link } from "react-router-dom";
import { destacar } from "../../lib/busca.js";
import { diasEntre, formatarRelativo } from "../../lib/datas.js";
import Selo from "../ui/Selo.jsx";
import Icone from "./Icone.jsx";

export function Destaque({ texto, consulta }) {
  return destacar(texto, consulta).map((p, i) => (p.marca ? <mark key={i}>{p.texto}</mark> : <span key={i}>{p.texto}</span>));
}

/** Resumo de uma nota. Com `selecionavel`, mostra a caixa usada para comparar notas. */
export default function NotaCard({ nota, pasta, consulta = "", selecionavel = false, selecionada = false, aoSelecionar, aoFavoritar }) {
  const recente = diasEntre(nota.criadoEm) <= 1;
  const resumo = nota.texto.replace(/\s+/g, " ").slice(0, 140);

  return (
    <article className={`relative grid content-start gap-3 rounded-2xl border bg-white p-5 transition-colors ${selecionada ? "border-jovi ring-2 ring-jovi" : "border-linha hover:border-tinta/50"}`}>
      <div className="flex flex-wrap items-center gap-1.5">
        {recente && <Selo tom="marca">Recente</Selo>}
        {pasta ? (
          <Selo tom="neutro">
            <span aria-hidden="true" className="size-2 rounded-full" style={{ background: pasta.cor }} />
            {pasta.nome}
          </Selo>
        ) : (
          <Selo>Sem pasta</Selo>
        )}
        <Selo tom={nota.privada ? "neutro" : "verde"}>{nota.privada ? "Privada" : "Pública"}</Selo>
        {nota.lembrete && <Selo tom="azul">Lembrete</Selo>}
      </div>

      <h3 className="text-xl font-bold">
        <Link to={`/app/notas/${nota.id}`} className="after:absolute after:inset-0 after:content-['']">
          <Destaque texto={nota.titulo} consulta={consulta} />
        </Link>
      </h3>
      <p className="text-sm text-grafite">
        <Destaque texto={resumo} consulta={consulta} />
        {nota.texto.length > 140 && "..."}
      </p>

      <div className="relative z-10 flex items-center justify-between gap-2 text-sm text-grafite">
        <span>
          {formatarRelativo(nota.criadoEm)}
          {nota.confianca != null && ` · ${nota.confianca}% de confiança`}
        </span>
        <div className="flex items-center gap-1">
          {aoFavoritar && (
            <button
              type="button"
              onClick={() => aoFavoritar(nota.id)}
              aria-pressed={nota.favorita}
              aria-label={nota.favorita ? "Remover dos favoritos" : "Marcar como favorita"}
              className={`grid size-9 cursor-pointer place-items-center rounded-lg hover:bg-tinta/5 ${nota.favorita ? "text-[#c99a00]" : "text-grafite"}`}
            >
              <Icone nome="estrela" className={`size-5 ${nota.favorita ? "fill-marca" : ""}`} />
            </button>
          )}
          {selecionavel && (
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 font-semibold hover:bg-tinta/5">
              <input type="checkbox" checked={selecionada} onChange={() => aoSelecionar(nota.id)} className="size-4 accent-jovi" />
              Comparar
            </label>
          )}
        </div>
      </div>
    </article>
  );
}
