export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarEmail(valor = "") {
  if (!valor.trim()) return "Informe seu e-mail.";
  if (!REGEX_EMAIL.test(valor.trim())) return "Digite um e-mail válido, como nome@dominio.com.";
  return "";
}

export function validarSenha(valor = "") {
  if (!valor) return "Crie uma senha.";
  if (valor.length < 8) return "Use pelo menos 8 caracteres.";
  if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor)) return "Misture letras e números.";
  return "";
}

export function validarTexto(valor = "", { rotulo = "Este campo", min = 1, max = Infinity } = {}) {
  const tamanho = valor.trim().length;
  if (tamanho === 0) return `Preencha ${rotulo}.`;
  if (tamanho < min) return `${rotulo} precisa de pelo menos ${min} caracteres.`;
  if (tamanho > max) return `${rotulo} aceita no máximo ${max} caracteres.`;
  return "";
}
