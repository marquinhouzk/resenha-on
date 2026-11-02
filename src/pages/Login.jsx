import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Botao from "../components/ui/Botao.jsx";
import Campo from "../components/ui/Campo.jsx";
import useAuth from "../hooks/useAuth.js";
import useFormulario from "../hooks/useFormulario.js";
import useTitulo from "../hooks/useTitulo.js";
import { validarEmail } from "../lib/validacao.js";

const validar = (v) => {
  const e = {};
  const email = validarEmail(v.email);
  if (email) e.email = email;
  if (!v.senha) e.senha = "Digite a sua senha.";
  return e;
};

export default function Login() {
  useTitulo("Entrar");
  const { entrar } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();
  const destino = local.state?.de ?? "/app";
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { valores, erroDe, alterar, sair, definir, enviar } = useFormulario({ email: "", senha: "" }, validar);

  const aoEnviar = async ({ email, senha }) => {
    setErroGeral("");
    setEnviando(true);
    try {
      await entrar(email, senha);
      navegar(destino, { replace: true });
    } catch (e) {
      setErroGeral(e.message);
      setEnviando(false);
    }
  };

  const usarDemo = () => {
    definir("email", "demo@resenhaon.app");
    definir("senha", "Resenha@2026");
    setErroGeral("");
  };

  return (
    <>
      <div className="grid gap-2">
        <h1 className="text-4xl font-extrabold">Entrar</h1>
        <p className="text-grafite">
          {local.state?.de ? "Entre para abrir essa página." : "Abra o seu caderno de aulas."}
        </p>
      </div>

      <form onSubmit={enviar(aoEnviar)} noValidate className="grid gap-4">
        {erroGeral && (
          <p role="alert" className="rounded-lg border border-rosa/40 bg-rosa/10 px-3 py-2 text-sm font-medium text-rosa">
            {erroGeral}
          </p>
        )}
        <Campo id="campo-email" name="email" rotulo="E-mail" type="email" autoComplete="email" value={valores.email} onChange={alterar} onBlur={sair} erro={erroDe("email")} />
        <Campo id="campo-senha" name="senha" rotulo="Senha" type="password" autoComplete="current-password" value={valores.senha} onChange={alterar} onBlur={sair} erro={erroDe("senha")} />
        <Botao type="submit" tamanho="lg" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </Botao>
        <Botao variante="secundario" onClick={usarDemo}>
          Preencher com a conta de teste
        </Botao>
      </form>

      <p className="text-grafite">
        Ainda não tem conta?{" "}
        <Link to="/cadastro" className="font-semibold text-jovi underline">
          Criar conta
        </Link>
      </p>
    </>
  );
}
