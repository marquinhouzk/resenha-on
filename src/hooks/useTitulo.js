import { useEffect } from "react";

export default function useTitulo(titulo) {
  useEffect(() => {
    const anterior = document.title;
    document.title = titulo ? `${titulo} | Resenha ON` : "Resenha ON | Modo Estudo da câmera JOVI";
    return () => {
      document.title = anterior;
    };
  }, [titulo]);
}
