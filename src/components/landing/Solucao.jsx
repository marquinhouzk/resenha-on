import { Link } from "react-router-dom";
import { RECURSOS_WEB } from "../../data/projeto.js";
import Botao from "../ui/Botao.jsx";

const PASSOS = [
  { titulo: "Capturar", texto: "Aponte para o quadro, o slide ou a apostila. O visor mostra a área de leitura e corrige a perspectiva sozinho." },
  { titulo: "Organizar", texto: "O texto reconhecido entra na pasta da disciplina, com data e confiança do reconhecimento." },
  { titulo: "Compartilhar", texto: "Um toque envia a nota para o grupo de estudos ou exporta em .txt, sem sair da câmera." },
];

export default function Solucao() {
  return (
    <section id="solucao" aria-labelledby="solucao-titulo" className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-12">
        <div className="grid content-start gap-5 lg:col-span-5">
          <h2 id="solucao-titulo" className="text-4xl font-extrabold sm:text-5xl">
            O professor apaga o quadro. A sua nota fica.
          </h2>
          <p className="text-tinta/80">
            O desafio da JOVI é tornar a câmera mais intuitiva, funcional e contextual. Hoje, quem estuda em tempo integral usa a câmera só no modo automático: os modos são confusos e nada ajuda a guardar o conteúdo de aula.
          </p>
          <p className="text-tinta/80">
            A Resenha ON resolve isso com um modo de câmera feito para estudar. Ele entende o que está no quadro, devolve texto e põe cada captura onde você vai procurar depois.
          </p>
        </div>

        <ol className="grid gap-4 lg:col-span-7">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="grid grid-cols-[3rem_1fr] items-start gap-4 rounded-2xl border border-linha bg-white p-5">
              <span className="grid size-12 place-items-center rounded-xl bg-quadro font-display text-xl font-extrabold text-marca">{i + 1}</span>
              <div>
                <h3 className="text-xl font-bold">{p.titulo}</h3>
                <p className="mt-1 text-grafite">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 px-5">
        <div className="grid gap-2 sm:max-w-[60ch]">
          <h3 className="text-3xl font-extrabold">Além da câmera: o seu caderno na web</h3>
          <p className="text-grafite">Entre com a conta de teste e use cada recurso de verdade. Os dados ficam salvos no seu navegador.</p>
        </div>

        {/* Grid container de 6 colunas; cada recurso é um grid item com col-span próprio */}
        <ul className="grid gap-4 md:grid-cols-6">
          {RECURSOS_WEB.map((r) => (
            <li key={r.titulo} className={`grid content-start gap-2 rounded-2xl p-6 ${r.destaque ? "bg-quadro text-white md:col-span-3" : "border border-linha bg-white md:col-span-2"}`}>
              <h4 className="text-xl font-bold">{r.titulo}</h4>
              <p className={r.destaque ? "text-white/80" : "text-grafite"}>{r.texto}</p>
            </li>
          ))}
        </ul>
        <div>
          <Botao as={Link} to="/login">
            Abrir meu caderno
          </Botao>
        </div>
      </div>
    </section>
  );
}
