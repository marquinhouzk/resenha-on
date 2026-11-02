import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import useTeclaEsc from "../../hooks/useTeclaEsc.js";
import { LINKS_MENU } from "../../data/projeto.js";
import Botao from "../ui/Botao.jsx";
import Logo from "../ui/Logo.jsx";

export default function Header() {
  const [aberto, setAberto] = useState(false);
  const { autenticado } = useAuth();
  const fechar = useCallback(() => setAberto(false), []);
  useTeclaEsc(aberto, fechar);

  return (
    <header className="sticky top-0 z-40 border-b border-linha bg-papel/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Logo />

        <nav aria-label="Principal" className="contents">
          <ul
            id="menu-principal"
            className={`${aberto ? "grid" : "hidden"} absolute inset-x-0 top-full gap-1 border-b border-linha bg-papel px-5 pb-4 pt-2 lg:static lg:flex lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0`}
          >
            {LINKS_MENU.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={fechar} className="block rounded-lg px-3 py-2 text-[0.95rem] font-semibold text-tinta/80 transition-colors hover:bg-tinta/5 hover:text-tinta">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {autenticado ? (
            <Botao as={Link} to="/app" tamanho="sm">
              Meu caderno
            </Botao>
          ) : (
            <>
              <Botao as={Link} to="/login" variante="fantasma" tamanho="sm">
                Entrar
              </Botao>
              <Botao as={Link} to="/cadastro" tamanho="sm" className="hidden sm:inline-flex">
                Criar conta
              </Botao>
            </>
          )}
          <button
            type="button"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            aria-controls="menu-principal"
            onClick={() => setAberto((v) => !v)}
            className="grid size-10 cursor-pointer place-items-center rounded-lg border border-linha bg-white lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {aberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
