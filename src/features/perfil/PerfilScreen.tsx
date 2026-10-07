"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { Avatar } from "@/components/ui/Avatar";
import { BeltDisplay } from "@/components/ui/BeltDisplay";
import { Card } from "@/components/ui/Card";
import { useAluno } from "@/contexts/aluno-context";
import { academiaService } from "@/services/academia-service";
import { formatarData } from "@/utils/datas";
import { rotuloFaixaGrau } from "@/utils/formatacao";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function PerfilScreen() {
  const { perfil } = useAluno();
  const academia = academiaService.getAcademia();
  const linhas = [
    ["E-mail", perfil.email],
    ["Telefone", perfil.telefone],
    ["Nascimento", formatarData(perfil.nascimento)],
    ["Profissão", perfil.profissao],
    ["Academia", academia.nome],
    ["Matrícula", formatarData(perfil.dataMatricula)],
    ["Faixa", rotuloFaixaGrau(perfil.faixa.nome, perfil.faixa.grau)],
  ];

  return (
    <div>
      <AppHeader titulo="Perfil" voltar />
      <PageBody>
        <div className="flex flex-col items-center pt-2 text-center">
          <Avatar src={perfil.foto} nome={perfil.nome} tamanho={96} />
          <h2 className="mt-3 text-[20px] font-semibold">{perfil.nome}</h2>
          <p className="mt-1 text-sm text-muted">{academia.nome}</p>
          <div className="mt-3 w-40">
            <BeltDisplay nome={perfil.faixa.nome} grau={perfil.faixa.grau} />
          </div>
        </div>

        <Card className="flex flex-col gap-3">
          {linhas.map(([rotulo, valor]) => (
            <div key={rotulo} className="flex items-start justify-between gap-4">
              <span className="text-sm text-muted">{rotulo}</span>
              <span className="text-right text-sm font-medium">{valor}</span>
            </div>
          ))}
        </Card>

        <Link
          href="/perfil/editar"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[15px] font-semibold text-white"
        >
          Editar perfil
        </Link>

        <div className="overflow-hidden rounded-2xl bg-card">
          <Link href="/historico" className="flex h-14 items-center justify-between px-4 text-[15px]">
            Histórico de presença
            <ChevronRight size={18} className="text-muted" />
          </Link>
          <Link
            href="/configuracoes"
            className="flex h-14 items-center justify-between border-t border-line px-4 text-[15px]"
          >
            Configurações
            <ChevronRight size={18} className="text-muted" />
          </Link>
        </div>
      </PageBody>
    </div>
  );
}
