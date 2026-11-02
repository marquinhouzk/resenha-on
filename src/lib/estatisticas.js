import { diasEntre, inicioDoDia, MS_DIA } from "./datas.js";

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function percentual(parte, total) {
  return total ? Math.round((parte / total) * 100) : 0;
}

export function mediaConfianca(notas) {
  const com = notas.filter((n) => typeof n.confianca === "number");
  if (!com.length) return null;
  return Math.round(com.reduce((soma, n) => soma + n.confianca, 0) / com.length);
}

export function resumoNotas(notas) {
  const ativas = notas.filter((n) => !n.excluidaEm);
  return {
    ativas: ativas.length,
    lixeira: notas.length - ativas.length,
    privadas: ativas.filter((n) => n.privada).length,
    publicas: ativas.filter((n) => !n.privada).length,
    favoritas: ativas.filter((n) => n.favorita).length,
    capturadas: ativas.filter((n) => n.origem === "camera").length,
    confiancaMedia: mediaConfianca(ativas),
  };
}

export function contagemPorPasta(notasAtivas, pastas) {
  const total = notasAtivas.length;
  const linhas = pastas.map((pasta) => {
    const qtd = notasAtivas.filter((n) => n.pastaId === pasta.id).length;
    return { id: pasta.id, nome: pasta.nome, cor: pasta.cor, total: qtd, percentual: percentual(qtd, total) };
  });
  const sem = notasAtivas.filter((n) => !pastas.some((p) => p.id === n.pastaId)).length;
  if (sem) linhas.push({ id: "sem-pasta", nome: "Sem pasta", cor: "#566078", total: sem, percentual: percentual(sem, total) });
  return linhas;
}

export function filtrarPorPeriodo(historico, dias, agora = new Date()) {
  if (!dias) return historico;
  return historico.filter((h) => diasEntre(h.em, agora) < dias);
}

export function acoesPorTipo(historico) {
  return historico.reduce((acc, h) => ({ ...acc, [h.acao]: (acc[h.acao] ?? 0) + 1 }), {});
}

/** Quantidade de ações por dia, do mais antigo para o mais recente. */
export function atividadePorDia(historico, dias = 7, agora = new Date()) {
  const hoje = inicioDoDia(agora);
  return Array.from({ length: dias }, (_, i) => {
    const dia = new Date(hoje.getTime() - (dias - 1 - i) * MS_DIA);
    const total = historico.filter((h) => diasEntre(h.em, dia) === 0).length;
    return { data: dia.toISOString(), rotulo: DIAS_SEMANA[dia.getDay()], total, hoje: i === dias - 1 };
  });
}

/** Dias seguidos com alguma atividade, contando a partir de hoje (ou ontem). */
export function sequenciaDeDias(historico, agora = new Date()) {
  const diasComAtividade = new Set(historico.map((h) => diasEntre(h.em, agora)));
  let inicio = diasComAtividade.has(0) ? 0 : 1;
  let sequencia = 0;
  while (diasComAtividade.has(inicio + sequencia)) sequencia += 1;
  return sequencia;
}

export function maiorValor(lista, campo = "total") {
  return Math.max(1, ...lista.map((item) => item[campo]));
}
