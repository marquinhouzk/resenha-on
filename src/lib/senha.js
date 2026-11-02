/** Hash SHA-256 (Web Crypto) para não guardar senhas em texto puro. */
export async function hashSenha(senha) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("Este navegador não oferece criptografia segura. Abra o site em HTTPS ou em localhost.");
  }
  const bytes = new TextEncoder().encode(`resenhaon:${senha}`);
  const resumo = await subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(resumo)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
