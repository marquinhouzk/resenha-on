// Acesso seguro ao localStorage: nunca lança erro (modo privado, cota cheia etc.).
export const CHAVES = {
  sessao: "resenhaon:sessao",
  usuarios: "resenhaon:usuarios-extra",
  mensagens: "resenhaon:mensagens",
  dados: (usuarioId) => `resenhaon:dados:${usuarioId}`,
};

export function ler(chave, padrao = null) {
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto === null ? padrao : JSON.parse(bruto);
  } catch {
    return padrao;
  }
}

export function gravar(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function remover(chave) {
  try {
    window.localStorage.removeItem(chave);
  } catch {
    /* sem armazenamento disponível */
  }
}
