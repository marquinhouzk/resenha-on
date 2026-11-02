import { Celular, TELAS } from "../telas/Telas.jsx";

export default function Galeria() {
  return (
    <section id="galeria" aria-labelledby="galeria-titulo" className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5">
        <div className="grid gap-3 sm:max-w-[60ch]">
          <h2 id="galeria-titulo" className="text-4xl font-extrabold sm:text-5xl">
            As telas do Modo Estudo
          </h2>
          <p className="text-tinta/80">Do visor ao compartilhamento: o caminho de uma captura, em seis telas do protótipo.</p>
        </div>

        {/* Grid container: 1 coluna no celular, 2 no tablet e 3 no desktop */}
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {TELAS.map(({ id, legenda, detalhe, Tela }) => (
            <li key={id}>
              <figure className="grid justify-items-center gap-4">
                <Celular rotulo={`Tela do protótipo: ${legenda}`}>
                  <Tela />
                </Celular>
                <figcaption className="text-center">
                  <b className="block font-display text-lg">{legenda}</b>
                  <span className="text-sm text-grafite">{detalhe}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
