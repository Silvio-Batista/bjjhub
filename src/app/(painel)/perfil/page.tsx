import { PerfilScreen } from "@/features/perfil/PerfilScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Perfil" };

export default function Page() {
  return <PerfilScreen />;
}
