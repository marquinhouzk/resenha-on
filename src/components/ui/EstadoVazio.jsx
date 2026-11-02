export default function EstadoVazio({ titulo, texto, children }) {
  return (
    <div className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-grafite/40 bg-white px-6 py-12 text-center">
      <h3 className="text-xl font-bold">{titulo}</h3>
      {texto && <p className="max-w-[48ch] text-grafite">{texto}</p>}
      {children && <div className="mt-2 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
