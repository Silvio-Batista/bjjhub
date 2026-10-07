export const APP = {
  nome: "BJJHub",
  tagline: "Sua academia em evolução",
  conceito: "Da matrícula à faixa-preta.",
  versao: "0.1.0",
} as const;

export const CHAVES = {
  sessao: "bjjhub.sessao",
  sessaoEquipe: "bjjhub.sessaoEquipe",
  perfil: "bjjhub.perfil",
  notificacoes: "bjjhub.notificacoes",
  checkins: "bjjhub.checkins",
  confirmacoes: "bjjhub.confirmacoes",
  preferencias: "bjjhub.preferencias",
} as const;

export const CREDENCIAIS_DEMO = {
  email: "aluno.k4n8wq@bjjhub.demo",
  senha: "tR9mX4pc",
} as const;

export const CREDENCIAIS_EQUIPE = {
  email: "sensei.q8n4wk@bjjhub.demo",
  senha: "vL6pR2xm",
} as const;

export const REQUISITOS_GRAU = {
  dias: 365,
  aulas: 36,
} as const;

export const FREQUENCIA_BOA = 75;
export const FREQUENCIA_REGULAR = 50;

export const ORDEM_FAIXAS = ["Branca", "Azul", "Roxa", "Marrom", "Preta"] as const;

export const CORES_FAIXA: Record<(typeof ORDEM_FAIXAS)[number], string> = {
  Branca: "#F4F4F5",
  Azul: "#2196F3",
  Roxa: "#6D28D9",
  Marrom: "#6B3A2A",
  Preta: "#141414",
};

export const CATEGORIAS_AULA = [
  "Todas",
  "Jiu-Jitsu Adulto",
  "Fundamentos",
  "No-Gi",
  "Open Mat",
] as const;

export type FiltroAula = (typeof CATEGORIAS_AULA)[number];

export const FILTROS_NOTIFICACAO = [
  "Todas",
  "Não lidas",
  "Lidas",
  "Arquivadas",
] as const;

export type FiltroNotificacao = (typeof FILTROS_NOTIFICACAO)[number];

export const PREFERENCIAS_INICIAIS = {
  tema: "escuro",
  notificacoes: {
    pagamento: true,
    aula: true,
    graduacao: true,
    comunicado: true,
    evento: true,
  },
  privacidade: {
    exibirFoto: true,
    compartilharFrequencia: true,
  },
} as const;
