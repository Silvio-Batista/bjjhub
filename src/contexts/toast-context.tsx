"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface ToastItem {
  id: number;
  mensagem: string;
}

interface ToastContexto {
  toasts: ToastItem[];
  mostrar: (mensagem: string) => void;
  dispensar: (id: number) => void;
}

const Contexto = createContext<ToastContexto | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dispensar = useCallback((id: number) => {
    setToasts((atual) => atual.filter((item) => item.id !== id));
  }, []);

  const mostrar = useCallback(
    (mensagem: string) => {
      const id = Date.now();
      setToasts((atual) => [...atual.slice(-2), { id, mensagem }]);
      window.setTimeout(() => dispensar(id), 3200);
    },
    [dispensar],
  );

  const valor = useMemo(
    () => ({ toasts, mostrar, dispensar }),
    [toasts, mostrar, dispensar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useToast(): ToastContexto {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useToast fora do provider");
  return contexto;
}
