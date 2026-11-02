import { normalizar } from "./busca.js";

export function linhasDe(texto = "") {
  return texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

export function contarPalavras(texto = "") {
  return texto.trim() ? texto.trim().split(/\s+/).length : 0;
}

/** Compara duas notas linha a linha e calcula a similaridade (Jaccard). */
export function compararTextos(textoA = "", textoB = "") {
  const la = linhasDe(textoA);
  const lb = linhasDe(textoB);
  const sa = new Set(la.map(normalizar));
  const sb = new Set(lb.map(normalizar));
  const comuns = [...sa].filter((l) => sb.has(l)).length;
  const uniao = new Set([...sa, ...sb]).size;
  return {
    a: la.map((texto) => ({ texto, comum: sb.has(normalizar(texto)) })),
    b: lb.map((texto) => ({ texto, comum: sa.has(normalizar(texto)) })),
    comuns,
    similaridade: uniao ? Math.round((comuns / uniao) * 100) : 0,
  };
}
