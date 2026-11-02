export const MS_DIA = 86_400_000;
const dois = (n) => String(n).padStart(2, "0");

export function inicioDoDia(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Diferença em dias de calendário (positiva quando `de` é anterior a `ate`). */
export function diasEntre(de, ate = new Date()) {
  return Math.round((inicioDoDia(ate) - inicioDoDia(de)) / MS_DIA);
}

export function isoDiasAtras(dias, agora = new Date(), hora = 10) {
  const d = new Date(agora);
  d.setDate(d.getDate() - dias);
  d.setHours(hora, 0, 0, 0);
  return d.toISOString();
}

/** Data local no formato YYYY-MM-DD (valor de <input type="date">). */
export function dataLocal(data = new Date()) {
  const d = new Date(data);
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

export function dataDiasDepois(dias, agora = new Date()) {
  const d = new Date(agora);
  d.setDate(d.getDate() + dias);
  return dataLocal(d);
}

/** Dias até um lembrete (YYYY-MM-DD). Negativo = já passou. */
export function diasAteLembrete(lembrete, agora = new Date()) {
  return diasEntre(agora, new Date(`${lembrete}T00:00:00`));
}

export function formatarData(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
}

export function formatarDataHora(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")}, ${dois(d.getHours())}h${dois(d.getMinutes())}`;
}

export function formatarLembrete(lembrete) {
  return new Date(`${lembrete}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
}

export function formatarRelativo(iso, agora = new Date()) {
  const dias = diasEntre(iso, agora);
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 7) return `há ${dias} dias`;
  return formatarData(iso);
}
