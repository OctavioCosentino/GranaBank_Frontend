// Tipos de tarjetas según la API del backend
export interface BackendCard {
  id: string;
  cardholder: string;
  expiration_date: string;
  last_four: string;
  user_id?: string;
  created_at?: string;
}

export interface CreateCardDto {
  cardholder: string;
  expiration_date: string;
  last_four: string;
}

