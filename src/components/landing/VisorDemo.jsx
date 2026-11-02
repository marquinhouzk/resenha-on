import { Link } from "react-router-dom";
import useAmostras from "../../hooks/useAmostras.js";
import useCaptura from "../../hooks/useCaptura.js";
import Botao from "../ui/Botao.jsx";

const Cantos = () => (
  <>
    <span className="absolute left-0 top-0 size-6 border-l-4 border-t-4 border-marca" />
    <span className="absolute right-0 top-0 size-6 border-r-4 border-t-4 border-marca" />
    <span className="absolute bottom-0 left-0 size-6 border-b-4 border-l-4 border-marca" />
    <span className="absolute bottom-0 right-0 size-6 border-b-4 border-r-4 border-marca" />
  </>
);

/** Termo destacado = trecho antes dos dois pontos (ex.: "Lista: ..."). */
function Linha({ texto, reconhecida }) {
  const i = texto.indexOf(":");
  if (!reconhecida || i < 1) return <p>{texto}</p>;
  return (
    <p>
      <mark>{texto.slice(0, i)}</mark>
      {texto.slice(i)}
    </p>
  );
}

export default function VisorDemo() {
  const { amostras, status, erro, tentarDeNovo } = useAmostras();
  const { fase, amostra, indice, confianca, capturar, sortear, escolher, reiniciar } = useCaptura(amostras);

  if (status === "erro") {
    return (
      <div role="alert" className="grid gap-3 rounded-2xl bg-white p-6 text-sm">
        <p className="font-semibold text-rosa">A demonstração não carregou.</p>
        <p className="text-grafite">{erro}</p>
        <Botao tamanho="sm" onClick={tentarDeNovo}>
          Tentar de novo
        </Botao>
      </div>
    );
  }

  const linhas = amostra ? amostra.texto.split("\n") : [];

  return (
    <div className="grid justify-items-center gap-5">
      <div className="w-[min(100%,290px)] rounded-[2.4rem] border-[6px] border-tinta bg-tinta shadow-[0_30px_60px_-20px_rgba(16,36,63,0.55)]">
        <div className="relative aspect-[9/17] overflow-hidden rounded-[1.9rem] bg-quadro text-white">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-4 text-xs text-white/70">
            <span>JOVI</span>
            <span className="rounded bg-marca px-2 py-0.5 font-bold text-tinta">Modo Estudo</span>
            <span>1x</span>
          </div>

          <div className="absolute inset-x-5 bottom-28 top-14">
            <Cantos />
            {status === "carregando" ? (
              <p className="absolute inset-0 grid place-items-center text-sm text-white/60">Preparando a câmera...</p>
            ) : (
              <div className="grid gap-3 p-5 pt-7 font-display text-[0.95rem] leading-snug text-white/90">
                {linhas.map((l) => (
                  <Linha key={l} texto={l} reconhecida={fase === "pronto"} />
                ))}
              </div>
            )}
            {fase === "lendo" && <span aria-hidden="true" className="absolute inset-x-1 h-1 animate-varredura rounded bg-marca shadow-[0_0_14px_3px_rgba(255,225,74,0.7)]" />}
          </div>

          <div className="absolute inset-x-0 bottom-0 grid justify-items-center gap-3 pb-5">
            <p className="text-xs text-white/60">{amostra ? amostra.origem : " "}</p>
            <button
              type="button"
              onClick={fase === "pronto" ? reiniciar : capturar}
              disabled={status !== "pronto" || fase === "lendo"}
              aria-label={fase === "pronto" ? "Capturar de novo" : "Capturar texto"}
              className="grid size-16 cursor-pointer place-items-center rounded-full border-4 border-white bg-white/15 transition-transform hover:scale-105 disabled:cursor-wait"
            >
              <span className={`size-9 rounded-full bg-white ${fase === "mirando" ? "animate-pulsar" : ""}`} />
            </button>
          </div>

          {fase === "pronto" && amostra && (
            <div className="absolute inset-x-0 bottom-0 z-20 grid gap-2 rounded-t-3xl bg-papel p-5 text-tinta">
              <p className="font-display text-lg font-bold">{amostra.titulo}</p>
              <p className="text-sm text-grafite">
                Texto reconhecido com {confianca}% de confiança. Pasta sugerida: <b className="text-tinta">{amostra.disciplina}</b>
              </p>
              <div className="mt-1 flex gap-2">
                <Botao as={Link} to="/cadastro" tamanho="sm" className="flex-1">
                  Salvar na pasta
                </Botao>
                <Botao tamanho="sm" variante="secundario" onClick={reiniciar}>
                  Voltar
                </Botao>
              </div>
            </div>
          )}
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {fase === "lendo" && "Lendo o texto..."}
        {fase === "pronto" && `Texto reconhecido com ${confianca}% de confiança.`}
      </p>

      {amostras.length > 0 && (
        <div className="grid justify-items-center gap-2">
          <p className="text-sm font-semibold text-grafite">Teste com outra fonte:</p>
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Fontes de teste">
            {amostras.slice(0, 4).map((a, i) => (
              <button
                key={a.id}
                type="button"
                aria-pressed={i === indice % amostras.length}
                onClick={() => escolher(i)}
                className={`cursor-pointer rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                  i === indice % amostras.length ? "border-tinta bg-tinta text-white" : "border-linha bg-white hover:border-tinta"
                }`}
              >
                {a.origem.split(",")[0]}
              </button>
            ))}
            <button type="button" onClick={sortear} className="cursor-pointer rounded-full border border-linha bg-white px-3 py-1 text-sm font-medium hover:border-tinta">
              Sortear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
