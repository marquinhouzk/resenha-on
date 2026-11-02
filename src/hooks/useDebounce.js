import { useEffect, useState } from "react";

/** Devolve o valor só depois de `atraso` ms sem mudanças (útil em buscas). */
export default function useDebounce(valor, atraso = 250) {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const id = setTimeout(() => setAtrasado(valor), atraso);
    return () => clearTimeout(id);
  }, [valor, atraso]);
  return atrasado;
}
