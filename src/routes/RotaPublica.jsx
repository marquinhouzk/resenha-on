import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

/** Login e cadastro: quem já tem sessão vai direto para a área do aluno. */
export default function RotaPublica() {
  const { autenticado } = useAuth();
  if (autenticado) return <Navigate to="/app" replace />;
  return <Outlet />;
}
