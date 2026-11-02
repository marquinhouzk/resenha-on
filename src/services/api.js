// Camada de acesso à API. A API do projeto é mockada: os recursos ficam em
// public/api/*.json e são servidos como arquivos estáticos (local e na Vercel).
// Toda leitura passa por fetch(), com tratamento de erro e cancelamento.
const BASE = "/api";

export class ErroApi extends Error {
  constructor(mensagem, status = 0) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status;
  }
}

async function obter(recurso, { signal } = {}) {
  let resposta;
  try {
    resposta = await fetch(`${BASE}/${recurso}.json`, { signal, headers: { Accept: "application/json" } });
  } catch (erro) {
    if (erro.name === "AbortError") throw erro;
    throw new ErroApi("Não foi possível falar com a API. Confira sua conexão e tente de novo.");
  }
  if (!resposta.ok) {
    throw new ErroApi(`A API respondeu com erro ${resposta.status} ao buscar "${recurso}".`, resposta.status);
  }
  try {
    return await resposta.json();
  } catch {
    throw new ErroApi(`A resposta da API para "${recurso}" veio em formato inválido.`, resposta.status);
  }
}

export const api = {
  usuarios: (opcoes) => obter("usuarios", opcoes),
  pastas: (opcoes) => obter("pastas", opcoes),
  notas: (opcoes) => obter("notas", opcoes),
  amostras: (opcoes) => obter("amostras", opcoes),
};
