export type TransactionType = "SUS" | "CASH_IN" | "CASH_OUT";

export interface BackendTransaction {
  id: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  amount: number | string;
  user_id?: string;
  created_at: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next_page: boolean;
}

export interface TransactionsQueryResponse {
  success: boolean;
  message: string;
  data: BackendTransaction[];
  pagination: PaginationMetadata;
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

// Formatea el importe numérico con signo según el tipo de movimiento
export function formatTransactionAmount(
  amount: number | string,
  type: TransactionType
): string {
  if (
    typeof amount === "string" &&
    (amount.startsWith("$") || amount.startsWith("+") || amount.startsWith("-"))
  ) {
    return amount;
  }
  const numeric =
    typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;
  const formatted = numeric.toLocaleString("es-AR", {
    minimumFractionDigits: numeric % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });

  if (type === "CASH_IN") return `+$${formatted}`;
  if (type === "CASH_OUT" || type === "SUS") return `-$${formatted}`;
  return `$${formatted}`;
}

// Extrae de forma segura el array de transacciones sin importar el formato de envoltura del backend
export function extractTransactions(payload: unknown): BackendTransaction[] {
  if (!payload) return [];
  const p = payload as Record<string, unknown>;
  if (Array.isArray(p.data)) return p.data as BackendTransaction[];
  if (Array.isArray(p)) return p as BackendTransaction[];
  if (p.data && typeof p.data === "object") {
    const nested = p.data as Record<string, unknown>;
    if (Array.isArray(nested.transactions)) return nested.transactions as BackendTransaction[];
    if (Array.isArray(nested.items)) return nested.items as BackendTransaction[];
    if (Array.isArray(nested.data)) return nested.data as BackendTransaction[];
  }
  if (Array.isArray(p.transactions)) return p.transactions as BackendTransaction[];
  if (Array.isArray(p.items)) return p.items as BackendTransaction[];
  return [];
}
