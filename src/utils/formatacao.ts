import { ORDEM_FAIXAS } from "@/constants/app";

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function rotuloGrau(grau: number): string {
  if (grau <= 0) return "0 Grau";
  return `${grau}º Grau`;
}

export function rotuloFaixaGrau(faixa: string, grau: number): string {
  return `${faixa} - ${rotuloGrau(grau)}`;
}

export function proximaMeta(faixa: string, grau: number): { faixa: string; grau: number } {
  if (grau < 4) return { faixa, grau: grau + 1 };
  const indice = ORDEM_FAIXAS.indexOf(faixa as (typeof ORDEM_FAIXAS)[number]);
  if (indice < 0 || indice >= ORDEM_FAIXAS.length - 1) {
    return { faixa, grau };
  }
  return { faixa: ORDEM_FAIXAS[indice + 1], grau: 0 };
}

export function rotuloProfessor(
  tratamento: "Professor" | "Professora",
  nome: string,
): string {
  return `${tratamento} ${nome}`;
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "BJ";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

export function slug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
