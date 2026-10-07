import type { Aula, CategoriaAula } from "@/types";
import { slug } from "@/utils/formatacao";
import { adicionarDias, formatarIso, parseData } from "@/utils/datas";

interface ModeloAula {
  titulo: string;
  categoria: CategoriaAula;
  professor: string;
  professorId: number;
  tratamento: "Professor" | "Professora";
  inicio: string;
  fim: string;
  limite: number;
  inscritos: number;
}

const SEMANA: Record<number, ModeloAula[]> = {
  0: [
    {
      titulo: "Open Mat",
      categoria: "Open Mat",
      professor: "Carlos Silva",
      professorId: 1,
      tratamento: "Professor",
      inicio: "10:00",
      fim: "11:30",
      limite: 40,
      inscritos: 22,
    },
  ],
  1: [
    {
      titulo: "Open Mat",
      categoria: "Open Mat",
      professor: "João Souza",
      professorId: 2,
      tratamento: "Professor",
      inicio: "10:00",
      fim: "11:30",
      limite: 40,
      inscritos: 16,
    },
    {
      titulo: "Jiu-Jitsu Adulto",
      categoria: "Jiu-Jitsu Adulto",
      professor: "Carlos Silva",
      professorId: 1,
      tratamento: "Professor",
      inicio: "19:30",
      fim: "21:00",
      limite: 32,
      inscritos: 27,
    },
  ],
  2: [
    {
      titulo: "Fundamentos",
      categoria: "Fundamentos",
      professor: "João Souza",
      professorId: 2,
      tratamento: "Professor",
      inicio: "07:00",
      fim: "08:00",
      limite: 24,
      inscritos: 11,
    },
    {
      titulo: "No-Gi",
      categoria: "No-Gi",
      professor: "Ana Ribeiro",
      professorId: 3,
      tratamento: "Professora",
      inicio: "20:00",
      fim: "21:15",
      limite: 28,
      inscritos: 19,
    },
  ],
  3: [
    {
      titulo: "No-Gi",
      categoria: "No-Gi",
      professor: "Ana Ribeiro",
      professorId: 3,
      tratamento: "Professora",
      inicio: "09:00",
      fim: "10:15",
      limite: 26,
      inscritos: 14,
    },
    {
      titulo: "Jiu-Jitsu Adulto",
      categoria: "Jiu-Jitsu Adulto",
      professor: "Carlos Silva",
      professorId: 1,
      tratamento: "Professor",
      inicio: "19:00",
      fim: "20:30",
      limite: 32,
      inscritos: 29,
    },
  ],
  4: [
    {
      titulo: "Fundamentos",
      categoria: "Fundamentos",
      professor: "João Souza",
      professorId: 2,
      tratamento: "Professor",
      inicio: "18:00",
      fim: "19:00",
      limite: 30,
      inscritos: 21,
    },
    {
      titulo: "Jiu-Jitsu Adulto",
      categoria: "Jiu-Jitsu Adulto",
      professor: "Carlos Silva",
      professorId: 1,
      tratamento: "Professor",
      inicio: "19:15",
      fim: "20:45",
      limite: 32,
      inscritos: 24,
    },
  ],
  5: [
    {
      titulo: "No-Gi",
      categoria: "No-Gi",
      professor: "Pedro Lima",
      professorId: 4,
      tratamento: "Professor",
      inicio: "12:00",
      fim: "13:00",
      limite: 24,
      inscritos: 9,
    },
    {
      titulo: "Jiu-Jitsu Adulto",
      categoria: "Jiu-Jitsu Adulto",
      professor: "Pedro Lima",
      professorId: 4,
      tratamento: "Professor",
      inicio: "19:00",
      fim: "20:30",
      limite: 32,
      inscritos: 26,
    },
  ],
  6: [
    {
      titulo: "Fundamentos",
      categoria: "Fundamentos",
      professor: "João Souza",
      professorId: 2,
      tratamento: "Professor",
      inicio: "09:00",
      fim: "10:00",
      limite: 24,
      inscritos: 15,
    },
    {
      titulo: "Jiu-Jitsu Adulto",
      categoria: "Jiu-Jitsu Adulto",
      professor: "Carlos Silva",
      professorId: 1,
      tratamento: "Professor",
      inicio: "19:00",
      fim: "20:30",
      limite: 32,
      inscritos: 18,
    },
  ],
};

function diasEntre(inicio: string, fim: string): string[] {
  const datas: string[] = [];
  let cursor = parseData(inicio);
  const limite = parseData(fim);
  while (cursor.getTime() <= limite.getTime()) {
    datas.push(formatarIso(cursor));
    cursor = adicionarDias(cursor, 1);
  }
  return datas;
}

function criarAulas(): Aula[] {
  const aulas: Aula[] = [];
  for (const data of diasEntre("2026-09-28", "2026-10-25")) {
    const dia = parseData(data).getDay();
    const feriado = data === "2026-10-16";
    for (const modelo of SEMANA[dia] ?? []) {
      aulas.push({
        id: `${data}-${slug(modelo.titulo)}`,
        titulo: modelo.titulo,
        categoria: modelo.categoria,
        professor: modelo.professor,
        professorId: modelo.professorId,
        tratamento: modelo.tratamento,
        data,
        horarioInicio: modelo.inicio,
        horarioFim: modelo.fim,
        limiteAlunos: modelo.limite,
        inscritos: modelo.inscritos,
        status: feriado ? "cancelada" : "agendada",
      });
    }
  }
  return aulas;
}

export const aulas: Aula[] = criarAulas();
