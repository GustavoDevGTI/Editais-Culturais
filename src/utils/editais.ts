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
