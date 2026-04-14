/**
 * Format date smartly based on how recent it is
 * - Today: "Hoje às 14:30"
 * - Yesterday: "Ontem às 14:30"
 * - This week: "Segunda-feira às 14:30"
 * - Older: "18/12/2025"
 */
import { format, formatRelative, isToday, isYesterday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatSmartDate(date: string | Date | number): string {
  if (!date) return "";

  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date);

    if (isToday(parsedDate)) {
      return `Hoje às ${format(parsedDate, "HH:mm", { locale: ptBR })}`;
    }

    if (isYesterday(parsedDate)) {
      return `Ontem às ${format(parsedDate, "HH:mm", { locale: ptBR })}`;
    }

    const daysDiff = Math.floor((Date.now() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 0 && daysDiff < 7) {
      return formatRelative(parsedDate, new Date(), { locale: ptBR });
    }

    return format(parsedDate, "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return "";
  }
}
