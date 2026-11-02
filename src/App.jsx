import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Carregando from "./components/ui/Carregando.jsx";
import AppLayout from "./components/app/AppLayout.jsx";
import AuthLayout from "./components/app/AuthLayout.jsx";
import { DadosProvider } from "./context/DadosContext.jsx";
import useAuth from "./hooks/useAuth.js";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import NaoEncontrada from "./pages/NaoEncontrada.jsx";
import RotaPrivada from "./routes/RotaPrivada.jsx";
import RotaPublica from "./routes/RotaPublica.jsx";

// As telas da área do aluno só são baixadas quando o aluno entra (code splitting).
const Dashboard = lazy(() => import("./pages/app/Dashboard.jsx"));
const Notas = lazy(() => import("./pages/app/Notas.jsx"));
const NotaDetalhe = lazy(() => import("./pages/app/NotaDetalhe.jsx"));
const NotaForm = lazy(() => import("./pages/app/NotaForm.jsx"));
const Captura = lazy(() => import("./pages/app/Captura.jsx"));
const Comparar = lazy(() => import("./pages/app/Comparar.jsx"));
const Pastas = lazy(() => import("./pages/app/Pastas.jsx"));
const Lixeira = lazy(() => import("./pages/app/Lixeira.jsx"));
const Historico = lazy(() => import("./pages/app/Historico.jsx"));
const Configuracoes = lazy(() => import("./pages/app/Configuracoes.jsx"));

function AreaDoAluno() {
  const { usuario } = useAuth();
  // key: ao trocar de conta, os dados do aluno anterior não vazam para o próximo.
  return (
    <DadosProvider key={usuario.id}>
      <AppLayout />
    </DadosProvider>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Carregando tela />}>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Landing />} />
        <Route element={<RotaPublica />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
          </Route>
        </Route>

        {/* Rotas privadas: exigem sessão ativa */}
        <Route element={<RotaPrivada />}>
          <Route path="/app" element={<AreaDoAluno />}>
            <Route index element={<Dashboard />} />
            <Route path="notas" element={<Notas />} />
            <Route path="notas/nova" element={<NotaForm />} />
            <Route path="notas/:id" element={<NotaDetalhe />} />
            <Route path="notas/:id/editar" element={<NotaForm />} />
            <Route path="capturar" element={<Captura />} />
            <Route path="comparar" element={<Comparar />} />
            <Route path="pastas" element={<Pastas />} />
            <Route path="lixeira" element={<Lixeira />} />
            <Route path="historico" element={<Historico />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>
        </Route>

        <Route path="*" element={<NaoEncontrada />} />
      </Routes>
    </Suspense>
  );
}
