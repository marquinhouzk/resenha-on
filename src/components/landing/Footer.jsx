import { Link } from "react-router-dom";
import { LINKS_MENU } from "../../data/projeto.js";
import Logo from "../ui/Logo.jsx";

export default function Footer() {
  return (
    <footer className="bg-quadro text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-12">
        <div className="grid content-start gap-3 md:col-span-6">
          <Logo escuro />
          <p className="max-w-[46ch] text-white/70">Projeto do Challenge 2026 da FIAP em parceria com a JOVI Smartphone. Engenharia de Software.</p>
        </div>
        <nav aria-label="Rodapé" className="md:col-span-3">
          <ul className="grid gap-1.5">
            {LINKS_MENU.map((l) => (
              <li key={l.href}>
                <a className="text-white/80 hover:text-marca" href={l.href}>
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="grid content-start gap-1.5 md:col-span-3">
          <li>
            <Link className="text-white/80 hover:text-marca" to="/login">
              Entrar
            </Link>
          </li>
          <li>
            <Link className="text-white/80 hover:text-marca" to="/cadastro">
              Criar conta
            </Link>
          </li>
        </ul>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-sm text-white/60">© 2026 Resenha ON. FIAP Challenge × JOVI.</p>
    </footer>
  );
}
