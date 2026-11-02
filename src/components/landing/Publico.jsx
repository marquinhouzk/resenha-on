const PERFIL = [
  ["Rotina", "Entre aula, trabalho e vida social, estão sempre em movimento atrás de progresso e estabilidade."],
  ["Celular", "É a ferramenta que os mantém conectados, produtivos e inspirados ao longo do dia."],
  ["Expressão", "Usam a câmera também para mostrar como enxergam o mundo, mesmo na correria."],
  ["Dor central", "Perdem conteúdo de aula por não ter um jeito rápido de registrar e organizar o que veem."],
];

const ANTES_DEPOIS = [
  ["Tira foto do quadro e ela se perde na galeria.", "A foto vira texto na pasta da disciplina."],
  ["Digita de novo o que já estava na tela.", "Copia, edita e pesquisa o texto reconhecido."],
  ["Na véspera da prova, procura entre centenas de fotos.", "Busca uma palavra e acha a nota na hora."],
];

export default function Publico() {
  return (
    <section id="publico" aria-labelledby="publico-titulo" className="bg-white py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-12">
        <div className="grid content-start gap-6 lg:col-span-6">
          <h2 id="publico-titulo" className="text-4xl font-extrabold sm:text-5xl">
            Feita para quem estuda em tempo integral.
          </h2>
          <p className="text-tinta/80">
            Estudantes full-time conciliam estudos, interações sociais e ambição. O smartphone é a ferramenta para expressar o próprio mundo e também para não deixar a aula escapar.
          </p>
          <dl className="grid gap-4 sm:grid-cols-2">
            {PERFIL.map(([termo, texto]) => (
              <div key={termo} className="rounded-xl border border-linha bg-papel p-4">
                <dt className="font-display text-lg font-bold">{termo}</dt>
                <dd className="mt-1 text-sm text-grafite">{texto}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid content-start gap-4 lg:col-span-6">
          <h3 className="text-2xl font-extrabold">Por que isso importa para eles</h3>
          <div className="grid gap-3">
            {ANTES_DEPOIS.map(([antes, depois]) => (
              <div key={antes} className="grid overflow-hidden rounded-xl border border-linha sm:grid-cols-2">
                <p className="bg-papel p-4 text-grafite">
                  <b className="mb-1 block text-sm text-rosa">Hoje</b>
                  {antes}
                </p>
                <p className="bg-ceu p-4">
                  <b className="mb-1 block text-sm text-jovi-escuro">Com a Resenha ON</b>
                  {depois}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
