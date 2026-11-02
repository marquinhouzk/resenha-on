import { useState } from "react";
import { Link } from "react-router-dom";
import Cabecalho from "../../components/app/Cabecalho.jsx";
import Botao from "../../components/ui/Botao.jsx";
import ConfirmaDialogo from "../../components/ui/ConfirmaDialogo.jsx";
import EstadoVazio from "../../components/ui/EstadoVazio.jsx";
import useDados from "../../hooks/useDados.js";
import useTitulo from "../../hooks/useTitulo.js";
import useToast from "../../hooks/useToast.js";
import { DIAS_NA_LIXEIRA } from "../../lib/dadosReducer.js";
import { diasEntre, formatarRelativo } from "../../lib/datas.js";

export default function Lixeira() {
  useTitulo("Lixeira");
  const { avisar } = useToast();
  const { lixeira, restaurarNota, excluirDefinitivo, esvaziarLixeira } = useDados();
  const [apagar, setApagar] = useState(null);
  const [esvaziando, setEsvaziando] = useState(false);

  const lista = [...lixeira].sort((a, b) => new Date(b.excluidaEm) - new Date(a.excluidaEm));

  return (
    <>
      <Cabecalho titulo="Lixeira" descricao={`Notas excluídas ficam aqui por ${DIAS_NA_LIXEIRA} dias. Depois disso, são apagadas para sempre.`}>
        {lista.length > 0 && (
          <Botao variante="perigo" onClick={() => setEsvaziando(true)}>
            Esvaziar lixeira
          </Botao>
        )}
      </Cabecalho>

      {lista.length === 0 ? (
        <EstadoVazio titulo="A lixeira está vazia" texto="Quando você excluir uma nota, ela aparece aqui e pode ser restaurada.">
          <Botao as={Link} to="/app/notas" variante="secundario">
            Ir para as notas
          </Botao>
        </EstadoVazio>
      ) : (
        <ul className="grid gap-3">
          {lista.map((n) => {
            const restam = Math.max(0, DIAS_NA_LIXEIRA - diasEntre(n.excluidaEm));
            return (
              <li key={n.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-linha bg-white p-4">
                <div className="grid gap-0.5">
                  <h2 className="text-lg font-bold">{n.titulo}</h2>
                  <p className="text-sm text-grafite">
                    Excluída {formatarRelativo(n.excluidaEm)} · será apagada em {restam} {restam === 1 ? "dia" : "dias"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Botao
                    tamanho="sm"
                    onClick={() => {
                      restaurarNota(n.id);
                      avisar("Nota restaurada.");
                    }}
                  >
                    Restaurar
                  </Botao>
                  <Botao tamanho="sm" variante="secundario" onClick={() => setApagar(n)}>
                    Apagar para sempre
                  </Botao>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmaDialogo
        aberto={Boolean(apagar)}
        titulo="Apagar para sempre?"
        mensagem={`“${apagar?.titulo ?? ""}” não poderá ser recuperada.`}
        rotuloConfirmar="Apagar para sempre"
        perigo
        aoConfirmar={() => {
          excluirDefinitivo(apagar.id);
          setApagar(null);
          avisar("Nota apagada para sempre.");
        }}
        aoCancelar={() => setApagar(null)}
      />
      <ConfirmaDialogo
        aberto={esvaziando}
        titulo="Esvaziar a lixeira?"
        mensagem={`${lista.length} ${lista.length === 1 ? "nota será apagada" : "notas serão apagadas"} para sempre.`}
        rotuloConfirmar="Esvaziar"
        perigo
        aoConfirmar={() => {
          esvaziarLixeira();
          setEsvaziando(false);
          avisar("Lixeira esvaziada.");
        }}
        aoCancelar={() => setEsvaziando(false)}
      />
    </>
  );
}
