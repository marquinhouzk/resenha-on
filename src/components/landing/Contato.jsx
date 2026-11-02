import { useState } from "react";
import useFormulario from "../../hooks/useFormulario.js";
import { PROJETO } from "../../data/projeto.js";
import { gerarId } from "../../lib/id.js";
import { validarEmail, validarTexto } from "../../lib/validacao.js";
import { CHAVES, gravar, ler } from "../../services/armazenamento.js";
import Botao from "../ui/Botao.jsx";
import Campo from "../ui/Campo.jsx";

const INICIAL = { nome: "", email: "", assunto: "duvida", mensagem: "" };
const LIMITE = 500;

function validar(v) {
  const e = {};
  const nome = validarTexto(v.nome, { rotulo: "seu nome", min: 3, max: 80 });
  const email = validarEmail(v.email);
  const mensagem = validarTexto(v.mensagem, { rotulo: "a mensagem", min: 10, max: LIMITE });
  if (nome) e.nome = nome;
  if (email) e.email = email;
  if (mensagem) e.mensagem = mensagem;
  return e;
}

export default function Contato() {
  const [enviada, setEnviada] = useState(null);
  const { valores, erroDe, alterar, sair, redefinir, enviar } = useFormulario(INICIAL, validar);

  const aoEnviar = async (v) => {
    const registro = { id: gerarId("m"), ...v, nome: v.nome.trim(), mensagem: v.mensagem.trim(), em: new Date().toISOString() };
    gravar(CHAVES.mensagens, [...ler(CHAVES.mensagens, []), registro]);
    setEnviada(registro.nome.split(" ")[0]);
    redefinir();
  };

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-12">
        <div className="grid content-start gap-5 lg:col-span-5">
          <h2 id="contato-titulo" className="text-4xl font-extrabold sm:text-5xl">
            Fale com a equipe
          </h2>
          <p className="text-tinta/80">Dúvida, sugestão ou feedback sobre o Modo Estudo? Escreva para a gente.</p>
          <ul className="grid gap-2 font-medium">
            <li>
              <a className="underline decoration-marca decoration-4 underline-offset-4 hover:text-jovi" href={`mailto:${PROJETO.email}`}>
                {PROJETO.email}
              </a>
            </li>
            {PROJETO.repositorio && (
              <li>
                <a className="underline decoration-marca decoration-4 underline-offset-4 hover:text-jovi" href={PROJETO.repositorio} target="_blank" rel="noreferrer">
                  Repositório no GitHub
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-7">
          {enviada ? (
            <div role="status" className="grid gap-3 rounded-2xl bg-quadro p-8 text-white">
              <h3 className="text-2xl font-bold">Mensagem enviada, {enviada}.</h3>
              <p className="text-white/80">Recebemos o seu recado e respondemos pelo e-mail informado.</p>
              <Botao variante="marca" className="w-fit" onClick={() => setEnviada(null)}>
                Enviar outra mensagem
              </Botao>
            </div>
          ) : (
            <form onSubmit={enviar(aoEnviar)} noValidate className="grid gap-4 rounded-2xl border border-linha bg-white p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo id="campo-nome" name="nome" rotulo="Nome" autoComplete="name" value={valores.nome} onChange={alterar} onBlur={sair} erro={erroDe("nome")} />
                <Campo id="campo-email" name="email" rotulo="E-mail" type="email" autoComplete="email" value={valores.email} onChange={alterar} onBlur={sair} erro={erroDe("email")} />
              </div>
              <Campo id="campo-assunto" name="assunto" rotulo="Assunto" elemento="select" value={valores.assunto} onChange={alterar}>
                <option value="duvida">Dúvida sobre o projeto</option>
                <option value="sugestao">Sugestão de recurso</option>
                <option value="parceria">Parceria</option>
              </Campo>
              <Campo
                id="campo-mensagem"
                name="mensagem"
                rotulo="Mensagem"
                elemento="textarea"
                rows={5}
                value={valores.mensagem}
                onChange={alterar}
                onBlur={sair}
                erro={erroDe("mensagem")}
                ajuda={`${valores.mensagem.length} de ${LIMITE} caracteres`}
              />
              <Botao type="submit" className="w-fit">
                Enviar mensagem
              </Botao>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
