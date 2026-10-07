import { EditarPerfilScreen } from "@/features/perfil/EditarPerfilScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editar perfil" };

export default function Page() {
  return <EditarPerfilScreen />;
}
