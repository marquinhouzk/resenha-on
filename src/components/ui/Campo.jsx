/** Campo de formulário com rótulo, ajuda e erro ligados por aria. O id deve ser `campo-<name>`. */
export default function Campo({ id, rotulo, erro, ajuda, elemento: El = "input", className = "", children, ...props }) {
  const idAjuda = `${id}-ajuda`;
  const idErro = `${id}-erro`;
  const descricao = [ajuda && !erro ? idAjuda : null, erro ? idErro : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <El
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricao}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-[0.95rem] placeholder:text-grafite/60 ${
          erro ? "border-rosa" : "border-linha hover:border-grafite/50"
        } ${className}`}
        {...props}
      >
        {children}
      </El>
      {ajuda && !erro && (
        <p id={idAjuda} className="text-sm text-grafite">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={idErro} role="alert" className="text-sm font-medium text-rosa">
          {erro}
        </p>
      )}
    </div>
  );
}
