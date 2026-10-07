import { useSyncExternalStore } from "react";

function inscrever() {
  return () => {};
}

function noCliente() {
  return true;
}

function noServidor() {
  return false;
}

export function useNoCliente(): boolean {
  return useSyncExternalStore(inscrever, noCliente, noServidor);
}
