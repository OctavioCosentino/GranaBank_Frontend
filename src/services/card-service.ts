import { apiClient } from "@/services/api-client";
import type { BackendCard, CreateCardDto } from "@/types/card";
import type { ApiResponse } from "@/types/api";

// Servicio para consultas y registro de tarjetas bancarias en el backend
export const cardService = {
  // Obtiene el listado de tarjetas del usuario autenticado
  getCards: async (): Promise<ApiResponse<BackendCard[]>> => {
    return apiClient.get<BackendCard[]>("/cards");
  },

  // Registra una nueva tarjeta vinculada al usuario
  createCard: async (
    data: CreateCardDto,
  ): Promise<ApiResponse<BackendCard>> => {
    return apiClient.post<BackendCard>("/cards", data);
  },
};
