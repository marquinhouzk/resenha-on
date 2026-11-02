import { Link } from "react-router-dom";

/** Marca: visor de câmera (quatro cantos) com um ponto de foco. */
export function Visor({ className = "size-8" }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M4 11V4h7M21 4h7v7M28 21v7h-7M11 28H4v-7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="3.5" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ to = "/", escuro = false }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 font-display text-xl font-extrabold tracking-tight ${escuro ? "text-white" : "text-tinta"}`}>
      <Visor className={`size-7 ${escuro ? "text-marca" : "text-jovi"}`} />
      Resenha ON
    </Link>
  );
}
