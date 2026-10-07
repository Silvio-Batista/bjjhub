import { PresencasEquipeScreen } from "@/features/equipe/PresencasEquipeScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Presenças" };

export default function Page() {
  return <PresencasEquipeScreen />;
}
