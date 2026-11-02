import { useCallback, useState } from "react";

/**
 * Controla campos, erros e envio de um formulário.
 * `validar(valores)` devolve um objeto { campo: "mensagem" } (vazio = válido).
 * Os campos precisam de `name` e de um `id` no formato `campo-<name>`.
 */
export default function useFormulario(valoresIniciais, validar) {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState({});
  const [tocados, setTocados] = useState({});

  const alterar = useCallback(
    (e) => {
      const { name, type, value, checked } = e.target;
      const proximos = { ...valores, [name]: type === "checkbox" ? checked : value };
      setValores(proximos);
      if (tocados[name]) setErros(validar(proximos));
    },
    [valores, tocados, validar],
  );

  const sair = useCallback(
    (e) => {
      setTocados((t) => ({ ...t, [e.target.name]: true }));
      setErros(validar(valores));
    },
    [valores, validar],
  );

  const definir = useCallback((campo, valor) => setValores((v) => ({ ...v, [campo]: valor })), []);

  const redefinir = useCallback(() => {
    setValores(valoresIniciais);
    setErros({});
    setTocados({});
  }, [valoresIniciais]);

  const enviar = useCallback(
    (aoValidar) => async (e) => {
      e.preventDefault();
      const encontrados = validar(valores);
      setErros(encontrados);
      setTocados(Object.fromEntries(Object.keys(valores).map((k) => [k, true])));
      const primeiro = Object.keys(encontrados)[0];
      if (primeiro) {
        document.getElementById(`campo-${primeiro}`)?.focus();
        return;
      }
      await aoValidar(valores);
    },
    [valores, validar],
  );

  const erroDe = (campo) => (tocados[campo] ? erros[campo] : undefined);
  return { valores, erroDe, alterar, sair, definir, redefinir, enviar };
}
