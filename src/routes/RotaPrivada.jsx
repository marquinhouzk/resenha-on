import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

/** Só deixa passar quem está logado; os demais vão para /login e voltam depois. */
export default function RotaPrivada() {
  const { autenticado } = useAuth();
  const local = useLocation();
  if (!autenticado) return <Navigate to="/login" replace state={{ de: local.pathname + local.search }} />;
  return <Outlet />;
}
