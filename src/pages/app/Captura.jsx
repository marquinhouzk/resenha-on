import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../components/app/Cabecalho.jsx";
import Botao from "../../components/ui/Botao.jsx";
import Campo from "../../components/ui/Campo.jsx";
import Carregando from "../../components/ui/Carregando.jsx";
import ErroApi from "../../components/ui/ErroApi.jsx";
import useAmostras from "../../hooks/useAmostras.js";
import useCaptura from "../../hooks/useCaptura.js";
import useDados from "../../hooks/useDados.js";
import useTitulo from "../../hooks/useTitulo.js";
import useToast from "../../hooks/useToast.js";

export default function Captura() {
  useTitulo("Capturar");
  const navegar = useNavigate();
  const { avisar } = useToast();
  const { pastas, config, criarNota } = useDados();
  const { amostras, status, erro, tentarDeNovo } = useAmostras();
  const { fase, amostra, indice, confianca, capturar, sortear, escolher, reiniciar } = useCaptura(amostras);

  const [titulo, setTitulo] = useState("");
  const [pastaId, setPastaId] = useState("");
  const [privada, setPrivada] = useState(config.privadaPorPadrao);

  // Quando a fonte muda, sugere título e pasta a partir do que a câmera "viu".
  useEffect(() => {
    if (!amostra) return;
    setTitulo(amostra.titulo);
    setPastaId(pastas.some((p) => p.id === amostra.pastaId) ? amostra.pastaId : "");
  }, [amostra, pastas]);

  if (status === "carregando") return <Carregando texto="Preparando a câmera..." />;
  if (status === "erro") return <ErroApi mensagem={erro} aoTentarDeNovo={tentarDeNovo} />;
  if (!amostra) return <ErroApi mensagem="A API não devolveu nenhuma fonte de captura." aoTentarDeNovo={tentarDeNovo} />;

  const salvar = () => {
    const id = criarNota({ titulo: titulo.trim() || amostra.titulo, texto: amostra.texto, pastaId, privada, origem: "camera", confianca });
    avisar("Captura salva no caderno.");
    navegar(`/app/notas/${id}`);
  };

  const linhas = amostra.texto.split("\n");

  return (
    <>
      <Cabecalho titulo="Modo Estudo" descricao="Simulação da câmera JOVI: escolha o que está na frente da lente e toque em capturar." />

      <div className="grid gap-8 lg:grid-cols-12">
        <section aria-label="Visor" className="grid content-start gap-4 lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-quadro text-white">
            <div className="absolute inset-5">
              <span className="absolute left-0 top-0 size-8 border-l-4 border-t-4 border-marca" />
              <span className="absolute right-0 top-0 size-8 border-r-4 border-t-4 border-marca" />
              <span className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-marca" />
              <span className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-marca" />
              <div className="grid gap-3 p-8 font-display text-lg text-white/90 sm:text-xl">
                {linhas.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              {fase === "lendo" && <span aria-hidden="true" className="absolute inset-x-1 h-1 animate-varredura rounded bg-marca shadow-[0_0_14px_3px_rgba(255,225,74,0.7)]" />}
            </div>
            <p className="absolute bottom-2 left-5 text-sm text-white/60">{amostra.origem}</p>
          </div>

          <fieldset className="grid gap-2">
            <legend className="mb-1 text-sm font-semibold">O que a câmera está vendo</legend>
            <div className="flex flex-wrap gap-2">
              {amostras.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={i === indice % amostras.length}
                  onClick={() => escolher(i)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium ${i === indice % amostras.length ? "border-tinta bg-tinta text-white" : "border-linha bg-white hover:border-tinta"}`}
                >
                  {a.origem}
                </button>
              ))}
              <button type="button" onClick={sortear} className="cursor-pointer rounded-full border border-linha bg-white px-3 py-1.5 text-sm font-medium hover:border-tinta">
                Sortear fonte
              </button>
            </div>
          </fieldset>
        </section>

        <section aria-label="Resultado" className="grid content-start gap-4 lg:col-span-5">
          {fase === "pronto" ? (
            <div className="grid gap-4 rounded-2xl border border-linha bg-white p-6">
              <div>
                <h2 className="text-2xl font-bold">Texto reconhecido</h2>
                <p className="text-sm text-grafite">{confianca}% de confiança. Revise o título e a pasta antes de salvar.</p>
              </div>
              <Campo id="campo-titulo" name="titulo" rotulo="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={80} />
              <Campo id="campo-pasta" name="pastaId" rotulo="Salvar na pasta" elemento="select" value={pastaId} onChange={(e) => setPastaId(e.target.value)}>
                <option value="">Sem pasta</option>
                {pastas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </Campo>
              <label className="flex cursor-pointer items-center gap-3 font-semibold">
                <input type="checkbox" checked={privada} onChange={(e) => setPrivada(e.target.checked)} className="size-5 accent-jovi" />
                Manter privada
              </label>
              <div className="flex gap-2">
                <Botao onClick={salvar}>Salvar no caderno</Botao>
                <Botao variante="secundario" onClick={reiniciar}>
                  Descartar
                </Botao>
              </div>
            </div>
          ) : (
            <div className="grid justify-items-start gap-4 rounded-2xl border border-linha bg-white p-6">
              <h2 className="text-2xl font-bold">{fase === "lendo" ? "Lendo o texto..." : "Pronto para capturar"}</h2>
              <p className="text-grafite">
                {fase === "lendo" ? "A câmera detecta as bordas, corrige a perspectiva e reconhece o texto." : "Enquadre o quadro, o slide ou a apostila e toque no botão."}
              </p>
              <Botao variante="marca" tamanho="lg" onClick={capturar} disabled={fase === "lendo"}>
                {fase === "lendo" ? "Capturando..." : "Capturar texto"}
              </Botao>
            </div>
          )}
          <p role="status" aria-live="polite" className="sr-only">
            {fase === "pronto" ? `Texto reconhecido com ${confianca}% de confiança.` : ""}
          </p>
        </section>
      </div>
    </>
  );
}
