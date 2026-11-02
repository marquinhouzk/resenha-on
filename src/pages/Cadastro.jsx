import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Botao from "../components/ui/Botao.jsx";
import Campo from "../components/ui/Campo.jsx";
import useAuth from "../hooks/useAuth.js";
import useFormulario from "../hooks/useFormulario.js";
import useTitulo from "../hooks/useTitulo.js";
import { validarEmail, validarSenha, validarTexto } from "../lib/validacao.js";

const validar = (v) => {
  const e = {};
  const nome = validarTexto(v.nome, { rotulo: "seu nome", min: 3, max: 80 });
  const email = validarEmail(v.email);
  const senha = validarSenha(v.senha);
  if (nome) e.nome = nome;
  if (email) e.email = email;
  if (senha) e.senha = senha;
  if (!v.confirmar) e.confirmar = "Repita a senha.";
  else if (v.confirmar !== v.senha) e.confirmar = "As senhas não são iguais.";
  return e;
};

export default function Cadastro() {
  useTitulo("Criar conta");
  const { cadastrar } = useAuth();
  const navegar = useNavigate();
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { valores, erroDe, alterar, sair, enviar } = useFormulario({ nome: "", email: "", senha: "", confirmar: "" }, validar);

  const aoEnviar = async ({ nome, email, senha }) => {
    setErroGeral("");
    setEnviando(true);
    try {
      await cadastrar({ nome, email, senha });
      navegar("/app", { replace: true });
    } catch (e) {
      setErroGeral(e.message);
      setEnviando(false);
    }
  };

  return (
    <>
      <div className="grid gap-2">
        <h1 className="text-4xl font-extrabold">Criar conta</h1>
        <p className="text-grafite">Leva menos de um minuto. A conta fica salva neste navegador.</p>
      </div>

      <form onSubmit={enviar(aoEnviar)} noValidate className="grid gap-4">
        {erroGeral && (
          <p role="alert" className="rounded-lg border border-rosa/40 bg-rosa/10 px-3 py-2 text-sm font-medium text-rosa">
            {erroGeral}
          </p>
        )}
        <Campo id="campo-nome" name="nome" rotulo="Nome" autoComplete="name" value={valores.nome} onChange={alterar} onBlur={sair} erro={erroDe("nome")} />
        <Campo id="campo-email" name="email" rotulo="E-mail" type="email" autoComplete="email" value={valores.email} onChange={alterar} onBlur={sair} erro={erroDe("email")} />
        <Campo
          id="campo-senha"
          name="senha"
          rotulo="Senha"
          type="password"
          autoComplete="new-password"
          value={valores.senha}
          onChange={alterar}
          onBlur={sair}
          erro={erroDe("senha")}
          ajuda="Pelo menos 8 caracteres, com letras e números."
        />
        <Campo id="campo-confirmar" name="confirmar" rotulo="Repita a senha" type="password" autoComplete="new-password" value={valores.confirmar} onChange={alterar} onBlur={sair} erro={erroDe("confirmar")} />
        <Botao type="submit" tamanho="lg" disabled={enviando}>
          {enviando ? "Criando conta..." : "Criar conta"}
        </Botao>
      </form>

      <p className="text-grafite">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-jovi underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
