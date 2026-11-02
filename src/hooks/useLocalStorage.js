import { useCallback, useState } from "react";
import { gravar, ler } from "../services/armazenamento.js";

/** useState que persiste o valor no localStorage. */
export default function useLocalStorage(chave, inicial) {
  const [valor, setValor] = useState(() => ler(chave, inicial));
  const atualizar = useCallback(
    (proximo) => {
      setValor((atual) => {
        const novo = typeof proximo === "function" ? proximo(atual) : proximo;
        gravar(chave, novo);
        return novo;
      });
    },
    [chave],
  );
  return [valor, atualizar];
}
