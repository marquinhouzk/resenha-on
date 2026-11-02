import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Simula o Modo Estudo da câmera: mira -> lendo -> pronto.
 * A confiança do reconhecimento é sorteada com Math.random e arredondada com Math.round.
 */
export default function useCaptura(amostras) {
  const [fase, setFase] = useState("mirando");
  const [indice, setIndice] = useState(0);
  const [confianca, setConfianca] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const amostra = amostras.length ? amostras[indice % amostras.length] : null;

  const capturar = useCallback(() => {
    if (!amostras.length) return;
    setFase("lendo");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setConfianca(Math.round(90 + Math.random() * 9));
      setFase("pronto");
    }, 1400);
  }, [amostras.length]);

  const sortear = useCallback(() => {
    clearTimeout(timer.current);
    setIndice(Math.floor(Math.random() * Math.max(amostras.length, 1)));
    setConfianca(null);
    setFase("mirando");
  }, [amostras.length]);

  const escolher = useCallback((i) => {
    clearTimeout(timer.current);
    setIndice(i);
    setConfianca(null);
    setFase("mirando");
  }, []);

  const reiniciar = useCallback(() => {
    clearTimeout(timer.current);
    setConfianca(null);
    setFase("mirando");
  }, []);

  return { fase, amostra, indice, confianca, capturar, sortear, escolher, reiniciar };
}
