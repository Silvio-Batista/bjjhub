"use client";

import { AlunoProvider } from "@/contexts/aluno-context";
import { AuthProvider } from "@/contexts/auth-context";
import { CheckinProvider } from "@/contexts/checkin-context";
import { NotificacoesProvider } from "@/contexts/notificacoes-context";
import { PreferenciasProvider } from "@/contexts/preferencias-context";
import { RelogioProvider } from "@/contexts/relogio-context";
import { ToastProvider } from "@/contexts/toast-context";
import { ToastViewport } from "@/components/ui/Toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <PreferenciasProvider>
          <AlunoProvider>
            <NotificacoesProvider>
              <CheckinProvider>
                <RelogioProvider>
                  <div className="flex h-full min-h-0 flex-col">{children}</div>
                  <ToastViewport />
                </RelogioProvider>
              </CheckinProvider>
            </NotificacoesProvider>
          </AlunoProvider>
        </PreferenciasProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
