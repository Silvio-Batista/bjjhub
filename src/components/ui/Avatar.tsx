"use client";

import { iniciais } from "@/utils/formatacao";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { useState } from "react";

export function Avatar({
  src,
  nome,
  tamanho = 48,
}: {
  src?: string;
  nome: string;
  tamanho?: number;
}) {
  const [falhou, setFalhou] = useState(false);
  const classe = "h-full w-full object-cover";

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-card-secondary",
      )}
      style={{ width: tamanho, height: tamanho }}
    >
      {!src || falhou ? (
        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted">
          {iniciais(nome)}
        </span>
      ) : src.startsWith("data:") ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className={classe} />
      ) : (
        <Image
          src={src}
          alt=""
          fill
          sizes={`${tamanho}px`}
          className={classe}
          onError={() => setFalhou(true)}
        />
      )}
    </span>
  );
}
