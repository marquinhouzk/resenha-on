import { useMemo } from "react";
import { diasAteLembrete, diasEntre, formatarLembrete } from "../lib/datas.js";
import { DIAS_NA_LIXEIRA } from "../lib/dadosReducer.js";

/** Gera os avisos do aluno a partir das notas e das preferências (sem estado próprio). */
export default function useNotificacoes(notas, config) {
  return useMemo(() => {
    if (!config?.notificacoes) return [];
    const agora = new Date();
    const avisos = [];

    notas
      .filter((n) => !n.excluidaEm && n.lembrete)
      .forEach((n) => {
        const dias = diasAteLembrete(n.lembrete, agora);
        if (dias < 0) {
          avisos.push({ id: `l_${n.id}`, tipo: "vencido", urgencia: 0, titulo: n.titulo, texto: `Lembrete venceu em ${formatarLembrete(n.lembrete)}.`, notaId: n.id });
        } else if (dias <= config.antecedenciaDias) {
          const quando = dias === 0 ? "hoje" : dias === 1 ? "amanhã" : `em ${dias} dias`;
          avisos.push({ id: `l_${n.id}`, tipo: "lembrete", urgencia: dias + 1, titulo: n.titulo, texto: `Lembrete para ${quando} (${formatarLembrete(n.lembrete)}).`, notaId: n.id });
        }
      });

    const apagando = notas.filter((n) => n.excluidaEm && DIAS_NA_LIXEIRA - diasEntre(n.excluidaEm, agora) <= 3);
    if (apagando.length) {
      avisos.push({ id: "lixeira", tipo: "lixeira", urgencia: 50, titulo: "Lixeira", texto: `${apagando.length} ${apagando.length === 1 ? "item será apagado" : "itens serão apagados"} em até 3 dias.`, notaId: null });
    }

    const publicas = notas.filter((n) => !n.excluidaEm && !n.privada).length;
    if (publicas) {
      avisos.push({ id: "publicas", tipo: "privacidade", urgencia: 90, titulo: "Privacidade", texto: `${publicas} ${publicas === 1 ? "nota está pública" : "notas estão públicas"}. Revise quem pode ver.`, notaId: null });
    }

    return avisos.sort((a, b) => a.urgencia - b.urgencia);
  }, [notas, config]);
}
