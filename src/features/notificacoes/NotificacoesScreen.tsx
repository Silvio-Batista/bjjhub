"use client";

import { NotificationCard } from "@/components/domain/NotificationCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { FILTROS_NOTIFICACAO, type FiltroNotificacao } from "@/constants/app";
import { useNotificacoes } from "@/contexts/notificacoes-context";
import { cn } from "@/utils/cn";
import { parseDataHora } from "@/utils/datas";
import { BellOff } from "lucide-react";
import { useMemo, useState } from "react";

export function NotificacoesScreen() {
  const { notificacoes, marcarLida, arquivar, excluir } = useNotificacoes();
  const [filtro, setFiltro] = useState<FiltroNotificacao>("Todas");
  const [aberta, setAberta] = useState<string | null>(null);
  const [excluirId, setExcluirId] = useState<string | null>(null);

  const lista = useMemo(() => {
    const ordenadas = [...notificacoes].sort(
      (a, b) => parseDataHora(b.criadaEm).getTime() - parseDataHora(a.criadaEm).getTime(),
    );
    if (filtro === "Arquivadas") return ordenadas.filter((item) => item.arquivada);
    const visiveis = ordenadas.filter((item) => !item.arquivada);
    if (filtro === "Não lidas") return visiveis.filter((item) => !item.lida);
    if (filtro === "Lidas") return visiveis.filter((item) => item.lida);
    return visiveis;
  }, [notificacoes, filtro]);

  return (
    <div>
      <AppHeader titulo="Notificações" voltar />
      <PageBody>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {FILTROS_NOTIFICACAO.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFiltro(item)}
              className={cn(
                "h-9 shrink-0 rounded-full px-3 text-[13px] font-medium",
                filtro === item ? "bg-primary text-white" : "bg-card text-muted",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        {lista.length === 0 ? (
          <EmptyState
            icone={BellOff}
            titulo="Nenhuma notificação nesta lista."
            descricao="Quando a academia publicar um aviso, ele aparece aqui."
            ilustracao="/assets/illustrations/empty-geral.svg"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {lista.map((item) => (
              <NotificationCard
                key={item.id}
                notificacao={item}
                aberta={aberta === item.id}
                onAbrir={() => {
                  setAberta((atual) => (atual === item.id ? null : item.id));
                  if (!item.lida) marcarLida(item.id, true);
                }}
                onLida={(lida) => marcarLida(item.id, lida)}
                onArquivar={() => arquivar(item.id, !item.arquivada)}
                onExcluir={() => setExcluirId(item.id)}
              />
            ))}
          </div>
        )}
      </PageBody>

      <ConfirmDialog
        aberto={excluirId !== null}
        titulo="Excluir notificação"
        descricao="Ela sai deste aparelho. A academia não é avisada."
        confirmarRotulo="Excluir"
        perigo
        onFechar={() => setExcluirId(null)}
        onConfirmar={() => {
          if (excluirId) excluir(excluirId);
        }}
      />
    </div>
  );
}
