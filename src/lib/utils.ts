import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combina clases de Tailwind con soporte condicional
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Formateador de moneda localizado
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "es-AR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

// Formateador de fecha localizado
export function formatDate(
  date: Date | string,
  locale: string = "es-AR",
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}
