export type FaixaNome = "Branca" | "Azul" | "Roxa" | "Marrom" | "Preta";

export type StatusPresenca = "presente" | "ausente" | "justificado";

export type StatusMensalidade = "pago" | "pendente" | "atrasado";

export type TipoNotificacao =
  | "PAGAMENTO"
  | "AULA"
  | "GRADUACAO"
  | "COMUNICADO"
  | "EVENTO";

export type CategoriaAula =
  | "Jiu-Jitsu Adulto"
  | "Fundamentos"
  | "No-Gi"
  | "Open Mat";

export type StatusAula = "agendada" | "encerrada" | "cancelada";

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Faixa {
  nome: FaixaNome;
  cor: string;
  grau: number;
}

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  nascimento: string;
  profissao: string;
  foto: string;
  academiaId: number;
  faixa: Faixa & { dataGraduacao: string };
  dataMatricula: string;
  endereco: Endereco;
}

export interface Academia {
  id: number;
  nome: string;
  cidade: string;
}

export interface Professor {
  id: number;
  nome: string;
  tratamento: "Professor" | "Professora";
}

export interface Aula {
  id: string;
  titulo: string;
  categoria: CategoriaAula;
  professor: string;
  professorId: number;
  tratamento: "Professor" | "Professora";
  data: string;
  horarioInicio: string;
  horarioFim: string;
  limiteAlunos: number;
  inscritos: number;
  status: StatusAula;
}

export interface Checkin {
  id: string;
  aulaId: string;
  alunoId: number;
  academiaId: number;
  academiaNome: string;
  data: string;
  hora: string;
  tituloAula: string;
  categoria: string;
  horarioAula: string;
}

export interface RegistroPresenca {
  id: string;
  data: string;
  horario: string;
  titulo: string;
  categoria: string;
  status: StatusPresenca;
  aulaId: string;
}

export interface Graduacao {
  id: string;
  faixa: FaixaNome;
  grau: number;
  data: string;
  descricao: string;
}

export interface Plano {
  id: string;
  nome: string;
  valor: number;
  periodicidade: "mensal";
}

export interface Mensalidade {
  id: string;
  competencia: string;
  valor: number;
  vencimento: string;
  pago: boolean;
  pagoEm?: string;
  metodo?: string;
}

export interface Pagamento {
  id: string;
  mensalidadeId: string;
  valor: number;
  data: string;
  metodo: string;
}

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  criadaEm: string;
  lida: boolean;
  arquivada: boolean;
}

export interface Sessao {
  alunoId: number;
  email: string;
  iniciadaEm: string;
}

export interface Preferencias {
  tema: "escuro" | "grafite";
  notificacoes: {
    pagamento: boolean;
    aula: boolean;
    graduacao: boolean;
    comunicado: boolean;
    evento: boolean;
  };
  privacidade: {
    exibirFoto: boolean;
    compartilharFrequencia: boolean;
  };
}

export interface ContagemBase {
  presencasAnteriores: number;
  ausenciasAnteriores: number;
  justificadasAnteriores: number;
  aulasNaFaixaAnteriores: number;
}

export interface ProgressoGraduacao {
  faixa: string;
  grauAtual: number;
  proximaFaixa: string;
  proximoGrau: number;
  rotuloAtual: string;
  rotuloProximo: string;
  diasNaFaixa: number;
  diasNecessarios: number;
  aulasNaFaixa: number;
  aulasNecessarias: number;
  progressoDias: number;
  progressoAulas: number;
  diasRestantes: number;
  aulasRestantes: number;
  elegivel: boolean;
}

export interface StatusFinanceiro {
  status: StatusMensalidade;
  acessoLiberado: boolean;
  rotuloAcesso: string;
  mensagem: string;
}

export interface ResumoPresencas {
  totalAulas: number;
  presencas: number;
  ausencias: number;
  justificadas: number;
  frequencia: number;
  rotuloFrequencia: "Boa" | "Regular" | "Baixa";
  aulasNaFaixa: number;
  diasNaFaixa: number;
  progresso: ProgressoGraduacao;
  historico: RegistroPresenca[];
}

export interface Sensei {
  id: number;
  nome: string;
  email: string;
  tratamento: "Professor" | "Professora";
}

export interface SessaoEquipe {
  senseiId: number;
  email: string;
  iniciadaEm: string;
}

export interface VinculoAluno {
  alunoId: number;
  planoId: string;
  ativo: boolean;
}

export interface MensalidadeEquipe extends Mensalidade {
  alunoId: number;
}

export interface RegistroPresencaEquipe extends RegistroPresenca {
  alunoId: number;
}

export interface ContagemEquipe extends ContagemBase {
  alunoId: number;
}

export interface ResumoAluno {
  id: number;
  nome: string;
  ativo: boolean;
  faixa: FaixaNome;
  grau: number;
  planoNome: string;
  planoValor: number;
  frequencia: number;
  rotuloFrequencia: "Boa" | "Regular" | "Baixa";
  presencas: number;
  ausencias: number;
  justificadas: number;
  statusFinanceiro: StatusMensalidade;
  valorEmAberto: number;
  competencia: string;
  vencimento: string;
}

export interface FichaAluno {
  aluno: Aluno;
  plano: Plano;
  resumo: ResumoAluno;
  mensalidades: Mensalidade[];
  presencasRecentes: RegistroPresenca[];
}

export interface LancamentoEquipe {
  alunoId: number;
  nome: string;
  ativo: boolean;
  faixa: FaixaNome;
  planoNome: string;
  mensalidade: Mensalidade;
  status: StatusMensalidade;
}

export interface LinhaPresenca {
  id: string;
  alunoId: number;
  nome: string;
  faixa: FaixaNome;
  registro: RegistroPresenca;
}

export interface ResumoEquipe {
  alunosAtivos: number;
  pagamentosAtrasados: number;
  frequenciaMedia: number;
  aulasHoje: number;
}
