import type { Edital, Status } from "../types/edital";

const statusPriority: Record<Status, number> = {
  Aberto: 0,
  "Em breve": 1,
  Encerrado: 2,
};

export function compareEditais(left: Edital, right: Edital) {
  return statusPriority[left.status] - statusPriority[right.status]
    || left.title.localeCompare(right.title, "pt-BR", { sensitivity: "base" });
}

export function getLastUpdatedLabel(editais: Edital[]) {
  const latestDate = editais.reduce(
    (latest, edital) => edital.publishedDate > latest ? edital.publishedDate : latest,
    "",
  );

  if (!latestDate) return "";

  const [year, month, day] = latestDate.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" })
    .format(new Date(year, month - 1, day));
}
