import { Outlet } from "react-router-dom";
import Logo, { Visor } from "../ui/Logo.jsx";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden content-between bg-quadro p-10 text-white lg:grid">
        <Logo escuro />
        <div className="relative grid gap-5">
          <Visor className="size-16 text-marca" />
          <p className="max-w-[16ch] font-display text-5xl font-extrabold leading-[1.05]">A aula inteira cabe no seu bolso.</p>
          <p className="max-w-[40ch] text-white/70">Capture, organize e encontre tudo o que viu no quadro, nos slides e nas apostilas.</p>
        </div>
        <p className="text-sm text-white/50">Challenge JOVI × FIAP 2026</p>
      </aside>
      <main className="grid place-items-center px-5 py-12">
        <div className="grid w-full max-w-md gap-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
