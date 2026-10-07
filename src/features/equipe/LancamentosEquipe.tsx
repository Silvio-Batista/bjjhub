"use client";

import { calcularValorMensalidade, grauMaximo } from "@/domain/equipe/ajustes";
import { equipeService } from "@/services/equipe-service";
import type {
  DescontoMensalidade,
  FaixaNome,
  FichaAluno,
  MetodoPagamento,
  StatusPresenca,
} from "@/types";
import { formatarCompetencia, formatarData, formatarIso } from "@/utils/datas";
import { formatarMoeda, rotuloGrau } from "@/utils/formatacao";
import { ORDEM_FAIXAS } from "@/constants/app";
import { useState } from "react";

const CAMPO =
  "h-11 w-full rounded-xl border border-line bg-bg px-3 text-sm text-ink outline-none focus:border-primary";

function Aviso({ erro, ok }: { erro: string | null; ok: string | null }) {
  if (erro) {
    return (
      <p className="text-sm text-primary" role="alert">
        {erro}
      </p>
    );
  }
  if (ok) return <p className="text-sm text-success">{ok}</p>;
  return null;
}

function Bloco({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5">
      <h2 className="text-sm font-semibold">{titulo}</h2>
      <p className="mt-1 text-sm text-muted">{descricao}</p>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

export function LancamentosEquipe({ ficha, agora }: { ficha: FichaAluno; agora: Date }) {
  return (
    <div className="mt-8 grid gap-4 xl:grid-cols-2">
      <MensalidadeForm key={`m-${ficha.aluno.id}`} ficha={ficha} />
      <GraduacaoForm key={`g-${ficha.aluno.id}`} ficha={ficha} hoje={formatarIso(agora)} />
      <PresencaForm key={`p-${ficha.aluno.id}`} ficha={ficha} agora={agora} />
      <PagamentoForm
        key={`pg-${ficha.aluno.id}-${ficha.valorMensalidade.liquido}`}
        ficha={ficha}
        hoje={formatarIso(agora)}
      />
    </div>
  );
}

function MensalidadeForm({ ficha }: { ficha: FichaAluno }) {
  const [valorBase, setValorBase] = useState(String(ficha.contrato.valorBase));
  const [tipo, setTipo] = useState<DescontoMensalidade["tipo"]>(ficha.contrato.desconto.tipo);
  const [desconto, setDesconto] = useState(
    ficha.contrato.desconto.tipo === "nenhum" ? "" : String(ficha.contrato.desconto.valor),
  );
  const [taxa, setTaxa] = useState(String(ficha.contrato.taxaGraduacao));
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const descontoAtual: DescontoMensalidade = {
    tipo,
    valor: tipo === "nenhum" ? 0 : Number(desconto),
  };
  const calculado = calcularValorMensalidade(Number(valorBase), descontoAtual);

  function salvar(evento: React.FormEvent) {
    evento.preventDefault();
    const resultado = equipeService.definirMensalidade({
      alunoId: ficha.aluno.id,
      valorBase: Number(valorBase),
      desconto: descontoAtual,
      taxaGraduacao: Number(taxa),
    });
    if (!resultado.ok) {
      setErro(resultado.erro);
      setOk(null);
      return;
    }
    setErro(null);
    setOk("Mensalidade atualizada. O financeiro do aluno usa este valor.");
  }

  return (
    <Bloco
      titulo="Mensalidade"
      descricao="Valor mensal, desconto e taxa de graduação. Nada é cobrado."
    >
      <form onSubmit={salvar} className="flex flex-col gap-3">
        <label className="text-[13px] text-muted">
          Valor base
          <input
            className={`${CAMPO} mt-1.5`}
            inputMode="decimal"
            value={valorBase}
            onChange={(evento) => setValorBase(evento.target.value)}
          />
        </label>
        <label className="text-[13px] text-muted">
          Desconto
          <select
            className={`${CAMPO} mt-1.5`}
            value={tipo}
            onChange={(evento) => setTipo(evento.target.value as DescontoMensalidade["tipo"])}
          >
            <option value="nenhum">Sem desconto</option>
            <option value="percentual">Percentual</option>
            <option value="fixo">Valor fixo</option>
          </select>
        </label>
        {tipo === "nenhum" ? null : (
          <label className="text-[13px] text-muted">
            {tipo === "percentual" ? "Percentual do desconto" : "Desconto em reais"}
            <input
              className={`${CAMPO} mt-1.5`}
              inputMode="decimal"
              value={desconto}
              onChange={(evento) => setDesconto(evento.target.value)}
            />
          </label>
        )}
        <label className="text-[13px] text-muted">
          Taxa de graduação
          <input
            className={`${CAMPO} mt-1.5`}
            inputMode="decimal"
            value={taxa}
            onChange={(evento) => setTaxa(evento.target.value)}
          />
        </label>
        <p className="text-sm">
          Mensalidade calculada:{" "}
          <span className="font-semibold tabular-nums">{formatarMoeda(calculado.liquido)}</span>
          {calculado.descontoAplicado > 0
            ? ` · desconto de ${formatarMoeda(calculado.descontoAplicado)}`
            : ""}
        </p>
        <p className="text-xs text-muted">
          Taxa de graduação {formatarMoeda(Number(taxa) || 0)}, só informativa.
        </p>
        <Aviso erro={erro} ok={ok} />
        <button type="submit" className="h-11 rounded-xl bg-primary text-sm font-semibold text-white">
          Guardar mensalidade
        </button>
      </form>
    </Bloco>
  );
}

function GraduacaoForm({ ficha, hoje }: { ficha: FichaAluno; hoje: string }) {
  const [faixa, setFaixa] = useState<FaixaNome>(ficha.aluno.faixa.nome);
  const [grau, setGrau] = useState(String(ficha.aluno.faixa.grau));
  const [data, setData] = useState(hoje);
  const [nota, setNota] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const maximo = grauMaximo(faixa);

  function salvar(evento: React.FormEvent) {
    evento.preventDefault();
    const resultado = equipeService.registrarGraduacao({
      alunoId: ficha.aluno.id,
      faixa,
      grau: Number(grau),
      data,
      nota,
    });
    if (!resultado.ok) {
      setErro(resultado.erro);
      setOk(null);
      return;
    }
    setErro(null);
    setNota("");
    setOk("Graduação registrada. A faixa e a linha do tempo foram atualizadas.");
  }

  return (
    <Bloco
      titulo="Graduação"
      descricao="O sensei decide a faixa ou o grau. Os requisitos não promovem sozinhos."
    >
      <form onSubmit={salvar} className="flex flex-col gap-3">
        <label className="text-[13px] text-muted">
          Faixa
          <select
            className={`${CAMPO} mt-1.5`}
            value={faixa}
            onChange={(evento) => {
              const proxima = evento.target.value as FaixaNome;
              setFaixa(proxima);
              if (Number(grau) > grauMaximo(proxima)) setGrau("0");
            }}
          >
            {ORDEM_FAIXAS.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[13px] text-muted">
          Grau
          <select className={`${CAMPO} mt-1.5`} value={grau} onChange={(evento) => setGrau(evento.target.value)}>
            {Array.from({ length: maximo + 1 }, (_, indice) => (
              <option key={indice} value={indice}>
                {rotuloGrau(indice)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[13px] text-muted">
          Data
          <input
            className={`${CAMPO} mt-1.5`}
            type="date"
            value={data}
            onChange={(evento) => setData(evento.target.value)}
          />
        </label>
        <label className="text-[13px] text-muted">
          Nota
          <textarea
            className="mt-1.5 min-h-20 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-primary"
            value={nota}
            maxLength={160}
            onChange={(evento) => setNota(evento.target.value)}
          />
        </label>
        <Aviso erro={erro} ok={ok} />
        <button type="submit" className="h-11 rounded-xl bg-primary text-sm font-semibold text-white">
          Registrar graduação
        </button>
      </form>
      {ficha.promocoes.length === 0 ? (
        <p className="text-xs text-muted">Nenhuma graduação lançada pela equipe ainda.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ficha.promocoes
            .slice()
            .sort((a, b) => b.data.localeCompare(a.data))
            .map((item) => (
              <li key={item.id} className="text-sm">
                <span className="font-medium">
                  {item.faixa} · {rotuloGrau(item.grau)}
                </span>
                <span className="text-muted">
                  {" "}
                  · {formatarData(item.data)} · {item.nota}
                </span>
              </li>
            ))}
        </ul>
      )}
    </Bloco>
  );
}

function PresencaForm({ ficha, agora }: { ficha: FichaAluno; agora: Date }) {
  const aulas = equipeService.aulasRecentes(agora);
  const [aulaId, setAulaId] = useState(aulas[0]?.id ?? "");
  const [status, setStatus] = useState<StatusPresenca>("presente");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function salvar(evento: React.FormEvent) {
    evento.preventDefault();
    const resultado = equipeService.registrarPresenca({
      alunoId: ficha.aluno.id,
      aulaId,
      status,
      referencia: agora,
    });
    if (!resultado.ok) {
      setErro(resultado.erro);
      setOk(null);
      return;
    }
    setErro(null);
    setOk("Frequência lançada. O histórico e a porcentagem deste aluno foram atualizados.");
  }

  return (
    <Bloco titulo="Frequência" descricao="Marque presença, falta ou justificativa em uma aula recente.">
      {aulas.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma aula recente para lançar.</p>
      ) : (
        <form onSubmit={salvar} className="flex flex-col gap-3">
          <label className="text-[13px] text-muted">
            Aula
            <select className={`${CAMPO} mt-1.5`} value={aulaId} onChange={(evento) => setAulaId(evento.target.value)}>
              {aulas.map((aula) => (
                <option key={aula.id} value={aula.id}>
                  {formatarData(aula.data)} · {aula.titulo} · {aula.horarioInicio}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[13px] text-muted">
            Situação
            <select
              className={`${CAMPO} mt-1.5`}
              value={status}
              onChange={(evento) => setStatus(evento.target.value as StatusPresenca)}
            >
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
              <option value="justificado">Justificado</option>
            </select>
          </label>
          <Aviso erro={erro} ok={ok} />
          <button type="submit" className="h-11 rounded-xl bg-primary text-sm font-semibold text-white">
            Lançar frequência
          </button>
        </form>
      )}
    </Bloco>
  );
}

function PagamentoForm({ ficha, hoje }: { ficha: FichaAluno; hoje: string }) {
  const meses = ficha.mensalidades;
  const [competencia, setCompetencia] = useState(meses[0]?.competencia ?? "");
  const [valor, setValor] = useState(String(ficha.valorMensalidade.liquido));
  const [metodo, setMetodo] = useState<MetodoPagamento>("Pix");
  const [data, setData] = useState(hoje);
  const [nota, setNota] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function registrar(evento: React.FormEvent) {
    evento.preventDefault();
    const resultado = equipeService.registrarPagamento({
      alunoId: ficha.aluno.id,
      competencia,
      valor: Number(valor),
      metodo,
      data,
      nota,
    });
    if (!resultado.ok) {
      setErro(resultado.erro);
      setOk(null);
      return;
    }
    setErro(null);
    setOk("Pagamento registrado. A competência ficou como paga. Nada foi cobrado.");
  }

  function reabrir() {
    const resultado = equipeService.reabrirMensalidade({ alunoId: ficha.aluno.id, competencia });
    if (!resultado.ok) {
      setErro(resultado.erro);
      setOk(null);
      return;
    }
    setErro(null);
    setOk("Pagamento desfeito. A situação volta a ser calculada pelo vencimento.");
  }

  return (
    <Bloco
      titulo="Pagamento"
      descricao="Lançamento informativo do mês. Pix, dinheiro ou cartão, sem gateway."
    >
      {meses.length === 0 ? (
        <p className="text-sm text-muted">Este aluno não tem competência lançada.</p>
      ) : (
        <form onSubmit={registrar} className="flex flex-col gap-3">
          <label className="text-[13px] text-muted">
            Mês
            <select
              className={`${CAMPO} mt-1.5`}
              value={competencia}
              onChange={(evento) => setCompetencia(evento.target.value)}
            >
              {meses.map((item) => (
                <option key={item.id} value={item.competencia}>
                  {formatarCompetencia(item.competencia)} · {formatarMoeda(item.valor)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[13px] text-muted">
            Valor
            <input
              className={`${CAMPO} mt-1.5`}
              inputMode="decimal"
              value={valor}
              onChange={(evento) => setValor(evento.target.value)}
            />
          </label>
          <label className="text-[13px] text-muted">
            Forma
            <select
              className={`${CAMPO} mt-1.5`}
              value={metodo}
              onChange={(evento) => setMetodo(evento.target.value as MetodoPagamento)}
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
            </select>
          </label>
          <label className="text-[13px] text-muted">
            Data
            <input
              className={`${CAMPO} mt-1.5`}
              type="date"
              value={data}
              onChange={(evento) => setData(evento.target.value)}
            />
          </label>
          <label className="text-[13px] text-muted">
            Nota
            <input
              className={`${CAMPO} mt-1.5`}
              value={nota}
              maxLength={160}
              onChange={(evento) => setNota(evento.target.value)}
            />
          </label>
          <Aviso erro={erro} ok={ok} />
          <button type="submit" className="h-11 rounded-xl bg-primary text-sm font-semibold text-white">
            Registrar pagamento
          </button>
          <button type="button" onClick={reabrir} className="h-11 rounded-xl border border-line text-sm text-muted">
            Desfazer pagamento do mês
          </button>
        </form>
      )}
    </Bloco>
  );
}
