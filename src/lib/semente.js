import { dataDiasDepois, isoDiasAtras } from "./datas.js";

export const CONFIG_PADRAO = { notificacoes: true, antecedenciaDias: 3, privadaPorPadrao: true };
export const VERSAO_DADOS = 1;

/** Converte os dados brutos da API (datas relativas) no estado inicial do aluno. */
export function montarSemente({ pastas = [], notas = [] }, { incluirNotas = true, agora = new Date() } = {}) {
  const pastasOrdenadas = [...pastas]
    .sort((a, b) => a.ordem - b.ordem)
    .map((p, i) => ({ id: p.id, nome: p.nome, cor: p.cor, ordem: i }));

  const notasMontadas = incluirNotas
    ? notas.map((n, i) => {
        const criadoEm = isoDiasAtras(n.diasAtras ?? 0, agora, n.hora ?? 9);
        return {
          id: n.id,
          titulo: n.titulo,
          texto: n.texto,
          pastaId: n.pastaId ?? null,
          criadoEm,
          atualizadoEm: criadoEm,
          privada: Boolean(n.privada),
          favorita: Boolean(n.favorita),
          confianca: n.confianca ?? null,
          origem: n.origem ?? "manual",
          lembrete: n.lembreEmDias == null ? null : dataDiasDepois(n.lembreEmDias, agora),
          ordem: i,
          excluidaEm: n.excluidaDiasAtras == null ? null : isoDiasAtras(n.excluidaDiasAtras, agora, 12),
        };
      })
    : [];

  const historico = notasMontadas
    .flatMap((n) => {
      const eventos = [{ id: `h_${n.id}_c`, acao: "criou", notaId: n.id, titulo: n.titulo, pastaId: n.pastaId, em: n.criadoEm }];
      if (n.excluidaEm) eventos.push({ id: `h_${n.id}_r`, acao: "removeu", notaId: n.id, titulo: n.titulo, pastaId: n.pastaId, em: n.excluidaEm });
      return eventos;
    })
    .sort((a, b) => new Date(b.em) - new Date(a.em));

  return { versao: VERSAO_DADOS, notas: notasMontadas, pastas: pastasOrdenadas, historico, config: { ...CONFIG_PADRAO } };
}
