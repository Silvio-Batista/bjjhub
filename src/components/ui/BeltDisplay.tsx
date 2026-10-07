import { CORES_FAIXA } from "@/constants/app";
import type { FaixaNome } from "@/types";
import { cn } from "@/utils/cn";
import { rotuloGrau } from "@/utils/formatacao";

export function BeltDisplay({
  nome,
  grau,
  tamanho = "md",
}: {
  nome: FaixaNome;
  grau: number;
  tamanho?: "sm" | "md" | "lg";
}) {
  const altura = tamanho === "sm" ? "h-3" : tamanho === "lg" ? "h-8" : "h-5";
  const ponta = nome === "Preta" ? "#E31B2B" : "#16181D";
  const listras = Math.max(0, Math.min(nome === "Preta" ? 6 : 4, grau));
  const listraNaPonta = nome !== "Branca";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]",
        altura,
      )}
      role="img"
      aria-label={`Faixa ${nome}, ${rotuloGrau(grau)}`}
    >
      <div className="absolute inset-0" style={{ backgroundColor: CORES_FAIXA[nome] }} />
      <div className="absolute inset-y-0 right-0 w-[18%]" style={{ backgroundColor: ponta }} />
      <div
        className={cn(
          "absolute inset-y-[18%] flex items-center justify-center gap-[3px]",
          listraNaPonta ? "right-[1.5%] w-[15%]" : "right-[19%] w-[14%]",
        )}
      >
        {Array.from({ length: listras }, (_, indice) => (
          <span
            key={indice}
            className="h-full w-[3px] rounded-[1px]"
            style={{ backgroundColor: listraNaPonta ? "#FFFFFF" : "#16181D" }}
          />
        ))}
      </div>
    </div>
  );
}
