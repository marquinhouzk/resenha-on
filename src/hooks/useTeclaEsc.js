import { useEffect } from "react";

export default function useTeclaEsc(ativo, aoPressionar) {
  useEffect(() => {
    if (!ativo) return undefined;
    const ouvir = (e) => {
      if (e.key === "Escape") aoPressionar();
    };
    document.addEventListener("keydown", ouvir);
    return () => document.removeEventListener("keydown", ouvir);
  }, [ativo, aoPressionar]);
}
