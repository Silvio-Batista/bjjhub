"use client";

import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-[17px] font-semibold">Não foi possível abrir esta tela.</p>
      <p className="text-sm text-muted">Tente de novo. Seus dados neste aparelho continuam salvos.</p>
      <Button className="max-w-xs" onClick={reset}>
        Tentar de novo
      </Button>
    </div>
  );
}
