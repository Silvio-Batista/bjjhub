type Ouvinte = () => void;

const ouvintes = new Map<string, Set<Ouvinte>>();
const cache = new Map<string, { raw: string | null; valor: unknown }>();

function emitir(chave: string) {
  ouvintes.get(chave)?.forEach((ouvinte) => ouvinte());
}

export function inscreverStorage(chave: string, ouvinte: Ouvinte): () => void {
  let conjunto = ouvintes.get(chave);
  if (!conjunto) {
    conjunto = new Set();
    ouvintes.set(chave, conjunto);
  }
  conjunto.add(ouvinte);
  return () => conjunto.delete(ouvinte);
}

export function lerStorage<T>(chave: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(chave);
  const existente = cache.get(chave);
  if (existente && existente.raw === raw) return existente.valor as T | null;

  let valor: T | null = null;
  if (raw) {
    try {
      valor = JSON.parse(raw) as T;
    } catch {
      valor = null;
    }
  }
  cache.set(chave, { raw, valor });
  return valor;
}

export function gravarStorage(chave: string, valor: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = JSON.stringify(valor);
    window.localStorage.setItem(chave, raw);
    cache.set(chave, { raw, valor });
    emitir(chave);
    return true;
  } catch {
    return false;
  }
}

export function removerStorage(chave: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(chave);
  cache.set(chave, { raw: null, valor: null });
  emitir(chave);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (evento) => {
    if (!evento.key) return;
    cache.delete(evento.key);
    emitir(evento.key);
  });
}
