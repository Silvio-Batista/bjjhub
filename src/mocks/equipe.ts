import { CORES_FAIXA, CREDENCIAIS_EQUIPE } from "@/constants/app";
import { aluno, contagensBase, historico } from "@/mocks/aluno";
import { mensalidades as mensalidadesSilvio, plano as planoMensal } from "@/mocks/financeiro";
import type {
  Aluno,
  ContagemEquipe,
  FaixaNome,
  MensalidadeEquipe,
  Plano,
  RegistroPresencaEquipe,
  Sensei,
  VinculoAluno,
} from "@/types";

export const sensei: Sensei = {
  id: 1,
  nome: "Carlos Silva",
  email: CREDENCIAIS_EQUIPE.email,
  tratamento: "Professor",
};

export const planoCompetidor: Plano = {
  id: "plano-competidor",
  nome: "Plano competidor",
  valor: 180,
  periodicidade: "mensal",
};

export const planosEquipe: Plano[] = [planoMensal, planoCompetidor];

function criarAluno(dados: {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  nascimento: string;
  profissao: string;
  faixa: FaixaNome;
  grau: number;
  dataGraduacao: string;
  dataMatricula: string;
  bairro: string;
  logradouro: string;
  numero: string;
}): Aluno {
  return {
    id: dados.id,
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    nascimento: dados.nascimento,
    profissao: dados.profissao,
    foto: "",
    academiaId: 1,
    faixa: {
      nome: dados.faixa,
      cor: CORES_FAIXA[dados.faixa],
      grau: dados.grau,
      dataGraduacao: dados.dataGraduacao,
    },
    dataMatricula: dados.dataMatricula,
    endereco: {
      cep: "66000-000",
      logradouro: dados.logradouro,
      numero: dados.numero,
      complemento: "",
      bairro: dados.bairro,
      cidade: "Belém",
      estado: "PA",
    },
  };
}

const demaisAlunos: Aluno[] = [
  criarAluno({
    id: 2,
    nome: "Marina Costa",
    email: "marina.c7h2@bjjhub.demo",
    telefone: "(91) 98810-2214",
    nascimento: "1998-04-18",
    profissao: "Professora",
    faixa: "Branca",
    grau: 2,
    dataGraduacao: "2026-06-12",
    dataMatricula: "2026-03-02",
    bairro: "Umarizal",
    logradouro: "Travessa Dom Romualdo de Seixas",
    numero: "418",
  }),
  criarAluno({
    id: 3,
    nome: "Rafael Nunes",
    email: "rafael.n3p9@bjjhub.demo",
    telefone: "(91) 98422-1108",
    nascimento: "1992-11-03",
    profissao: "Engenheiro",
    faixa: "Roxa",
    grau: 1,
    dataGraduacao: "2025-11-20",
    dataMatricula: "2023-02-14",
    bairro: "Nazaré",
    logradouro: "Avenida Governador Magalhães Barata",
    numero: "902",
  }),
  criarAluno({
    id: 4,
    nome: "Helena Duarte",
    email: "helena.d4k1@bjjhub.demo",
    telefone: "(91) 99155-7730",
    nascimento: "2001-01-27",
    profissao: "Estudante",
    faixa: "Azul",
    grau: 3,
    dataGraduacao: "2026-01-15",
    dataMatricula: "2024-08-01",
    bairro: "Batista Campos",
    logradouro: "Rua dos Mundurucus",
    numero: "1550",
  }),
  criarAluno({
    id: 5,
    nome: "Caio Mendes",
    email: "caio.m8r2@bjjhub.demo",
    telefone: "(91) 98701-4402",
    nascimento: "2006-09-09",
    profissao: "Estudante",
    faixa: "Branca",
    grau: 0,
    dataGraduacao: "2026-08-20",
    dataMatricula: "2026-08-20",
    bairro: "Marco",
    logradouro: "Passagem São Luís",
    numero: "76",
  }),
  criarAluno({
    id: 6,
    nome: "Lúcia Ferreira",
    email: "lucia.f2w6@bjjhub.demo",
    telefone: "(91) 99214-8801",
    nascimento: "1989-05-22",
    profissao: "Fisioterapeuta",
    faixa: "Marrom",
    grau: 2,
    dataGraduacao: "2025-04-10",
    dataMatricula: "2018-03-06",
    bairro: "Cremação",
    logradouro: "Travessa 9 de Janeiro",
    numero: "230",
  }),
  criarAluno({
    id: 7,
    nome: "Bruno Alves",
    email: "bruno.a9t5@bjjhub.demo",
    telefone: "(91) 98133-6620",
    nascimento: "1984-12-01",
    profissao: "Empresário",
    faixa: "Preta",
    grau: 1,
    dataGraduacao: "2024-09-18",
    dataMatricula: "2012-06-11",
    bairro: "Sacramenta",
    logradouro: "Rua dos Tamoios",
    numero: "88",
  }),
  criarAluno({
    id: 8,
    nome: "Aline Souza",
    email: "aline.s6b3@bjjhub.demo",
    telefone: "(91) 99340-2258",
    nascimento: "1999-07-14",
    profissao: "Designer",
    faixa: "Branca",
    grau: 4,
    dataGraduacao: "2026-05-02",
    dataMatricula: "2025-09-10",
    bairro: "Telégrafo",
    logradouro: "Avenida Senador Lemos",
    numero: "3104",
  }),
  criarAluno({
    id: 9,
    nome: "Thiago Ramos",
    email: "thiago.r1c8@bjjhub.demo",
    telefone: "(91) 98577-3094",
    nascimento: "1995-02-28",
    profissao: "Analista",
    faixa: "Roxa",
    grau: 0,
    dataGraduacao: "2026-02-07",
    dataMatricula: "2022-11-19",
    bairro: "Guamá",
    logradouro: "Rua Barão de Igarapé Miri",
    numero: "612",
  }),
  criarAluno({
    id: 10,
    nome: "Diego Pacheco",
    email: "diego.p5m7@bjjhub.demo",
    telefone: "(91) 98662-1145",
    nascimento: "1997-08-30",
    profissao: "Vendedor",
    faixa: "Azul",
    grau: 1,
    dataGraduacao: "2026-03-21",
    dataMatricula: "2025-01-15",
    bairro: "Marambaia",
    logradouro: "Conjunto CDP",
    numero: "14",
  }),
];

