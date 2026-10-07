import { AlunoEquipeScreen } from "@/features/equipe/AlunoEquipeScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ficha do aluno" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AlunoEquipeScreen alunoId={Number(id)} />;
}
