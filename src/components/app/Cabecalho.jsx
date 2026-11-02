export default function Cabecalho({ titulo, descricao, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="text-4xl font-extrabold">{titulo}</h1>
        {descricao && <p className="max-w-[60ch] text-grafite">{descricao}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
