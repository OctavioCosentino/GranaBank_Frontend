import { apiClient } from "@/services/api-client";
import type {
  GetTransactionsParams,
  TransactionsQueryResponse,
} from "@/types/transaction";

// Servicio para consultas paginadas de movimientos financieros
export const transactionService = {
  // Obtiene el listado de transacciones con soporte de paginación, búsqueda y filtros
  getTransactions: async (
    params?: GetTransactionsParams
  ): Promise<TransactionsQueryResponse> => {
    const queryParams: Record<string, string | number | undefined> = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 15,
      ...(params?.search ? { search: params.search } : {}),
      ...(params?.type && params.type !== "ALL" ? { type: params.type } : {}),
    };

    const response = await apiClient.get<unknown>("/transactions", {
      params: queryParams,
    });

    return response as unknown as TransactionsQueryResponse;
  },
};

