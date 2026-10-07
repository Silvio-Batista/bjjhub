"use client";

import { X } from "lucide-react";
import { useEffect, useId } from "react";

export function MobileModal({
  aberto,
  titulo,
  onFechar,
  children,
}: {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: React.ReactNode;
}) {
  const tituloId = useId();

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[440px] -translate-x-1/2 items-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Fechar"
        onClick={onFechar}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        className="relative z-10 w-full rounded-t-2xl border border-line bg-card px-4 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={tituloId} className="text-[17px] font-semibold">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onFechar}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted"
            aria-label="Fechar janela"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
