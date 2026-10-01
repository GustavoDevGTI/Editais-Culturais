import type { Edital, Status } from "../types/edital";

const statusPriority: Record<Status, number> = {
  Aberto: 0,
  "Em breve": 1,
  Encerrado: 2,
};

export function compareEditais(left: Edital, right: Edital) {
  return statusPriority[left.status] - statusPriority[right.status]
    || left.publishedDate.localeCompare(right.publishedDate)
    || left.title.localeCompare(right.title, "pt-BR", { sensitivity: "base" });
}

export function getEditalNumbers(editais: Edital[]): Map<string, number> {
  const newestFirst = [...editais].sort((left, right) =>
    right.publishedDate.localeCompare(left.publishedDate)
    || left.title.localeCompare(right.title, "pt-BR", { sensitivity: "base" }),
  );

  return new Map(newestFirst.map((edital, index) => [edital.id, index + 1]));
}

export function resolveEditalDeadline(edital: Edital, now: number): Edital {
  if (!edital.deadlineAt || !edital.closedDeadline || now < Date.parse(edital.deadlineAt)) {
    return edital;
  }

  return { ...edital, status: "Encerrado", deadline: edital.closedDeadline };
}

export function getLastUpdatedLabel(editais: Edital[]) {
  const latestDate = editais.reduce(
    (latest, edital) => {
      const referenceDate = edital.updatedDate ?? edital.publishedDate;
      return referenceDate > latest ? referenceDate : latest;
    },
    "",
  );

  if (!latestDate) return "";

  const [year, month, day] = latestDate.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" })
    .format(new Date(year, month - 1, day));
}
