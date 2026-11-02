import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import useDados from "../../hooks/useDados.js";
import Botao from "../ui/Botao.jsx";
import Carregando from "../ui/Carregando.jsx";
import ErroApi from "../ui/ErroApi.jsx";
import Logo from "../ui/Logo.jsx";
import Icone from "./Icone.jsx";
import Notificacoes from "./Notificacoes.jsx";

const NAV = [
  { to: "/app", rotulo: "Início", icone: "inicio", fim: true },
  { to: "/app/notas", rotulo: "Notas", icone: "notas" },
  { to: "/app/pastas", rotulo: "Pastas", icone: "pastas" },
  { to: "/app/historico", rotulo: "Histórico", icone: "historico" },
  { to: "/app/lixeira", rotulo: "Lixeira", icone: "lixeira" },
];

const classeLink = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold transition-colors ${isActive ? "bg-marca text-tinta" : "text-white/80 hover:bg-white/10 hover:text-white"}`;

export default function AppLayout() {
  const { usuario, sair } = useAuth();
  const { status, erro, recarregar, lixeira } = useDados();
  const navegar = useNavigate();

  const aoSair = () => {
    sair();
    navegar("/", { replace: true });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[16.5rem_1fr]">
      <aside className="sticky top-0 hidden h-screen content-between bg-quadro p-5 lg:grid">
        <div className="grid content-start gap-8">
          <Logo to="/app" escuro />
          <nav aria-label="Área do aluno">
            <ul className="grid gap-1">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.fim} className={classeLink}>
                    <Icone nome={n.icone} />
                    {n.rotulo}
                    {n.to === "/app/lixeira" && lixeira.length > 0 && <span className="ml-auto rounded-full bg-white/15 px-2 text-xs">{lixeira.length}</span>}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/app/configuracoes" className={classeLink}>
                  <Icone nome="ajustes" />
                  Ajustes
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="grid gap-3 border-t border-white/15 pt-4 text-white">
          <div>
            <p className="font-semibold">{usuario.nome}</p>
            <p className="truncate text-sm text-white/60">{usuario.email}</p>
          </div>
          <button type="button" onClick={aoSair} className="flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-white/80 hover:text-marca">
            <Icone nome="sair" className="size-4" />
            Sair
          </button>
        </div>
      </aside>

      <div className="grid grid-rows-[auto_1fr] pb-20 lg:pb-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-linha bg-papel/90 px-5 py-3 backdrop-blur">
          <div className="lg:hidden">
            <Logo to="/app" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Notificacoes />
            <Link to="/app/configuracoes" aria-label="Ajustes da conta" className="grid size-10 place-items-center rounded-lg border border-linha bg-white font-display font-bold hover:border-tinta lg:hidden">
              {usuario.nome.charAt(0).toUpperCase()}
            </Link>
            <Botao as={Link} to="/app/capturar" variante="marca">
              <Icone nome="camera" className="size-4" />
              Capturar
            </Botao>
          </div>
        </header>

        <main id="conteudo" className="mx-auto w-full max-w-5xl px-5 py-8">
          {status === "carregando" && <Carregando texto="Abrindo o seu caderno..." />}
          {status === "erro" && <ErroApi mensagem={erro} aoTentarDeNovo={recarregar} />}
          {status === "pronto" && <Outlet />}
        </main>
      </div>

      <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-quadro lg:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.fim}
                className={({ isActive }) => `grid justify-items-center gap-0.5 py-2.5 text-xs font-semibold ${isActive ? "text-marca" : "text-white/70"}`}
              >
                <Icone nome={n.icone} />
                {n.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
