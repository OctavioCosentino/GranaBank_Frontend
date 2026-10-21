// Claves centralizadas para consultas y mutaciones de TanStack Query
export const QUERY_KEYS = {
  auth: {
    user: ["auth", "user"] as const,
    session: ["auth", "session"] as const,
    profile: ["auth", "profile"] as const,
  },
  cards: {
    all: ["cards"] as const,
  },
  accounts: {
    all: ["accounts"] as const,
    detail: (id: string) => ["accounts", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (params: { search?: string; type?: string }) =>
      ["transactions", params] as const,
    recent: (limit: number = 6) => ["transactions", "recent", limit] as const,
    byAccount: (accountId: string) => ["transactions", "account", accountId] as const,
  },
} as const;

