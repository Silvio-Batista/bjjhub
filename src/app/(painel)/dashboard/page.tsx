import { DashboardScreen } from "@/features/dashboard/DashboardScreen";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Início" };

export default function Page() {
  return <DashboardScreen />;
}
