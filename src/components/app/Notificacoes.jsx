import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import useDados from "../../hooks/useDados.js";
import useNotificacoes from "../../hooks/useNotificacoes.js";
import useTeclaEsc from "../../hooks/useTeclaEsc.js";
import Icone from "./Icone.jsx";

const COR = { vencido: "bg-rosa", lembrete: "bg-marca", lixeira: "bg-grafite", privacidade: "bg-jovi" };

export default function Notificacoes() {
  const { notas, config } = useDados();
  const avisos = useNotificacoes(notas, config);
  const [aberto, setAberto] = useState(false);
  const fechar = useCallback(() => setAberto(false), []);
  useTeclaEsc(aberto, fechar);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls="painel-avisos"
        aria-label={`Avisos${avisos.length ? `, ${avisos.length} novos` : ""}`}
        className="relative grid size-10 cursor-pointer place-items-center rounded-lg border border-linha bg-white hover:border-tinta"
      >
        <Icone nome="sino" />
        {avisos.length > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-rosa px-1 text-xs font-bold text-white">{avisos.length}</span>
        )}
      </button>

      {aberto && (
        <>
          <button type="button" aria-label="Fechar avisos" onClick={fechar} className="fixed inset-0 z-30 cursor-default" tabIndex={-1} />
          <div id="painel-avisos" className="absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-linha bg-white p-2 shadow-xl">
            <p className="px-3 py-2 font-display text-lg font-bold">Avisos</p>
            {avisos.length === 0 ? (
              <p className="px-3 pb-3 text-sm text-grafite">Nada pendente por aqui. Você pode ligar os lembretes em Ajustes.</p>
            ) : (
              <ul className="grid gap-1">
                {avisos.map((a) => {
                  const conteudo = (
                    <>
                      <span aria-hidden="true" className={`mt-1.5 size-2.5 shrink-0 rounded-full ${COR[a.tipo]}`} />
                      <span>
                        <b className="block text-sm">{a.titulo}</b>
                        <span className="text-sm text-grafite">{a.texto}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={a.id}>
                      {a.notaId ? (
                        <Link to={`/app/notas/${a.notaId}`} onClick={fechar} className="flex gap-3 rounded-xl px-3 py-2 hover:bg-papel">
                          {conteudo}
                        </Link>
                      ) : (
                        <Link to={a.tipo === "lixeira" ? "/app/lixeira" : "/app/configuracoes"} onClick={fechar} className="flex gap-3 rounded-xl px-3 py-2 hover:bg-papel">
                          {conteudo}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
