import { AlunosEquipeScreen } from "@/features/equipe/AlunosEquipeScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Alunos" };

export default function Page() {
  return <AlunosEquipeScreen />;
}
