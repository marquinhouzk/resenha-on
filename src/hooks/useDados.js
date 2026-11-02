import { useContext } from "react";
import { DadosContext } from "../context/DadosContext.jsx";

export default function useDados() {
  const ctx = useContext(DadosContext);
  if (!ctx) throw new Error("useDados precisa estar dentro de <DadosProvider>.");
  return ctx;
}
