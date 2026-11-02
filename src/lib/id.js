// Gera IDs curtos e únicos o bastante para dados guardados no navegador.
export function gerarId(prefixo = "id") {
  const aleatorio = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .padStart(4, "0");
  return `${prefixo}_${Date.now().toString(36)}${aleatorio}`;
}
