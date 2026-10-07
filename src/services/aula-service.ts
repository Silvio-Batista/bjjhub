import type { FiltroAula } from "@/constants/app";
import { aulaRepository } from "@/repositories/aula-repository";
import type { Aula, Checkin } from "@/types";
import { formatarIso, minutosDoHorario } from "@/utils/datas";

function comStatus(aula: Aula, referencia: Date): Aula {
  if (aula.status === "cancelada") return aula;
  const hoje = formatarIso(referencia);
  const fim = minutosDoHorario(aula.horarioFim);
  const agora = referencia.getHours() * 60 + referencia.getMinutes();
  if (aula.data < hoje || (aula.data === hoje && fim <= agora)) {
    return { ...aula, status: "encerrada" };
  }
  return { ...aula, status: "agendada" };
}

export const aulaService = {
  listar(referencia: Date): Aula[] {
    return aulaRepository.listar().map((aula) => comStatus(aula, referencia));
  },

  buscar(id: string, referencia: Date): Aula | undefined {
    const aula = aulaRepository.buscar(id);
    if (!aula) return undefined;
    return comStatus(aula, referencia);
  },

  listarPorDia(data: string, filtro: FiltroAula, referencia: Date): Aula[] {
    return this.listar(referencia)
      .filter((aula) => aula.data === data)
      .filter((aula) => filtro === "Todas" || aula.categoria === filtro)
      .sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio));
  },

  listarProximas(referencia: Date, quantidade = 2): Aula[] {
    const hoje = formatarIso(referencia);
    const agora = referencia.getHours() * 60 + referencia.getMinutes();
    return this.listar(referencia)
      .filter((aula) => aula.status !== "cancelada")
      .filter((aula) => {
        if (aula.data > hoje) return true;
        if (aula.data < hoje) return false;
        return minutosDoHorario(aula.horarioFim) > agora;
      })
      .sort((a, b) =>
        `${a.data}${a.horarioInicio}`.localeCompare(`${b.data}${b.horarioInicio}`),
      )
      .slice(0, quantidade);
  },

  sugerirCheckin(referencia: Date, checkins: Checkin[], presentes: string[]): Aula | null {
    const hoje = formatarIso(referencia);
    const doDia = this.listar(referencia)
      .filter((aula) => aula.data === hoje && aula.status !== "cancelada")
      .sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio));

    const semPresenca = doDia.filter(
      (aula) =>
        !checkins.some((item) => item.aulaId === aula.id) &&
        !presentes.includes(aula.id),
    );

    if (semPresenca.length === 0) return doDia.at(-1) ?? null;

    const agora = referencia.getHours() * 60 + referencia.getMinutes();
    const aindaNoHorario = semPresenca.find(
      (aula) => minutosDoHorario(aula.horarioFim) > agora,
    );
    return aindaNoHorario ?? semPresenca[0];
  },
};
