import { useEffect, useId, useRef } from "react";

/** Diálogo acessível usando o elemento nativo <dialog> (foco preso e Esc já vêm de graça). */
export default function Modal({ aberto, aoFechar, titulo, children, rodape }) {
  const ref = useRef(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === ref.current) aoFechar();
      }}
      className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-2xl bg-white p-0 text-tinta shadow-2xl"
    >
      {aberto && (
        <div className="grid gap-4 p-6">
          <h2 id={idTitulo} className="text-xl font-bold">
            {titulo}
          </h2>
          <div className="text-[0.95rem] text-grafite">{children}</div>
          {rodape && <div className="flex flex-wrap justify-end gap-2">{rodape}</div>}
        </div>
      )}
    </dialog>
  );
}
