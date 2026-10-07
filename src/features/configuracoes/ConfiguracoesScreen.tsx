"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Interruptor } from "@/components/ui/Interruptor";
import { APP } from "@/constants/app";
import { useAluno } from "@/contexts/aluno-context";
import { useAuth } from "@/contexts/auth-context";
import { usePreferencias } from "@/contexts/preferencias-context";
import { cn } from "@/utils/cn";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Secao = "conta" | "avisos" | "privacidade" | "tema" | "sobre" | null;

export function ConfiguracoesScreen() {
  const { perfil } = useAluno();
  const { sair } = useAuth();
  const { preferencias, atualizar, atualizarNotificacoes, atualizarPrivacidade } =
    usePreferencias();
  const router = useRouter();
  const [aberta, setAberta] = useState<Secao>("conta");
  const [sairAberto, setSairAberto] = useState(false);

  function alternar(secao: Exclude<Secao, null>) {
    setAberta((atual) => (atual === secao ? null : secao));
  }

  return (
    <div>
      <AppHeader titulo="Configurações" voltar />
      <PageBody>
        <section className="overflow-hidden rounded-2xl bg-card">
          <button
            type="button"
            className="flex h-14 w-full items-center justify-between px-4 text-left"
            onClick={() => alternar("conta")}
          >
            Minha conta
            <ChevronRight size={18} className={cn("text-muted", aberta === "conta" && "rotate-90")} />
          </button>
          {aberta === "conta" ? (
            <div className="border-t border-line px-4 py-4">
              <p className="text-sm text-muted">E-mail da matrícula</p>
              <p className="mt-1 text-sm font-medium">{perfil.email}</p>
              <Link href="/perfil/editar" className="mt-3 inline-flex text-sm font-medium">
                Editar perfil
              </Link>
            </div>
          ) : null}

          <button
            type="button"
            className="flex h-14 w-full items-center justify-between border-t border-line px-4 text-left"
            onClick={() => alternar("avisos")}
          >
            Notificações
            <ChevronRight size={18} className={cn("text-muted", aberta === "avisos" && "rotate-90")} />
          </button>
          {aberta === "avisos" ? (
            <div className="flex flex-col gap-4 border-t border-line px-4 py-4">
              {(
                [
                  ["pagamento", "Pagamentos"],
                  ["aula", "Aulas"],
                  ["graduacao", "Graduação"],
                  ["comunicado", "Comunicados"],
                  ["evento", "Eventos"],
                ] as const
              ).map(([chave, rotulo]) => (
                <div key={chave} className="flex items-center justify-between gap-3">
                  <span className="text-sm">{rotulo}</span>
                  <Interruptor
                    rotulo={rotulo}
                    ligado={preferencias.notificacoes[chave]}
                    onChange={(valor) => atualizarNotificacoes(chave, valor)}
                  />
                </div>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            className="flex h-14 w-full items-center justify-between border-t border-line px-4 text-left"
            onClick={() => alternar("privacidade")}
          >
            Privacidade
            <ChevronRight
              size={18}
              className={cn("text-muted", aberta === "privacidade" && "rotate-90")}
            />
          </button>
          {aberta === "privacidade" ? (
            <div className="flex flex-col gap-4 border-t border-line px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">Exibir minha foto na lista de presença</span>
                <Interruptor
                  rotulo="Exibir foto na lista de presença"
                  ligado={preferencias.privacidade.exibirFoto}
                  onChange={(valor) => atualizarPrivacidade("exibirFoto", valor)}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">Compartilhar frequência com os professores</span>
                <Interruptor
                  rotulo="Compartilhar frequência com os professores"
                  ligado={preferencias.privacidade.compartilharFrequencia}
                  onChange={(valor) => atualizarPrivacidade("compartilharFrequencia", valor)}
                />
              </div>
            </div>
          ) : null}

          <button
            type="button"
            className="flex h-14 w-full items-center justify-between border-t border-line px-4 text-left"
            onClick={() => alternar("tema")}
          >
            Tema
            <ChevronRight size={18} className={cn("text-muted", aberta === "tema" && "rotate-90")} />
          </button>
          {aberta === "tema" ? (
            <div className="grid grid-cols-2 gap-3 border-t border-line px-4 py-4">
              {(
                [
                  ["escuro", "Escuro"],
                  ["grafite", "Grafite"],
                ] as const
              ).map(([valor, rotulo]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => atualizar({ tema: valor })}
                  className={cn(
                    "h-11 rounded-xl border text-sm font-medium",
                    preferencias.tema === valor
                      ? "border-primary bg-primary/10 text-ink"
                      : "border-line text-muted",
                  )}
                  aria-pressed={preferencias.tema === valor}
                >
                  {rotulo}
                </button>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            className="flex h-14 w-full items-center justify-between border-t border-line px-4 text-left"
            onClick={() => alternar("sobre")}
          >
            Sobre o aplicativo
            <ChevronRight size={18} className={cn("text-muted", aberta === "sobre" && "rotate-90")} />
          </button>
          {aberta === "sobre" ? (
            <div className="border-t border-line px-4 py-4 text-sm leading-6 text-muted">
              <p className="text-ink">{APP.nome}</p>
              <p>{APP.tagline}</p>
              <p>{APP.conceito}</p>
              <p>Versão {APP.versao} · demonstração do aluno</p>
            </div>
          ) : null}
        </section>

        <Button variante="perigo" onClick={() => setSairAberto(true)}>
          Sair
        </Button>
      </PageBody>

      <ConfirmDialog
        aberto={sairAberto}
        titulo="Sair da conta"
        descricao="A sessão deste aparelho é encerrada. Seus dados salvos continuam no navegador."
        confirmarRotulo="Sair"
        perigo
        onFechar={() => setSairAberto(false)}
        onConfirmar={() => {
          sair();
          router.replace("/login");
        }}
      />
    </div>
  );
}
