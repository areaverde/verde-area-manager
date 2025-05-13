
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function formatDate(dateString: string) {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatMonthYear(month: number, year: number) {
  return `${months[month - 1]}/${year}`;
}
