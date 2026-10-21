"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cardService } from "@/services/card-service";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { BackendCard, CreateCardDto } from "@/types/card";
import type { ApiError } from "@/types/api";

// Hook para obtener la lista de tarjetas desde el backend
export function useCardsQuery() {
  return useQuery<BackendCard[], ApiError>({
    queryKey: QUERY_KEYS.cards.all,
    queryFn: async () => {
      const response = await cardService.getCards();
      // Soporta respuesta envuelta en data o array directo
      if (Array.isArray(response?.data)) {
        return response.data;
      }
      if (Array.isArray(response)) {
        return response as unknown as BackendCard[];
      }
      return [];
    },
    staleTime: 60 * 1000,
  });
}

// Hook para registrar una nueva tarjeta e invalidar la caché
export function useCreateCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateCardDto) => {
      const response = await cardService.createCard(dto);
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cards.all });
    },
  });
}
