import { useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Botao from "../../components/ui/Botao.jsx";
import Campo from "../../components/ui/Campo.jsx";
import EstadoVazio from "../../components/ui/EstadoVazio.jsx";
import useDados from "../../hooks/useDados.js";
import useFormulario from "../../hooks/useFormulario.js";
import useTitulo from "../../hooks/useTitulo.js";
import useToast from "../../hooks/useToast.js";
import { validarTexto } from "../../lib/validacao.js";

const LIMITE_TEXTO = 5000;

function validar(v) {
  const e = {};
  const titulo = validarTexto(v.titulo, { rotulo: "o título", min: 3, max: 80 });
  const texto = validarTexto(v.texto, { rotulo: "o texto", min: 10, max: LIMITE_TEXTO });
  if (titulo) e.titulo = titulo;
  if (texto) e.texto = texto;
  return e;
}

export default function NotaForm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { notas, pastas, config, criarNota, editarNota } = useDados();
  const nota = id ? notas.find((n) => n.id === id && !n.excluidaEm) : null;
  useTitulo(id ? "Editar nota" : "Nova nota");

  if (id && !nota) {
    return (
      <EstadoVazio titulo="Nota não encontrada" texto="Não dá para editar uma nota que não existe mais.">
        <Botao as={Link} to="/app/notas">
          Voltar para as notas
        </Botao>
      </EstadoVazio>
    );
  }
  return <Formulario nota={nota} pastas={pastas} config={config} pastaInicial={params.get("pasta") ?? ""} criarNota={criarNota} editarNota={editarNota} />;
}

function Formulario({ nota, pastas, config, pastaInicial, criarNota, editarNota }) {
  const navegar = useNavigate();
  const { avisar } = useToast();
  const iniciais = useMemo(
    () => ({
      titulo: nota?.titulo ?? "",
      texto: nota?.texto ?? "",
      pastaId: nota?.pastaId ?? (pastas.some((p) => p.id === pastaInicial) ? pastaInicial : ""),
      privada: nota?.privada ?? config.privadaPorPadrao,
      lembrete: nota?.lembrete ?? "",
    }),
    [nota, pastas, pastaInicial, config.privadaPorPadrao],
  );
  const { valores, erroDe, alterar, sair, enviar } = useFormulario(iniciais, validar);

  const aoSalvar = (v) => {
    if (nota) {
      editarNota(nota.id, { titulo: v.titulo.trim(), texto: v.texto.trim(), pastaId: v.pastaId || null, privada: v.privada, lembrete: v.lembrete || null });
      avisar("Alterações salvas.");
      navegar(`/app/notas/${nota.id}`);
    } else {
      const novoId = criarNota({ ...v, origem: "manual" });
      avisar("Nota criada.");
      navegar(`/app/notas/${novoId}`);
    }
  };

  return (
    <>
      <h1 className="mb-8 text-4xl font-extrabold">{nota ? "Editar nota" : "Nova nota"}</h1>
      <form onSubmit={enviar(aoSalvar)} noValidate className="grid max-w-2xl gap-5">
        <Campo id="campo-titulo" name="titulo" rotulo="Título" value={valores.titulo} onChange={alterar} onBlur={sair} erro={erroDe("titulo")} maxLength={80} />
        <Campo
          id="campo-texto"
          name="texto"
          rotulo="Texto"
          elemento="textarea"
          rows={10}
          value={valores.texto}
          onChange={alterar}
          onBlur={sair}
          erro={erroDe("texto")}
          ajuda={`${valores.texto.length} de ${LIMITE_TEXTO} caracteres`}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo id="campo-pastaId" name="pastaId" rotulo="Pasta" elemento="select" value={valores.pastaId} onChange={alterar}>
            <option value="">Sem pasta</option>
            {pastas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Campo>
          <Campo id="campo-lembrete" name="lembrete" rotulo="Lembrete (opcional)" type="date" value={valores.lembrete} onChange={alterar} ajuda="Você recebe um aviso perto da data." />
        </div>
        <label className="flex w-fit cursor-pointer items-center gap-3 font-semibold">
          <input type="checkbox" name="privada" checked={valores.privada} onChange={alterar} className="size-5 accent-jovi" />
          Manter esta nota privada
        </label>
        <div className="flex gap-2">
          <Botao type="submit" tamanho="lg">
            {nota ? "Salvar alterações" : "Criar nota"}
          </Botao>
          <Botao as={Link} to={nota ? `/app/notas/${nota.id}` : "/app/notas"} variante="secundario" tamanho="lg">
            Cancelar
          </Botao>
        </div>
      </form>
    </>
  );
}
