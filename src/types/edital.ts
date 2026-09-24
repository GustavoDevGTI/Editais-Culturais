export const statuses = ["Aberto", "Em breve", "Encerrado"] as const;

export type Categoria = string;
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
  updatedDate?: string;
  publishedAt: string;
  label: string;
  audience: string;
  featured?: boolean;
  officialUrl?: string;
  pdfFile?: string;
  pageCount?: number;
  cardImage?: string;
  cardImageAlt?: string;
  cardImageVariant?: "official-name";
  relatedDocuments?: EditalDocument[];
  externalAccess?: EditalExternalAccess;
}
