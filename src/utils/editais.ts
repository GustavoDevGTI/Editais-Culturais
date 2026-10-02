import type { Edital } from "../types/edital";

export function compareEditais(left: Edital, right: Edital) {
  return right.publishedDate.localeCompare(left.publishedDate)
    || left.title.localeCompare(right.title, "pt-BR", { sensitivity: "base" });
}

export function getEditalNumbers(editais: Edital[]): Map<string, number> {
  const oldestFirst = [...editais].sort((left, right) =>
    left.publishedDate.localeCompare(right.publishedDate)
    || left.title.localeCompare(right.title, "pt-BR", { sensitivity: "base" }),
  );

  return new Map(oldestFirst.map((edital, index) => [edital.id, index + 1]));
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
