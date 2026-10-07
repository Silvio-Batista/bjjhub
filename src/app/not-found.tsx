import { MolduraAluno } from "@/components/layout/MolduraAluno";
import { EmptyState } from "@/components/ui/EmptyState";
import { CircleAlert } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <MolduraAluno>
      <div className="flex h-full flex-col items-center justify-center px-6">
        <EmptyState icone={CircleAlert} titulo="Esta tela não existe." />
        <Link href="/dashboard" className="text-sm font-medium">
          Voltar ao início
        </Link>
      </div>
    </MolduraAluno>
  );
}
