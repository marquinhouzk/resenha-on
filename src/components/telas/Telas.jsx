// Telas ilustrativas do Modo Estudo, desenhadas em JSX para a galeria da landing page.
export function Celular({ rotulo, children }) {
  return (
    <div role="img" aria-label={rotulo} className="mx-auto w-[220px] rounded-[2rem] border-[5px] border-tinta bg-tinta shadow-xl">
      <div aria-hidden="true" className="relative aspect-[9/18] overflow-hidden rounded-[1.5rem] bg-quadro text-[11px] leading-snug text-white">
        {children}
      </div>
    </div>
  );
}

const Cantos = ({ cor = "border-marca" }) => (
  <>
    <span className={`absolute left-0 top-0 size-4 border-l-[3px] border-t-[3px] ${cor}`} />
    <span className={`absolute right-0 top-0 size-4 border-r-[3px] border-t-[3px] ${cor}`} />
    <span className={`absolute bottom-0 left-0 size-4 border-b-[3px] border-l-[3px] ${cor}`} />
    <span className={`absolute bottom-0 right-0 size-4 border-b-[3px] border-r-[3px] ${cor}`} />
  </>
);

export function TelaVisor() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto]">
      <div className="flex items-center justify-between px-4 pt-4 text-white/70">
        <span>Flash</span>
        <span className="rounded bg-marca px-1.5 font-bold text-tinta">Estudo</span>
        <span>1x</span>
      </div>
      <div className="relative mx-4 my-3">
        <Cantos />
        <div className="grid gap-2 p-4 pt-6 text-white/85">
          <p>Context API evita props em muitos níveis.</p>
          <p>Provider envolve a árvore.</p>
          <p>useContext lê o valor.</p>
        </div>
        <span className="absolute inset-x-1 top-[55%] h-0.5 bg-marca/80" />
      </div>
      <div className="grid gap-3 pb-4">
        <div className="flex justify-center gap-4 text-white/60">
          <span>Foto</span>
          <span>Vídeo</span>
          <span className="font-bold text-marca">Estudo</span>
        </div>
        <span className="mx-auto size-11 rounded-full border-4 border-white bg-white/20" />
      </div>
    </div>
  );
}

export function TelaRecorte() {
  return (
    <div className="grid h-full content-center gap-5 p-5">
      <p className="text-center font-semibold text-white/80">Bordas detectadas</p>
      <div className="relative mx-auto h-28 w-full -rotate-6 border-2 border-dashed border-marca bg-quadro-claro p-3">
        <Cantos />
        <p className="text-white/85">Backlog: lista ordenada de tudo que o produto precisa.</p>
      </div>
      <p className="text-center text-white/60">Perspectiva corrigida</p>
      <div className="mx-auto h-16 w-full border border-white/30 bg-white p-3 text-tinta">
        <p>Backlog: lista ordenada de tudo que o produto precisa.</p>
      </div>
    </div>
  );
}

export function TelaTexto() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] bg-papel text-tinta">
      <div className="bg-quadro px-4 py-3 text-white">
        <p className="font-bold">Texto reconhecido</p>
        <p className="text-white/70">96% de confiança</p>
      </div>
      <div className="grid content-start gap-2 p-4">
        <p>
          <mark>useState</mark> guarda um valor e renderiza de novo.
        </p>
        <p>
          <mark>useEffect</mark> roda depois da renderização.
        </p>
        <p>Array vazio: só na montagem.</p>
      </div>
      <div className="flex gap-2 p-3">
        <span className="flex-1 rounded-md bg-jovi py-1.5 text-center font-bold text-white">Salvar</span>
        <span className="flex-1 rounded-md border border-linha bg-white py-1.5 text-center font-bold">Editar</span>
      </div>
    </div>
  );
}

export function TelaPastas() {
  const pastas = [
    ["Web Development", "bg-jovi", 12],
    ["Front-End Design", "bg-rosa", 8],
    ["Computational Thinking", "bg-verde", 5],
    ["Storytelling", "bg-[#e58a00]", 3],
  ];
  return (
    <div className="grid h-full content-start gap-3 bg-papel p-4 text-tinta">
      <p className="pt-2 text-base font-bold">Minhas pastas</p>
      {pastas.map(([nome, cor, qtd]) => (
        <div key={nome} className="flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm">
          <span className={`size-3 rounded-full ${cor}`} />
          <span className="flex-1 font-semibold">{nome}</span>
          <span className="text-grafite">{qtd}</span>
        </div>
      ))}
    </div>
  );
}

export function TelaBusca() {
  return (
    <div className="grid h-full content-start gap-3 bg-papel p-4 text-tinta">
      <div className="mt-2 rounded-lg border border-jovi bg-white px-3 py-2 font-semibold">hooks</div>
      <p className="text-grafite">3 notas encontradas</p>
      {["Hooks do React", "Context API e estado", "Regras dos hooks"].map((t) => (
        <div key={t} className="rounded-lg bg-white p-2.5 shadow-sm">
          <p className="font-bold">{t}</p>
          <p className="text-grafite">
            ...só no topo do componente, nunca dentro de if... <mark>hooks</mark>
          </p>
        </div>
      ))}
    </div>
  );
}

export function TelaCompartilhar() {
  return (
    <div className="grid h-full content-end gap-2 bg-black/40 p-3">
      <div className="grid gap-2 rounded-2xl bg-white p-4 text-tinta">
        <p className="text-base font-bold">Compartilhar nota</p>
        {["Grupo de estudos", "App de anotações", "Exportar em .txt"].map((o) => (
          <div key={o} className="rounded-lg border border-linha px-3 py-2 font-semibold">
            {o}
          </div>
        ))}
        <div className="mt-1 flex items-center justify-between rounded-lg bg-ceu px-3 py-2">
          <span className="font-semibold">Nota privada</span>
          <span className="h-4 w-8 rounded-full bg-jovi p-0.5">
            <span className="ml-auto block size-3 rounded-full bg-white" />
          </span>
        </div>
      </div>
    </div>
  );
}

export const TELAS = [
  { id: "visor", legenda: "Visor do Modo Estudo", detalhe: "A câmera já indica a área de leitura.", Tela: TelaVisor },
  { id: "recorte", legenda: "Recorte automático", detalhe: "Bordas detectadas e perspectiva corrigida.", Tela: TelaRecorte },
  { id: "texto", legenda: "Texto reconhecido", detalhe: "Pronto para copiar, editar e salvar.", Tela: TelaTexto },
  { id: "pastas", legenda: "Pastas por disciplina", detalhe: "Cada captura vai para a matéria certa.", Tela: TelaPastas },
  { id: "busca", legenda: "Busca no histórico", detalhe: "Encontre qualquer palavra das suas notas.", Tela: TelaBusca },
  { id: "compartilhar", legenda: "Compartilhar", detalhe: "Envio em um toque, com controle de privacidade.", Tela: TelaCompartilhar },
];
