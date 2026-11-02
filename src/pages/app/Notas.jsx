import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Cabecalho from "../../components/app/Cabecalho.jsx";
import NotaCard from "../../components/app/NotaCard.jsx";
import Botao from "../../components/ui/Botao.jsx";
import EstadoVazio from "../../components/ui/EstadoVazio.jsx";
import useDados from "../../hooks/useDados.js";
import useDebounce from "../../hooks/useDebounce.js";
import useTitulo from "../../hooks/useTitulo.js";
import { filtrarNotas, ORDENACOES } from "../../lib/busca.js";

const seletor = "rounded-lg border border-linha bg-white px-3 py-2 text-sm font-medium hover:border-grafite/50";

export default function Notas() {
  useTitulo("Notas");
  const navegar = useNavigate();
  const [params, setParams] = useSearchParams();
  const { notasAtivas, pastas, alternarFavorita } = useDados();

  const [consulta, setConsulta] = useState(params.get("q") ?? "");
  const [visibilidade, setVisibilidade] = useState("todas");
  const [favoritas, setFavoritas] = useState(false);
  const [ordem, setOrdem] = useState("recentes");
  const [selecionadas, setSelecionadas] = useState([]);
  const pastaId = params.get("pasta") ?? "todas";

  // A busca só roda 250 ms depois da última tecla, para não filtrar a cada letra.
  const consultaAtrasada = useDebounce(consulta, 250);
  const lista = useMemo(
    () => filtrarNotas(notasAtivas, { consulta: consultaAtrasada, pastaId, visibilidade, favoritas, ordem }),
    [notasAtivas, consultaAtrasada, pastaId, visibilidade, favoritas, ordem],
  );
  const pastaPorId = useMemo(() => Object.fromEntries(pastas.map((p) => [p.id, p])), [pastas]);

  const mudarPasta = (valor) => {
    const proximos = new URLSearchParams(params);
    if (valor === "todas") proximos.delete("pasta");
    else proximos.set("pasta", valor);
    setParams(proximos, { replace: true });
  };

  const alternarSelecao = (id) =>
    setSelecionadas((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : atual.length >= 2 ? [atual[1], id] : [...atual, id]));

  const limpar = () => {
    setConsulta("");
    setVisibilidade("todas");
    setFavoritas(false);
    mudarPasta("todas");
  };

  const filtrando = consulta || visibilidade !== "todas" || favoritas || pastaId !== "todas";

  return (
    <>
      <Cabecalho titulo="Notas" descricao="Tudo o que você capturou e escreveu. Busque por qualquer palavra do texto.">
        <Botao as={Link} to="/app/notas/nova" variante="secundario">
          Nova nota
        </Botao>
        <Botao as={Link} to="/app/capturar" variante="marca">
          Capturar
        </Botao>
      </Cabecalho>

      <div role="search" aria-label="Buscar e filtrar notas" className="mb-6 grid gap-3">
        <div className="grid gap-1.5">
          <label htmlFor="busca" className="text-sm font-semibold">
            Buscar nas notas
          </label>
          <input
            id="busca"
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Ex.: grid, hooks, heurística"
            className="w-full rounded-lg border border-linha bg-white px-4 py-3 text-base placeholder:text-grafite/60 hover:border-grafite/50"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Filtrar por pasta" value={pastaId} onChange={(e) => mudarPasta(e.target.value)} className={seletor}>
            <option value="todas">Todas as pastas</option>
            <option value="sem-pasta">Sem pasta</option>
            {pastas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          <select aria-label="Filtrar por privacidade" value={visibilidade} onChange={(e) => setVisibilidade(e.target.value)} className={seletor}>
            <option value="todas">Privadas e públicas</option>
            <option value="privadas">Só privadas</option>
            <option value="publicas">Só públicas</option>
          </select>
          <select aria-label="Ordenar notas" value={ordem} onChange={(e) => setOrdem(e.target.value)} className={seletor}>
            {ORDENACOES.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-pressed={favoritas}
            onClick={() => setFavoritas((v) => !v)}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold ${favoritas ? "border-tinta bg-marca" : "border-linha bg-white hover:border-grafite/50"}`}
          >
            Só favoritas
          </button>
          {filtrando && (
            <Botao variante="fantasma" tamanho="sm" onClick={limpar}>
              Limpar filtros
            </Botao>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm font-medium text-grafite">
          {lista.length} {lista.length === 1 ? "nota" : "notas"}
          {filtrando ? " encontradas" : ""}
        </p>
        {selecionadas.length === 2 ? (
          <Botao tamanho="sm" onClick={() => navegar(`/app/comparar?a=${selecionadas[0]}&b=${selecionadas[1]}`)}>
            Comparar as 2 notas lado a lado
          </Botao>
        ) : (
          <p className="text-sm text-grafite">Marque 2 notas em “Comparar” para vê-las lado a lado.</p>
        )}
      </div>

      {lista.length === 0 ? (
        <EstadoVazio
          titulo={filtrando ? "Nada encontrado" : "Nenhuma nota ainda"}
          texto={filtrando ? "Tente outra palavra ou remova algum filtro." : "Capture um quadro ou escreva a sua primeira nota."}
        >
          {filtrando ? (
            <Botao onClick={limpar}>Limpar filtros</Botao>
          ) : (
            <Botao as={Link} to="/app/capturar" variante="marca">
              Capturar agora
            </Botao>
          )}
        </EstadoVazio>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lista.map((n) => (
            <NotaCard
              key={n.id}
              nota={n}
              pasta={pastaPorId[n.pastaId]}
              consulta={consultaAtrasada}
              selecionavel
              selecionada={selecionadas.includes(n.id)}
              aoSelecionar={alternarSelecao}
              aoFavoritar={alternarFavorita}
            />
          ))}
        </div>
      )}
    </>
  );
}
