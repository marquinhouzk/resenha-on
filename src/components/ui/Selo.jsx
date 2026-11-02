const TONS = {
  neutro: "bg-tinta/8 text-tinta",
  azul: "bg-ceu text-jovi-escuro",
  marca: "bg-marca text-tinta",
  verde: "bg-verde/12 text-verde",
  rosa: "bg-rosa/12 text-rosa",
};

export default function Selo({ tom = "neutro", children, className = "" }) {
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${TONS[tom]} ${className}`}>{children}</span>;
}
