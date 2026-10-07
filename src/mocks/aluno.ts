import { CREDENCIAIS_DEMO } from "@/constants/app";
import type { Aluno, ContagemBase, RegistroPresenca } from "@/types";

export const aluno: Aluno = {
  id: 1,
  nome: "Silvio Pereira Batista",
  email: CREDENCIAIS_DEMO.email,
  telefone: "(91) 99298-4421",
  nascimento: "2004-07-31",
  profissao: "Desenvolvedor Backend",
  foto: "/assets/mock/student-photo.jpg",
  academiaId: 1,
  faixa: {
    nome: "Azul",
    cor: "#2196F3",
    grau: 0,
    dataGraduacao: "2026-08-06",
  },
  dataMatricula: "2026-08-06",
  endereco: {
    cep: "66035-360",
    logradouro: "Travessa Humaitá",
    numero: "124",
    complemento: "Apto 302",
    bairro: "Pedreira",
    cidade: "Belém",
    estado: "PA",
  },
};

/**
 * Contagens fora dos registros detalhados.
 * 56 + 2 presenças de outubro = 58 aulas.
 * 15 + 1 falta de outubro = 16 faltas → frequência 78%.
 * 18 + 2 presenças na faixa azul = 20 aulas no grau atual.
 */
export const contagensBase: ContagemBase = {
  presencasAnteriores: 56,
  ausenciasAnteriores: 15,
  justificadasAnteriores: 0,
  aulasNaFaixaAnteriores: 18,
};

export const historico: RegistroPresenca[] = [
  {
    id: "hist-2026-10-07-jj",
    data: "2026-10-07",
    horario: "19:00",
    titulo: "Jiu-Jitsu Adulto",
    categoria: "Jiu-Jitsu Adulto",
    status: "presente",
    aulaId: "2026-10-07-jiu-jitsu-adulto",
  },
  {
    id: "hist-2026-10-05-open",
    data: "2026-10-05",
    horario: "10:00",
    titulo: "Open Mat",
    categoria: "Open Mat",
    status: "presente",
    aulaId: "2026-10-05-open-mat",
  },
  {
    id: "hist-2026-10-03-jj",
    data: "2026-10-03",
    horario: "19:00",
    titulo: "Jiu-Jitsu Adulto",
    categoria: "Jiu-Jitsu Adulto",
    status: "ausente",
    aulaId: "2026-10-03-jiu-jitsu-adulto",
  },
  {
    id: "hist-2026-10-01-fund",
    data: "2026-10-01",
    horario: "18:00",
    titulo: "Fundamentos",
    categoria: "Fundamentos",
    status: "justificado",
    aulaId: "2026-10-01-fundamentos",
  },
];
