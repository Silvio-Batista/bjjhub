import { FinanceiroScreen } from "@/features/financeiro/FinanceiroScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Financeiro" };

export default function Page() {
  return <FinanceiroScreen />;
}
