import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../components/app/Cabecalho.jsx";
import Botao from "../../components/ui/Botao.jsx";
import ConfirmaDialogo from "../../components/ui/ConfirmaDialogo.jsx";
import useAuth from "../../hooks/useAuth.js";
import useDados from "../../hooks/useDados.js";
import useTitulo from "../../hooks/useTitulo.js";
import useToast from "../../hooks/useToast.js";
import { baixarArquivo } from "../../lib/exportar.js";
import { resumoNotas } from "../../lib/estatisticas.js";

function Secao({ id, titulo, children }) {
  return (
    <section aria-labelledby={id} className="grid content-start gap-4 rounded-2xl border border-linha bg-white p-6">
      <h2 id={id} className="text-2xl font-bold">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Chave({ rotulo, descricao, marcado, aoMudar }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <b className="block">{rotulo}</b>
        <span className="text-sm text-grafite">{descricao}</span>
      </span>
      <input type="checkbox" role="switch" checked={marcado} onChange={(e) => aoMudar(e.target.checked)} className="mt-1 size-6 shrink-0 accent-jovi" />
    </label>
  );
}

export default function Configuracoes() {
  useTitulo("Ajustes");
  const navegar = useNavigate();
  const { avisar } = useToast();
  const { usuario, sair } = useAuth();
  const { notas, config, estadoBruto, atualizarConfig, tornarTodasPrivadas, restaurarDemonstracao } = useDados();
  const [dialogo, setDialogo] = useState(null);
  const resumo = resumoNotas(notas);

  const exportarBackup = () => {
    baixarArquivo(`resenha-on-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(estadoBruto, null, 2), "application/json");
    avisar("Backup baixado.");
  };

  return (
    <>
      <Cabecalho titulo="Ajustes" descricao="Avisos, privacidade e seus dados." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Secao id="conta" titulo="Conta">
          <div>
            <p className="font-semibold">{usuario.nome}</p>
            <p className="text-grafite">{usuario.email}</p>
          </div>
          <Botao
            variante="secundario"
            className="w-fit"
            onClick={() => {
              sair();
              navegar("/", { replace: true });
            }}
          >
            Sair da conta
          </Botao>
        </Secao>

        <Secao id="avisos" titulo="Notificações">
          <Chave rotulo="Avisos de lembretes" descricao="Mostra no sino as notas com data próxima e a lixeira prestes a apagar." marcado={config.notificacoes} aoMudar={(v) => atualizarConfig({ notificacoes: v })} />
          <div className="grid gap-1.5">
            <label htmlFor="antecedencia" className="font-semibold">
              Avisar com {config.antecedenciaDias} {config.antecedenciaDias === 1 ? "dia" : "dias"} de antecedência
            </label>
            <input
              id="antecedencia"
              type="range"
              min="1"
              max="14"
              value={config.antecedenciaDias}
              disabled={!config.notificacoes}
              onChange={(e) => atualizarConfig({ antecedenciaDias: Number(e.target.value) })}
              className="accent-jovi disabled:opacity-40"
            />
          </div>
        </Secao>

        <Secao id="privacidade" titulo="Privacidade">
          <Chave rotulo="Novas notas começam privadas" descricao="Você ainda pode mudar a privacidade de cada nota." marcado={config.privadaPorPadrao} aoMudar={(v) => atualizarConfig({ privadaPorPadrao: v })} />
          <p className="rounded-xl bg-papel px-4 py-3 text-sm">
            Hoje você tem <b>{resumo.privadas}</b> {resumo.privadas === 1 ? "nota privada" : "notas privadas"} e <b>{resumo.publicas}</b> {resumo.publicas === 1 ? "pública" : "públicas"}.
          </p>
          <Botao variante="secundario" className="w-fit" disabled={resumo.publicas === 0} onClick={() => setDialogo("privadas")}>
            Tornar todas privadas
          </Botao>
        </Secao>

        <Secao id="dados" titulo="Seus dados">
          <p className="text-sm text-grafite">Tudo fica salvo neste navegador. Baixe um backup para guardar ou levar para outro computador.</p>
          <div className="flex flex-wrap gap-2">
            <Botao variante="secundario" onClick={exportarBackup}>
              Baixar backup (.json)
            </Botao>
            <Botao variante="perigo" onClick={() => setDialogo("restaurar")}>
              Restaurar dados de exemplo
            </Botao>
          </div>
        </Secao>
      </div>

      <ConfirmaDialogo
        aberto={dialogo === "privadas"}
        titulo="Tornar todas as notas privadas?"
        mensagem={`${resumo.publicas} ${resumo.publicas === 1 ? "nota pública passa" : "notas públicas passam"} a ser privadas.`}
        rotuloConfirmar="Tornar privadas"
        aoConfirmar={() => {
          tornarTodasPrivadas();
          setDialogo(null);
          avisar("Todas as notas agora são privadas.");
        }}
        aoCancelar={() => setDialogo(null)}
      />
      <ConfirmaDialogo
        aberto={dialogo === "restaurar"}
        titulo="Restaurar os dados de exemplo?"
        mensagem="Suas notas e pastas atuais serão substituídas pelos dados originais vindos da API. Faça um backup antes, se quiser guardá-las."
        rotuloConfirmar="Restaurar"
        perigo
        aoConfirmar={async () => {
          setDialogo(null);
          await restaurarDemonstracao();
          avisar("Dados de exemplo restaurados.");
        }}
        aoCancelar={() => setDialogo(null)}
      />
    </>
  );
}
