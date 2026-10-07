"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { PageBody } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCheckins } from "@/contexts/checkin-context";
import { useAgora } from "@/contexts/relogio-context";
import { useIndicadores } from "@/hooks/useIndicadores";
import { academiaService } from "@/services/academia-service";
import { alunoService } from "@/services/aluno-service";
import { aulaService } from "@/services/aula-service";
import { formatarDiaMes } from "@/utils/datas";
import { rotuloProfessor } from "@/utils/formatacao";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const QR = [
  1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1,
  1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1,
];

export function CheckinScreen() {
  const agora = useAgora();
  const { checkins, registrarCheckin, possuiCheckin } = useCheckins();
  const indicadores = useIndicadores(agora);
  const academia = academiaService.getAcademia();
  const [fase, setFase] = useState<"idle" | "validando" | "sucesso">("idle");
  const [erro, setErro] = useState<string | null>(null);
  const [horaRegistrada, setHoraRegistrada] = useState<string | null>(null);
  const [tituloRegistrado, setTituloRegistrado] = useState<string | null>(null);
  const [dataRegistrada, setDataRegistrada] = useState<string | null>(null);
  const [aulaFixaId, setAulaFixaId] = useState<string | null>(null);
  const alvoRef = useRef<string | null>(null);

  const presentes = useMemo(
    () =>
      alunoService
        .getHistorico()
        .filter((item) => item.status === "presente")
        .map((item) => item.aulaId),
    [],
  );

  const sugestao = useMemo(() => {
    if (!agora) return null;
    return aulaService.sugerirCheckin(agora, checkins, presentes);
  }, [agora, checkins, presentes]);

  const aula = useMemo(() => {
    if (!agora) return null;
    if (aulaFixaId) return aulaService.buscar(aulaFixaId, agora);
    return sugestao;
  }, [agora, aulaFixaId, sugestao]);

  useEffect(() => {
    if (fase !== "validando" || !agora) return;
    const aulaId = alvoRef.current;
    if (!aulaId) return;
    const timer = window.setTimeout(() => {
      const encontrada = aulaService.buscar(aulaId, agora);
      if (!encontrada) {
        setErro("Não há aula disponível para esta leitura.");
        setFase("idle");
        return;
      }
      const resultado = registrarCheckin(encontrada);
      if (!resultado.ok) {
        setErro(resultado.erro);
        setFase("idle");
        return;
      }
      setHoraRegistrada(resultado.checkin.hora);
      setTituloRegistrado(encontrada.titulo);
      setDataRegistrada(encontrada.data);
      setErro(null);
      setFase("sucesso");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [fase, agora, registrarCheckin]);

  if (!agora || !indicadores) return null;

  function simular() {
    if (!aula) return;
    if (possuiCheckin(aula.id)) {
      setErro("Você já realizou check-in nesta aula.");
      setFase("idle");
      return;
    }
    alvoRef.current = aula.id;
    setAulaFixaId(aula.id);
    setErro(null);
    setFase("validando");
  }

  return (
    <div>
      <AppHeader titulo="Check-in" mostrarNotificacoes />
      <PageBody>
        <div>
          <h2 className="text-[22px] leading-tight font-semibold">Check-in na academia</h2>
          <p className="mt-1 text-sm text-muted">{academia.nome}</p>
        </div>

        <Card className="flex flex-col items-center py-6">
          <div className="grid w-40 grid-cols-7 gap-1" aria-hidden="true">
            {QR.map((ligado, indice) => (
              <span
                key={indice}
                className={ligado ? "aspect-square bg-ink" : "aspect-square bg-transparent"}
              />
            ))}
          </div>
          <p className="mt-4 text-[12px] tracking-wide text-muted uppercase">Simulação de QR</p>
        </Card>

        {aula ? (
          <Card>
            <p className="text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">
              Aula desta leitura
            </p>
            <p className="mt-2 text-[18px] font-semibold">{aula.titulo}</p>
            <p className="mt-1 text-sm text-muted">
              Hoje · {aula.horarioInicio}–{aula.horarioFim}
            </p>
            <p className="mt-1 text-sm text-muted">
              {rotuloProfessor(aula.tratamento, aula.professor)}
            </p>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-muted">Não há aula na grade de hoje para registrar.</p>
          </Card>
        )}

        {fase === "validando" ? (
          <p className="flex items-center justify-center gap-2 text-sm text-muted" role="status">
            <Loader2 className="animate-spin" size={16} />
            Validando check-in...
          </p>
        ) : null}

        {fase === "sucesso" && tituloRegistrado && dataRegistrada ? (
          <Card className="border border-success/30">
            <p className="text-[16px] font-semibold text-success">
              Check-in realizado com sucesso!
            </p>
            <p className="mt-2 text-sm leading-5 text-muted">
              {tituloRegistrado} · {formatarDiaMes(dataRegistrada)} · {horaRegistrada} ·{" "}
              {academia.nome}
            </p>
            <p className="mt-2 text-sm text-ink">
              Total de aulas: {indicadores.totalAulas}. Na faixa: {indicadores.aulasNaFaixa} de{" "}
              {indicadores.progresso.aulasNecessarias}.
            </p>
            <Link href="/historico" className="mt-3 inline-flex text-sm font-medium">
              Ver histórico
            </Link>
          </Card>
        ) : null}

        {erro ? (
          <p className="text-center text-sm text-primary" role="alert">
            {erro}
          </p>
        ) : null}

        <Button
          onClick={simular}
          disabled={!aula || fase === "validando"}
          className={fase === "validando" ? undefined : "uppercase tracking-wide"}
        >
          {fase === "validando" ? "Validando check-in..." : "Simular leitura do QR Code"}
        </Button>
        <p className="text-center text-[12px] leading-5 text-muted">
          A câmera fica desligada nesta versão. A leitura registra a aula de hoje que ainda
          está sem check-in.
        </p>
      </PageBody>
    </div>
  );
}
