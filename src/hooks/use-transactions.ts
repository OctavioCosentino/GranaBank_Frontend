"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { transactionService } from "@/services/transaction-service";
import type { TransactionsQueryResponse } from "@/types/transaction";

export interface UseTransactionsFilterOptions {
  search?: string;
  type?: string;
}

// Hook para obtener las transacciones recientes para Home
export function useRecentTransactionsQuery(limit: number = 6) {
  return useQuery<TransactionsQueryResponse, Error>({
    queryKey: QUERY_KEYS.transactions.recent(limit),
    queryFn: async () => {
      return transactionService.getTransactions({
        page: 1,
        limit,
      });
    },
  });
}

// Hook para consultar transacciones con scroll infinito, filtros y búsqueda global
export function useInfiniteTransactionsQuery({
  search,
  type,
}: UseTransactionsFilterOptions = {}) {
  const normalizedType = type === "ALL" ? undefined : type;

  return useInfiniteQuery<TransactionsQueryResponse, Error>({
    queryKey: QUERY_KEYS.transactions.list({
      search: search || undefined,
      type: normalizedType,
    }),
    queryFn: async ({ pageParam = 1 }) => {
      return transactionService.getTransactions({
        page: Number(pageParam),
        limit: 15,
        search: search?.trim() || undefined,
        type: normalizedType,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.has_next_page
        ? lastPage.pagination.page + 1
        : undefined,
    initialPageParam: 1,
  });
}
