import { useContext } from "react";
import { ToastContext } from "../context/ToastContext.jsx";

export default function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>.");
  return ctx;
}
