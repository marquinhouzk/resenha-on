import { createContext, useCallback, useMemo, useRef, useState } from "react";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [avisos, setAvisos] = useState([]);
  const contador = useRef(0);

  const fechar = useCallback((id) => setAvisos((lista) => lista.filter((a) => a.id !== id)), []);

  const avisar = useCallback(
    (mensagem, { acao, tipo = "ok", duracao = 5000 } = {}) => {
      contador.current += 1;
      const id = contador.current;
      setAvisos((lista) => [...lista.slice(-2), { id, mensagem, acao, tipo }]);
      setTimeout(() => fechar(id), duracao);
    },
    [fechar],
  );

  const valor = useMemo(() => ({ avisar }), [avisar]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 lg:bottom-6">
        {avisos.map((a) => (
          <div
            key={a.id}
            role="status"
            className={`pointer-events-auto flex max-w-md items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
              a.tipo === "erro" ? "bg-rosa text-white" : "bg-quadro text-white"
            }`}
          >
            <span>{a.mensagem}</span>
            {a.acao && (
              <button
                type="button"
                onClick={() => {
                  a.acao.aoClicar();
                  fechar(a.id);
                }}
                className="cursor-pointer rounded-md bg-marca px-2.5 py-1 font-bold text-tinta"
              >
                {a.acao.rotulo}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
