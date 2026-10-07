import { LoginScreen } from "@/features/auth/LoginScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Entrar" };

export default function Page() {
  return <LoginScreen />;
}
