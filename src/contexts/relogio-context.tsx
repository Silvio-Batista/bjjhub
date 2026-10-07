"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const Contexto = createContext<Date | null>(null);

let relogioCliente: Date | null = null;

function lerRelogio(): Date {
  if (!relogioCliente) relogioCliente = new Date();
  return relogioCliente;
}

export function RelogioProvider({ children }: { children: React.ReactNode }) {
  const agora = useSyncExternalStore(inscrever, lerRelogio, () => null);
  return <Contexto.Provider value={agora}>{children}</Contexto.Provider>;
}

function inscrever() {
  return () => {};
}

export function useAgora(): Date | null {
  return useContext(Contexto);
}
