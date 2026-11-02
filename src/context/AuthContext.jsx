import { createContext, useCallback, useMemo, useState } from "react";
import { hashSenha } from "../lib/senha.js";
import { gerarId } from "../lib/id.js";
import { api } from "../services/api.js";
import { CHAVES, gravar, ler, remover } from "../services/armazenamento.js";

export const AuthContext = createContext(null);

const sessaoDe = ({ id, nome, email, semente }) => ({ id, nome, email, semente: Boolean(semente) });

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => ler(CHAVES.sessao, null));

  const entrar = useCallback(async (email, senha) => {
    const alvo = email.trim().toLowerCase();
    const base = await api.usuarios();
    const extras = ler(CHAVES.usuarios, []);
    const conta = [...base, ...extras].find((u) => u.email.toLowerCase() === alvo);
    const hash = await hashSenha(senha);
    if (!conta || conta.senhaHash !== hash) {
      throw new Error("E-mail ou senha incorretos. Confira os dados e tente de novo.");
    }
    const sessao = sessaoDe(conta);
    gravar(CHAVES.sessao, sessao);
    setUsuario(sessao);
    return sessao;
  }, []);

  const cadastrar = useCallback(async ({ nome, email, senha }) => {
    const alvo = email.trim().toLowerCase();
    let base = [];
    try {
      base = await api.usuarios();
    } catch {
      /* sem API, valida só contra os cadastros locais */
    }
    const extras = ler(CHAVES.usuarios, []);
    if ([...base, ...extras].some((u) => u.email.toLowerCase() === alvo)) {
      throw new Error("Já existe uma conta com este e-mail. Entre ou use outro e-mail.");
    }
    const conta = { id: gerarId("u"), nome: nome.trim(), email: alvo, senhaHash: await hashSenha(senha), semente: false };
    gravar(CHAVES.usuarios, [...extras, conta]);
    const sessao = sessaoDe(conta);
    gravar(CHAVES.sessao, sessao);
    setUsuario(sessao);
    return sessao;
  }, []);

  const sair = useCallback(() => {
    remover(CHAVES.sessao);
    setUsuario(null);
  }, []);

  const valor = useMemo(() => ({ usuario, autenticado: Boolean(usuario), entrar, cadastrar, sair }), [usuario, entrar, cadastrar, sair]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
