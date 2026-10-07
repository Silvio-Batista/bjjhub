"use client";

import { useToast } from "@/contexts/toast-context";

export function ToastViewport() {
  const { toasts, dispensar } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-[408px] -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dispensar(toast.id)}
          className="pointer-events-auto rounded-xl border border-line bg-card-secondary px-4 py-3 text-left text-sm leading-5 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        >
          {toast.mensagem}
        </button>
      ))}
    </div>
  );
}
