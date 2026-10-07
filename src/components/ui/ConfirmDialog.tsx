"use client";

import { Button } from "@/components/ui/Button";
import { MobileModal } from "@/components/ui/MobileModal";

export function ConfirmDialog({
  aberto,
  titulo,
  descricao,
  confirmarRotulo,
  onConfirmar,
  onFechar,
  perigo = false,
}: {
  aberto: boolean;
  titulo: string;
  descricao: string;
  confirmarRotulo: string;
  onConfirmar: () => void;
  onFechar: () => void;
  perigo?: boolean;
}) {
  return (
    <MobileModal aberto={aberto} titulo={titulo} onFechar={onFechar}>
      <p className="text-sm leading-6 text-muted">{descricao}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variante="secundario" onClick={onFechar}>
          Voltar
        </Button>
        <Button
          variante={perigo ? "perigo" : "primario"}
          onClick={() => {
            onConfirmar();
            onFechar();
          }}
        >
          {confirmarRotulo}
        </Button>
      </div>
    </MobileModal>
  );
}
