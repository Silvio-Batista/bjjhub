"use client";

import { AulaDetalheScreen } from "@/features/aulas/AulaDetalheScreen";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) return null;
  return <AulaDetalheScreen id={id} />;
}
