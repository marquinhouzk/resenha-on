export function nomeDeArquivo(titulo = "nota") {
  const base = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.slice(0, 60) || "nota";
}

export function notaParaTexto(nota, nomePasta = "Sem pasta") {
  return `${nota.titulo}\nPasta: ${nomePasta}\nCriada em: ${new Date(nota.criadoEm).toLocaleString("pt-BR")}\n\n${nota.texto}\n`;
}

/** Dispara o download de um arquivo gerado no navegador. */
export function baixarArquivo(nome, conteudo, tipo = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