export const alunosEquipe: Aluno[] = [aluno, ...demaisAlunos];

export const vinculosEquipe: VinculoAluno[] = [
  { alunoId: 1, planoId: planoMensal.id, ativo: true },
  { alunoId: 2, planoId: planoMensal.id, ativo: true },
  { alunoId: 3, planoId: planoCompetidor.id, ativo: true },
  { alunoId: 4, planoId: planoMensal.id, ativo: true },
  { alunoId: 5, planoId: planoMensal.id, ativo: true },
  { alunoId: 6, planoId: planoCompetidor.id, ativo: true },
  { alunoId: 7, planoId: planoCompetidor.id, ativo: true },
  { alunoId: 8, planoId: planoMensal.id, ativo: true },
  { alunoId: 9, planoId: planoCompetidor.id, ativo: true },
  { alunoId: 10, planoId: planoMensal.id, ativo: false },
];

function cobranca(
  alunoId: number,
  competencia: string,
  valor: number,
  vencimento: string,
  pago: boolean,
  pagoEm?: string,
): MensalidadeEquipe {
  return {
    id: `eq-${alunoId}-${competencia}`,
    alunoId,
    competencia,
    valor,
    vencimento,
    pago,
    pagoEm: pago ? pagoEm : undefined,
    metodo: pago ? "Pix" : undefined,
  };
}

export const mensalidadesEquipe: MensalidadeEquipe[] = [
  ...mensalidadesSilvio.map((item) => ({ ...item, alunoId: 1 })),
  cobranca(2, "2026-09", 100, "2026-09-08", true, "2026-09-07"),
  cobranca(2, "2026-10", 100, "2026-10-08", true, "2026-10-04"),
  cobranca(3, "2026-09", 180, "2026-09-12", true, "2026-09-12"),
  cobranca(3, "2026-10", 180, "2026-10-12", false),
  cobranca(4, "2026-09", 100, "2026-09-05", true, "2026-09-05"),
  cobranca(4, "2026-10", 100, "2026-10-05", false),
  cobranca(5, "2026-09", 100, "2026-09-20", true, "2026-09-18"),
  cobranca(5, "2026-10", 100, "2026-10-20", true, "2026-10-02"),
  cobranca(6, "2026-09", 180, "2026-09-10", true, "2026-09-09"),
  cobranca(6, "2026-10", 180, "2026-10-10", true, "2026-10-06"),
  cobranca(7, "2026-09", 180, "2026-09-15", true, "2026-09-15"),
  cobranca(7, "2026-10", 180, "2026-10-15", false),
  cobranca(8, "2026-09", 100, "2026-09-10", true, "2026-09-10"),
  cobranca(8, "2026-10", 100, "2026-10-10", false),
  cobranca(9, "2026-09", 180, "2026-09-07", true, "2026-09-07"),
  cobranca(9, "2026-10", 180, "2026-10-07", true, "2026-10-07"),
  cobranca(10, "2026-09", 100, "2026-09-15", true, "2026-09-14"),
  cobranca(10, "2026-10", 100, "2026-10-15", true, "2026-10-01"),
];

