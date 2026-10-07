import { NotificacoesScreen } from "@/features/notificacoes/NotificacoesScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notificações" };

export default function Page() {
  return <NotificacoesScreen />;
}
