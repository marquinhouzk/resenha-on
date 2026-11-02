import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";

/** Busca na API as amostras de quadros, slides e apostilas usadas na captura simulada. */
export default function useAmostras() {
  const [amostras, setAmostras] = useState([]);
  const [status, setStatus] = useState("carregando");
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controle = new AbortController();
    setStatus("carregando");
    api
      .amostras({ signal: controle.signal })
      .then((dados) => {
        setAmostras(dados);
        setStatus("pronto");
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setErro(e.message);
        setStatus("erro");
      });
    return () => controle.abort();
  }, [tentativa]);

  const tentarDeNovo = useCallback(() => setTentativa((n) => n + 1), []);
  return { amostras, status, erro, tentarDeNovo };
}
