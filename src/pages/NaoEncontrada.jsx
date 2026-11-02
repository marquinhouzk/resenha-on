import { Link } from "react-router-dom";
import Botao from "../components/ui/Botao.jsx";
import useTitulo from "../hooks/useTitulo.js";

export default function NaoEncontrada() {
  useTitulo("Página não encontrada");
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="grid max-w-md justify-items-start gap-4">
        <p className="font-display text-7xl font-extrabold text-jovi">404</p>
        <h1 className="text-3xl font-extrabold">Essa página não está no caderno.</h1>
        <p className="text-grafite">O endereço pode ter mudado ou nunca ter existido. Volte para o início e continue de lá.</p>
        <Botao as={Link} to="/">
          Voltar ao início
        </Botao>
      </div>
    </main>
  );
}
