import { GraduacaoScreen } from "@/features/graduacao/GraduacaoScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Graduação" };

export default function Page() {
  return <GraduacaoScreen />;
}
