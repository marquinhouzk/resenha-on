import { Link } from "react-router-dom";
import Botao from "../ui/Botao.jsx";
import VisorDemo from "./VisorDemo.jsx";

export default function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="bg-ceu/60">
      {/* Grid container: 12 colunas no desktop; texto e demo são grid items */}
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-12 lg:py-20">
        <div className="grid gap-6 lg:col-span-6">
          <p className="w-fit rounded-md bg-quadro px-3 py-1 text-sm font-semibold text-white">Desafio JOVI × FIAP 2026</p>
          <h1 id="hero-titulo" className="text-[2.6rem] font-extrabold sm:text-6xl">
            Fotografou o quadro. Já está no seu caderno.
          </h1>
          <p className="max-w-[52ch] text-lg text-tinta/80">
            O Modo Estudo da câmera JOVI lê quadros, slides e apostilas, transforma em texto e guarda na pasta da disciplina certa. Sem app extra e sem digitar nada.
          </p>
          <div className="flex flex-wrap gap-3">
            <Botao as={Link} to="/login" tamanho="lg">
              Entrar com a conta de teste
            </Botao>
            <Botao as="a" href="#solucao" variante="secundario" tamanho="lg">
              Como funciona
            </Botao>
          </div>
          <p className="text-sm text-grafite">Ao lado, a câmera de verdade: toque no botão branco para capturar.</p>
        </div>

        <div className="lg:col-span-6">
          <VisorDemo />
        </div>
      </div>
    </section>
  );
}
