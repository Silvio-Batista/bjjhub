import { ConfiguracoesScreen } from "@/features/configuracoes/ConfiguracoesScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Configurações" };

export default function Page() {
  return <ConfiguracoesScreen />;
}
