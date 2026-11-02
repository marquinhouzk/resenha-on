const VARIANTES = {
  primario: "bg-jovi text-white hover:bg-jovi-escuro",
  marca: "bg-marca text-tinta hover:brightness-95",
  secundario: "border border-linha bg-white text-tinta hover:border-tinta",
  fantasma: "text-tinta hover:bg-tinta/5",
  perigo: "bg-rosa text-white hover:brightness-95",
  escuro: "bg-quadro text-white hover:bg-quadro-claro",
};
const TAMANHOS = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-[0.95rem]",
  lg: "px-6 py-3.5 text-base",
};

/** Botão único do projeto. Use `as={Link}` para navegação. */
export default function Botao({ variante = "primario", tamanho = "md", as: Tag = "button", className = "", ...props }) {
  const extra = Tag === "button" ? { type: props.type ?? "button" } : {};
  return (
    <Tag
      {...extra}
      {...props}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${className}`}
    />
  );
}
