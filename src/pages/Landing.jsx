import Contato from "../components/landing/Contato.jsx";
import Equipe from "../components/landing/Equipe.jsx";
import Footer from "../components/landing/Footer.jsx";
import Galeria from "../components/landing/Galeria.jsx";
import Header from "../components/landing/Header.jsx";
import Hero from "../components/landing/Hero.jsx";
import Publico from "../components/landing/Publico.jsx";
import Solucao from "../components/landing/Solucao.jsx";
import useTitulo from "../hooks/useTitulo.js";

export default function Landing() {
  useTitulo("");
  return (
    <>
      <a href="#conteudo" className="sr-only z-50 rounded-lg bg-marca px-4 py-2 font-bold text-tinta focus:not-sr-only focus:absolute focus:left-3 focus:top-3">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Solucao />
        <Publico />
        <Galeria />
        <Equipe />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
