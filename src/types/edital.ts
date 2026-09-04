export const categorias = [
  "Artes visuais",
  "Música",
  "Patrimônio",
  "Cultura popular",
] as const;

export const statuses = ["Aberto", "Em breve", "Encerrado"] as const;

export type Categoria = (typeof categorias)[number];
export type Status = (typeof statuses)[number];

export interface Edital {
  id: string;
  title: string;
  summary: string;
  category: Categoria;
  status: Status;
  deadline: string;
  publishedAt: string;
  label: string;
  audience: string;
  featured?: boolean;
  officialUrl?: string;
}
