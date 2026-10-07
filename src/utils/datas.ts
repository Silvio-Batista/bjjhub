import { differenceInCalendarDays, differenceInMonths } from "date-fns";

export const MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

export const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

export function parseData(iso: string): Date {
  const [ano, mes, dia] = iso.slice(0, 10).split("-").map(Number);
  return new Date(ano, (mes ?? 1) - 1, dia ?? 1);
}

export function parseDataHora(iso: string): Date {
  const [data, hora = "00:00"] = iso.split("T");
  const [ano, mes, dia] = data.split("-").map(Number);
  const [hh, mm] = hora.split(":").map(Number);
  return new Date(ano, (mes ?? 1) - 1, dia ?? 1, hh ?? 0, mm ?? 0, 0, 0);
}

export function inicioDoDia(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export function formatarIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export function formatarHora(data: Date): string {
  return `${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;
}

export function isoLocal(data: Date): string {
  return `${formatarIso(data)}T${formatarHora(data)}:00`;
}

export function formatarData(iso: string): string {
  const data = parseData(iso);
  return `${String(data.getDate()).padStart(2, "0")} ${MESES[data.getMonth()]} ${data.getFullYear()}`;
}

export function formatarDiaMes(iso: string): string {
  const data = parseData(iso);
  return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}`;
}

export function formatarCompetencia(competencia: string): string {
  const [ano, mes] = competencia.split("-").map(Number);
  return `${MESES[(mes ?? 1) - 1]} ${ano}`;
}

export function formatarDataHoraCurta(iso: string): string {
  const data = parseDataHora(iso);
  return `${String(data.getDate()).padStart(2, "0")} ${MESES[data.getMonth()]} · ${formatarHora(data)}`;
}

export function rotuloDiaRelativo(iso: string, referencia: Date): string {
  const hoje = formatarIso(referencia);
  const amanhaData = new Date(inicioDoDia(referencia));
  amanhaData.setDate(amanhaData.getDate() + 1);
  if (iso === hoje) return "Hoje";
  if (iso === formatarIso(amanhaData)) return "Amanhã";
  const data = parseData(iso);
  return `${DIAS_CURTOS[data.getDay()]}, ${formatarDiaMes(iso)}`;
}

export function descreverTempo(dataIso: string, referencia: Date): string {
  const inicio = parseData(dataIso);
  const meses = differenceInMonths(inicioDoDia(referencia), inicio);
  if (meses <= 0) {
    const dias = Math.max(0, differenceInCalendarDays(inicioDoDia(referencia), inicio));
    if (dias <= 1) return "1 dia";
    return `${dias} dias`;
  }
  if (meses < 12) return meses === 1 ? "1 mês" : `${meses} meses`;
  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  const parteAno = anos === 1 ? "1 ano" : `${anos} anos`;
  if (resto === 0) return parteAno;
  const parteMes = resto === 1 ? "1 mês" : `${resto} meses`;
  return `${parteAno} e ${parteMes}`;
}

export function minutosDoHorario(horario: string): number {
  const [hora, minuto] = horario.split(":").map(Number);
  return (hora ?? 0) * 60 + (minuto ?? 0);
}

export function competenciaDe(iso: string): string {
  return iso.slice(0, 7);
}

export function adicionarDias(data: Date, dias: number): Date {
  const copia = inicioDoDia(data);
  copia.setDate(copia.getDate() + dias);
  return copia;
}

export function inicioDaSemana(data: Date): Date {
  const dia = inicioDoDia(data);
  const deslocamento = (dia.getDay() + 6) % 7;
  dia.setDate(dia.getDate() - deslocamento);
  return dia;
}

export function formatarIntervaloSemana(inicio: Date): string {
  const fim = adicionarDias(inicio, 6);
  if (inicio.getMonth() === fim.getMonth()) {
    return `${inicio.getDate()}–${fim.getDate()} ${MESES[fim.getMonth()]}`;
  }
  return `${inicio.getDate()} ${MESES[inicio.getMonth()]} – ${fim.getDate()} ${MESES[fim.getMonth()]}`;
}
