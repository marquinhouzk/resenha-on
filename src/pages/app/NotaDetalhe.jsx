import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Botao from "../../components/ui/Botao.jsx";
import ConfirmaDialogo from "../../components/ui/ConfirmaDialogo.jsx";
import EstadoVazio from "../../components/ui/EstadoVazio.jsx";
import Selo from "../../components/ui/Selo.jsx";
import useDados from "../../hooks/useDados.js";
import useTitulo from "../../hooks/useTitulo.js";
import useToast from "../../hooks/useToast.js";
import { contarPalavras } from "../../lib/comparar.js";
import { formatarDataHora, formatarLembrete } from "../../lib/datas.js";
import { baixarArquivo, nomeDeArquivo, notaParaTexto } from "../../lib/exportar.js";

export default function NotaDetalhe() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { avisar } = useToast();
  const { notas, pastas, alternarFavorita, alternarPrivada, moverNota, excluirNota, restaurarNota, registrarExportacao } = useDados();
  const [confirmando, setConfirmando] = useState(false);

  const nota = notas.find((n) => n.id === id && !n.excluidaEm);
  useTitulo(nota?.titulo ?? "Nota não encontrada");

  if (!nota) {
    return (
      <EstadoVazio titulo="Nota não encontrada" texto="Ela pode ter sido removida ou o link está incorreto.">
        <Botao as={Link} to="/app/notas">
          Voltar para as notas
        </Botao>
      </EstadoVazio>
    );
  }

  const pasta = pastas.find((p) => p.id === nota.pastaId);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(nota.texto);
      avisar("Texto copiado.");
    } catch {
      avisar("O navegador bloqueou a cópia. Selecione o texto e copie com Ctrl+C.", { tipo: "erro" });
    }
  };

  const exportarTxt = () => {
    baixarArquivo(`${nomeDeArquivo(nota.titulo)}.txt`, notaParaTexto(nota, pasta?.nome));
    registrarExportacao(nota.id);
    avisar("Arquivo .txt baixado.");
  };

  const exportarJson = () => {
    baixarArquivo(`${nomeDeArquivo(nota.titulo)}.json`, JSON.stringify({ ...nota, pasta: pasta?.nome ?? null }, null, 2), "application/json");
    registrarExportacao(nota.id);
    avisar("Arquivo .json baixado.");
  };

  const aoExcluir = () => {
    excluirNota(nota.id);
    setConfirmando(false);
    avisar("Nota enviada para a lixeira.", { acao: { rotulo: "Desfazer", aoClicar: () => restaurarNota(nota.id) } });
    navegar("/app/notas", { replace: true });
  };

  return (
    <article className="grid gap-6">
      <Link to="/app/notas" className="w-fit text-sm font-semibold text-jovi underline underline-offset-4">
        Voltar para as notas
      </Link>

      <header className="grid gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {pasta ? (
            <Selo>
              <span aria-hidden="true" className="size-2 rounded-full" style={{ background: pasta.cor }} />
              {pasta.nome}
            </Selo>
          ) : (
            <Selo>Sem pasta</Selo>
          )}
          <Selo tom={nota.privada ? "neutro" : "verde"}>{nota.privada ? "Privada" : "Pública"}</Selo>
          <Selo tom="azul">{nota.origem === "camera" ? "Capturada pela câmera" : "Escrita à mão"}</Selo>
          {nota.confianca != null && <Selo tom="marca">{nota.confianca}% de confiança</Selo>}
          {nota.lembrete && <Selo tom="azul">Lembrete em {formatarLembrete(nota.lembrete)}</Selo>}
        </div>
        <h1 className="text-4xl font-extrabold sm:text-5xl">{nota.titulo}</h1>
        <p className="text-sm text-grafite">
          Criada em {formatarDataHora(nota.criadoEm)} · {contarPalavras(nota.texto)} palavras
          {nota.atualizadoEm !== nota.criadoEm && ` · editada em ${formatarDataHora(nota.atualizadoEm)}`}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Botao as={Link} to={`/app/notas/${nota.id}/editar`}>
          Editar
        </Botao>
        <Botao variante="secundario" onClick={copiar}>
          Copiar texto
        </Botao>
        <Botao variante="secundario" onClick={exportarTxt}>
          Baixar .txt
        </Botao>
        <Botao variante="secundario" onClick={exportarJson}>
          Baixar .json
        </Botao>
        <Botao variante="secundario" aria-pressed={nota.favorita} onClick={() => alternarFavorita(nota.id)}>
          {nota.favorita ? "Remover dos favoritos" : "Favoritar"}
        </Botao>
        <Botao variante="perigo" onClick={() => setConfirmando(true)}>
          Excluir
        </Botao>
      </div>

      <div className="whitespace-pre-wrap rounded-2xl border border-linha bg-white p-6 text-lg leading-relaxed">{nota.texto}</div>

      <section aria-labelledby="organizar" className="grid gap-4 rounded-2xl bg-ceu p-6 sm:grid-cols-2">
        <h2 id="organizar" className="text-2xl font-bold sm:col-span-2">
          Organização e privacidade
        </h2>
        <div className="grid gap-1.5">
          <label htmlFor="mover" className="text-sm font-semibold">
            Mover para a pasta
          </label>
          <select id="mover" value={nota.pastaId ?? ""} onChange={(e) => moverNota(nota.id, e.target.value)} className="rounded-lg border border-linha bg-white px-3 py-2.5">
            <option value="">Sem pasta</option>
            {pastas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="grid content-start gap-1.5">
          <span className="text-sm font-semibold">Quem pode ver</span>
          <Botao variante="secundario" onClick={() => alternarPrivada(nota.id)}>
            {nota.privada ? "Privada: tornar pública" : "Pública: tornar privada"}
          </Botao>
        </div>
      </section>

      <ConfirmaDialogo
        aberto={confirmando}
        titulo="Excluir esta nota?"
        mensagem="Ela vai para a lixeira e fica lá por 30 dias. Você pode restaurar quando quiser."
        rotuloConfirmar="Enviar para a lixeira"
        perigo
        aoConfirmar={aoExcluir}
        aoCancelar={() => setConfirmando(false)}
      />
    </article>
  );
}
