/** Remove acentos e caixa para comparar textos em português. */
export function normalizar(texto = "") {
  return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function termos(consulta = "") {
  return normalizar(consulta).split(/\s+/).filter(Boolean);
}

export function casaComConsulta(nota, lista) {
  if (!lista.length) return true;
  const alvo = normalizar(`${nota.titulo} ${nota.texto}`);
  return lista.every((t) => alvo.includes(t));
}

/**
 * Divide o texto em trechos marcando onde a busca aparece.
 * Preserva o texto original (com acentos) e destaca todos os termos.
 */
export function destacar(texto = "", consulta = "") {
  const lista = termos(consulta);
  if (!lista.length || !texto) return [{ texto, marca: false }];

  let norm = "";
  const mapa = [];
  for (let i = 0; i < texto.length; i += 1) {
    const n = normalizar(texto[i]);
    norm += n;
    for (let k = 0; k < n.length; k += 1) mapa.push(i);
  }

  const faixas = [];
  for (const termo of lista) {
    let pos = norm.indexOf(termo);
    while (pos !== -1) {
      faixas.push([mapa[pos], mapa[pos + termo.length - 1] + 1]);
      pos = norm.indexOf(termo, pos + termo.length);
    }
  }
  if (!faixas.length) return [{ texto, marca: false }];

  faixas.sort((a, b) => a[0] - b[0]);
  const unidas = [faixas[0].slice()];
  for (const [ini, fim] of faixas.slice(1)) {
    const ultima = unidas[unidas.length - 1];
    if (ini <= ultima[1]) ultima[1] = Math.max(ultima[1], fim);
    else unidas.push([ini, fim]);
  }

  const partes = [];
  let cursor = 0;
  for (const [ini, fim] of unidas) {
    if (ini > cursor) partes.push({ texto: texto.slice(cursor, ini), marca: false });
    partes.push({ texto: texto.slice(ini, fim), marca: true });
    cursor = fim;
  }
  if (cursor < texto.length) partes.push({ texto: texto.slice(cursor), marca: false });
  return partes;
}

export const ORDENACOES = [
  { valor: "recentes", rotulo: "Mais recentes" },
  { valor: "antigas", rotulo: "Mais antigas" },
  { valor: "titulo", rotulo: "Título (A a Z)" },
  { valor: "confianca", rotulo: "Maior confiança" },
  { valor: "manual", rotulo: "Minha ordem" },
];

export function ordenarNotas(notas, ordem = "recentes") {
  const lista = [...notas];
  const porData = (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm);
  switch (ordem) {
    case "antigas":
      return lista.sort((a, b) => -porData(a, b));
    case "titulo":
      return lista.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
    case "confianca":
      return lista.sort((a, b) => (b.confianca ?? -1) - (a.confianca ?? -1) || porData(a, b));
    case "manual":
      return lista.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
    default:
      return lista.sort(porData);
  }
}

/** Aplica busca, filtros e ordenação sobre as notas ativas. */
export function filtrarNotas(notas, { consulta = "", pastaId = "todas", visibilidade = "todas", favoritas = false, ordem = "recentes" } = {}) {
  const lista = termos(consulta);
  const filtradas = notas.filter((n) => {
    if (pastaId === "sem-pasta" && n.pastaId) return false;
    if (pastaId !== "todas" && pastaId !== "sem-pasta" && n.pastaId !== pastaId) return false;
    if (visibilidade === "privadas" && !n.privada) return false;
    if (visibilidade === "publicas" && n.privada) return false;
    if (favoritas && !n.favorita) return false;
    return casaComConsulta(n, lista);
  });
  return ordenarNotas(filtradas, ordem);
}
