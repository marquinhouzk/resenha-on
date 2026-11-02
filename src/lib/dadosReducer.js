import { diasEntre } from "./datas.js";

export const DIAS_NA_LIXEIRA = 30;
const LIMITE_HISTORICO = 300;

let contador = 0;
const idLog = () => `h_${Date.now().toString(36)}_${(contador += 1)}`;

function registrar(estado, acao, nota, em) {
  const entrada = { id: idLog(), acao, notaId: nota.id, titulo: nota.titulo, pastaId: nota.pastaId ?? null, em };
  return [entrada, ...estado.historico].slice(0, LIMITE_HISTORICO);
}

const mapNota = (estado, id, fn) => estado.notas.map((n) => (n.id === id ? fn(n) : n));
const achar = (estado, id) => estado.notas.find((n) => n.id === id);

/** Remove da lixeira o que passou de 30 dias. */
export function purgarExpiradas(notas, agora) {
  return notas.filter((n) => !n.excluidaEm || diasEntre(n.excluidaEm, agora) <= DIAS_NA_LIXEIRA);
}

function trocarVizinho(lista, id, direcao) {
  const i = lista.findIndex((item) => item.id === id);
  const j = i + direcao;
  if (i < 0 || j < 0 || j >= lista.length) return null;
  return [lista[i], lista[j]];
}

export function dadosReducer(estado, acao) {
  if (acao.tipo === "CARREGAR") {
    return { ...acao.estado, notas: purgarExpiradas(acao.estado.notas, new Date(acao.agora)) };
  }
  if (!estado) return estado;

  switch (acao.tipo) {
    case "CRIAR_NOTA": {
      const maiorOrdem = Math.max(-1, ...estado.notas.map((n) => n.ordem ?? 0));
      const nota = { ...acao.nota, ordem: maiorOrdem + 1 };
      return { ...estado, notas: [nota, ...estado.notas], historico: registrar(estado, "criou", nota, acao.em) };
    }
    case "EDITAR_NOTA": {
      const atual = achar(estado, acao.id);
      if (!atual) return estado;
      const nova = { ...atual, ...acao.patch, atualizadoEm: acao.em };
      return { ...estado, notas: mapNota(estado, acao.id, () => nova), historico: registrar(estado, "editou", nova, acao.em) };
    }
    case "ALTERNAR_FAVORITA":
      return { ...estado, notas: mapNota(estado, acao.id, (n) => ({ ...n, favorita: !n.favorita })) };
    case "ALTERNAR_PRIVADA": {
      const atual = achar(estado, acao.id);
      if (!atual) return estado;
      const nova = { ...atual, privada: !atual.privada, atualizadoEm: acao.em };
      return { ...estado, notas: mapNota(estado, acao.id, () => nova), historico: registrar(estado, "editou", nova, acao.em) };
    }
    case "MOVER_NOTA": {
      const atual = achar(estado, acao.id);
      if (!atual || atual.pastaId === acao.pastaId) return estado;
      const nova = { ...atual, pastaId: acao.pastaId, atualizadoEm: acao.em };
      return { ...estado, notas: mapNota(estado, acao.id, () => nova), historico: registrar(estado, "moveu", nova, acao.em) };
    }
    case "REORDENAR_NOTA": {
      const nota = achar(estado, acao.id);
      if (!nota) return estado;
      const irmas = estado.notas
        .filter((n) => !n.excluidaEm && (n.pastaId ?? null) === (nota.pastaId ?? null))
        .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
      const par = trocarVizinho(irmas, acao.id, acao.direcao);
      if (!par) return estado;
      const [a, b] = par;
      return {
        ...estado,
        notas: estado.notas.map((n) => (n.id === a.id ? { ...n, ordem: b.ordem } : n.id === b.id ? { ...n, ordem: a.ordem } : n)),
      };
    }
    case "EXCLUIR_NOTA": {
      const atual = achar(estado, acao.id);
      if (!atual) return estado;
      return { ...estado, notas: mapNota(estado, acao.id, (n) => ({ ...n, excluidaEm: acao.em })), historico: registrar(estado, "removeu", atual, acao.em) };
    }
    case "RESTAURAR_NOTA": {
      const atual = achar(estado, acao.id);
      if (!atual) return estado;
      const pastaExiste = estado.pastas.some((p) => p.id === atual.pastaId);
      return {
        ...estado,
        notas: mapNota(estado, acao.id, (n) => ({ ...n, excluidaEm: null, pastaId: pastaExiste ? n.pastaId : null })),
        historico: registrar(estado, "restaurou", atual, acao.em),
      };
    }
    case "EXCLUIR_DEFINITIVO": {
      const atual = achar(estado, acao.id);
      if (!atual) return estado;
      return { ...estado, notas: estado.notas.filter((n) => n.id !== acao.id), historico: registrar(estado, "excluiu", atual, acao.em) };
    }
    case "ESVAZIAR_LIXEIRA": {
      const naLixeira = estado.notas.filter((n) => n.excluidaEm);
      if (!naLixeira.length) return estado;
      const historico = naLixeira.reduce((h, n) => registrar({ ...estado, historico: h }, "excluiu", n, acao.em), estado.historico);
      return { ...estado, notas: estado.notas.filter((n) => !n.excluidaEm), historico };
    }
    case "REGISTRAR_EXPORTACAO": {
      const atual = achar(estado, acao.id);
      return atual ? { ...estado, historico: registrar(estado, "exportou", atual, acao.em) } : estado;
    }
    case "CRIAR_PASTA": {
      const ordem = Math.max(-1, ...estado.pastas.map((p) => p.ordem)) + 1;
      return { ...estado, pastas: [...estado.pastas, { ...acao.pasta, ordem }] };
    }
    case "EDITAR_PASTA":
      return { ...estado, pastas: estado.pastas.map((p) => (p.id === acao.id ? { ...p, ...acao.patch } : p)) };
    case "REMOVER_PASTA":
      return {
        ...estado,
        pastas: estado.pastas.filter((p) => p.id !== acao.id).map((p, i) => ({ ...p, ordem: i })),
        notas: estado.notas.map((n) => (n.pastaId === acao.id ? { ...n, pastaId: null } : n)),
      };
    case "REORDENAR_PASTA": {
      const ordenadas = [...estado.pastas].sort((a, b) => a.ordem - b.ordem);
      const par = trocarVizinho(ordenadas, acao.id, acao.direcao);
      if (!par) return estado;
      const [a, b] = par;
      return { ...estado, pastas: estado.pastas.map((p) => (p.id === a.id ? { ...p, ordem: b.ordem } : p.id === b.id ? { ...p, ordem: a.ordem } : p)) };
    }
    case "ATUALIZAR_CONFIG":
      return { ...estado, config: { ...estado.config, ...acao.patch } };
    case "TORNAR_TODAS_PRIVADAS":
      return { ...estado, notas: estado.notas.map((n) => ({ ...n, privada: true })) };
    case "LIMPAR_HISTORICO":
      return { ...estado, historico: [] };
    default:
      return estado;
  }
}
