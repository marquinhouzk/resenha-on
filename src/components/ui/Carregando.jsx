export default function Carregando({ tela = false, texto = "Carregando..." }) {
  return (
    <div role="status" className={`grid place-items-center gap-3 text-grafite ${tela ? "min-h-screen" : "py-16"}`}>
      <span aria-hidden="true" className="size-9 animate-spin rounded-full border-4 border-linha border-t-jovi" />
      <span className="text-sm font-medium">{texto}</span>
    </div>
  );
}
