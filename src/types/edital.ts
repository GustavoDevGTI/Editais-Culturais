export const categorias = [
  "Artes visuais",
  "Música",
  "Patrimônio",
  "Cultura popular",
] as const;

export const statuses = ["Aberto", "Em breve", "Encerrado"] as const;

export type Categoria = (typeof categorias)[number];
export type Status = (typeof statuses)[number];

export interface EditalExternalAccess {
  url: string;
  label: string;
}

export interface EditalDocument {
  id: string;
  title: string;
  publishedAt: string;
  pdfFile: string;
  pageCount: number;
}

export interface Edital {
  id: string;
  title: string;
  summary: string;
  category: Categoria;
  status: Status;
  deadline: string;
  publishedDate: string;
  publishedAt: string;
  label: string;
  audience: string;
  featured?: boolean;
  officialUrl?: string;
  pdfFile?: string;
  pageCount?: number;
  cardImage?: string;
  cardImageAlt?: string;
  relatedDocuments?: EditalDocument[];
  externalAccess?: EditalExternalAccess;
}
