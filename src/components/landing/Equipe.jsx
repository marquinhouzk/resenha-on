import { EQUIPE } from "../../data/projeto.js";

export default function Equipe() {
  return (
    <section id="equipe" aria-labelledby="equipe-titulo" className="bg-white py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5">
        <div className="grid gap-3 sm:max-w-[60ch]">
          <h2 id="equipe-titulo" className="text-4xl font-extrabold sm:text-5xl">
            Nossa equipe
          </h2>
          <p className="text-tinta/80">Estudantes de Engenharia de Software da FIAP, desenvolvendo a Resenha ON no Challenge JOVI 2026.</p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPE.map((p) => (
            <li key={p.rm}>
              <article className="grid h-full content-start gap-3 rounded-2xl border border-linha bg-papel p-6">
                <span aria-hidden="true" className={`grid size-14 place-items-center rounded-full font-display text-xl font-extrabold ${p.cor}`}>
                  {p.iniciais}
                </span>
                <h3 className="text-xl font-bold">{p.nome}</h3>
                <p className="font-semibold text-jovi-escuro">{p.funcao}</p>
                <p className="text-sm text-grafite">{p.descricao}</p>
                <p className="text-sm font-medium text-tinta/70">RM {p.rm}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
