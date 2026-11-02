const CAMINHOS = {
  inicio: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  notas: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7",
  pastas: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  historico: "M4 5v5h5M5.5 14a7.5 7.5 0 101.8-7.8L4 10M12 8v4l3 2",
  lixeira: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6",
  ajustes: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M16 4v4M10 10v4M18 16v4",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
  sino: "M6 17V11a6 6 0 1112 0v6l2 2H4zM10 21h4",
  estrela: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  mais: "M12 5v14M5 12h14",
  sair: "M10 4H5v16h5M15 8l4 4-4 4M19 12H9",
};

export default function Icone({ nome, className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={CAMINHOS[nome]} />
    </svg>
  );
}