function chamada(
  alunoId: number,
  data: string,
  horario: string,
  titulo: string,
  categoria: string,
  status: RegistroPresencaEquipe["status"],
  aulaId: string,
): RegistroPresencaEquipe {
  return {
    id: `pres-${alunoId}-${aulaId}`,
    alunoId,
    data,
    horario,
    titulo,
    categoria,
    status,
    aulaId,
  };
}

export const presencasEquipe: RegistroPresencaEquipe[] = [
  ...historico.map((item) => ({ ...item, alunoId: 1 })),
  chamada(2, "2026-10-07", "19:00", "Jiu-Jitsu Adulto", "Jiu-Jitsu Adulto", "presente", "2026-10-07-jiu-jitsu-adulto"),
  chamada(2, "2026-10-05", "19:30", "Jiu-Jitsu Adulto", "Jiu-Jitsu Adulto", "presente", "2026-10-05-jiu-jitsu-adulto"),
  chamada(3, "2026-10-06", "20:00", "No-Gi", "No-Gi", "presente", "2026-10-06-no-gi"),
  chamada(3, "2026-10-03", "19:00", "Jiu-Jitsu Adulto", "Jiu-Jitsu Adulto", "ausente", "2026-10-03-jiu-jitsu-adulto"),
  chamada(4, "2026-10-06", "07:00", "Fundamentos", "Fundamentos", "ausente", "2026-10-06-fundamentos"),
  chamada(4, "2026-10-01", "19:15", "Jiu-Jitsu Adulto", "Jiu-Jitsu Adulto", "presente", "2026-10-01-jiu-jitsu-adulto"),
  chamada(5, "2026-10-07", "09:00", "No-Gi", "No-Gi", "presente", "2026-10-07-no-gi"),
  chamada(6, "2026-10-07", "19:00", "Jiu-Jitsu Adulto", "Jiu-Jitsu Adulto", "presente", "2026-10-07-jiu-jitsu-adulto"),
  chamada(6, "2026-10-05", "10:00", "Open Mat", "Open Mat", "presente", "2026-10-05-open-mat"),
  chamada(7, "2026-10-04", "10:00", "Open Mat", "Open Mat", "ausente", "2026-10-04-open-mat"),
  chamada(8, "2026-10-06", "20:00", "No-Gi", "No-Gi", "presente", "2026-10-06-no-gi"),
  chamada(8, "2026-10-02", "12:00", "No-Gi", "No-Gi", "justificado", "2026-10-02-no-gi"),
  chamada(9, "2026-10-05", "19:30", "Jiu-Jitsu Adulto", "Jiu-Jitsu Adulto", "presente", "2026-10-05-jiu-jitsu-adulto"),
];

export const contagensEquipe: ContagemEquipe[] = [
  { alunoId: 1, ...contagensBase },
  { alunoId: 2, presencasAnteriores: 40, ausenciasAnteriores: 4, justificadasAnteriores: 1, aulasNaFaixaAnteriores: 14 },
  { alunoId: 3, presencasAnteriores: 70, ausenciasAnteriores: 12, justificadasAnteriores: 2, aulasNaFaixaAnteriores: 28 },
  { alunoId: 4, presencasAnteriores: 22, ausenciasAnteriores: 18, justificadasAnteriores: 0, aulasNaFaixaAnteriores: 11 },
  { alunoId: 5, presencasAnteriores: 8, ausenciasAnteriores: 3, justificadasAnteriores: 0, aulasNaFaixaAnteriores: 8 },
  { alunoId: 6, presencasAnteriores: 90, ausenciasAnteriores: 6, justificadasAnteriores: 1, aulasNaFaixaAnteriores: 32 },
  { alunoId: 7, presencasAnteriores: 30, ausenciasAnteriores: 10, justificadasAnteriores: 0, aulasNaFaixaAnteriores: 22 },
  { alunoId: 8, presencasAnteriores: 18, ausenciasAnteriores: 8, justificadasAnteriores: 1, aulasNaFaixaAnteriores: 16 },
  { alunoId: 9, presencasAnteriores: 48, ausenciasAnteriores: 9, justificadasAnteriores: 0, aulasNaFaixaAnteriores: 20 },
  { alunoId: 10, presencasAnteriores: 15, ausenciasAnteriores: 10, justificadasAnteriores: 0, aulasNaFaixaAnteriores: 9 },
];
