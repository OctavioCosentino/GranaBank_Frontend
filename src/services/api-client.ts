import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import type { ApiError, ApiResponse } from "@/types/api";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Cliente HTTP para llamadas al backend externo con inyección automática de JWT
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = env.api.baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token || null;
    } catch {
      return null;
    }
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(`${this.baseUrl}/${endpoint.replace(/^\//, "")}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { params, headers = {}, ...customConfig } = options;
    const token = await this.getAuthToken();

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    };

    const targetUrl = this.buildUrl(endpoint, params);

    try {
      const res = await fetch(targetUrl, {
        ...customConfig,
        headers: requestHeaders,
      });

      const responseBody = await res.json().catch(() => null);

      if (!res.ok) {
        const error: ApiError = {
          statusCode: res.status,
          message:
            responseBody?.message ||
            responseBody?.error ||
            `HTTP error: ${res.status}`,
          details: responseBody,
        };
        throw error;
      }

      return responseBody as ApiResponse<T>;
    } catch (err: unknown) {
      if ((err as ApiError).statusCode) {
        throw err;
      }

      throw {
        statusCode: 500,
        message: (err as Error).message || "Error inesperado de red",
      } satisfies ApiError;
    }
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
