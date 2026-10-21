import { env } from "@/lib/env";
import { tokenManager } from "@/lib/token-manager";
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

  private getAuthToken(): string | null {
    return tokenManager.getAccessToken();
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

      if (!res.ok || responseBody?.success === false) {
        let errorMessage = `HTTP error: ${res.status}`;

        if (typeof responseBody?.message === "string") {
          errorMessage = responseBody.message;
        } else if (Array.isArray(responseBody?.message)) {
          errorMessage = responseBody.message
            .map((item: unknown) =>
              typeof item === "string" ? item : JSON.stringify(item)
            )
            .join(", ");
        } else if (
          responseBody?.message &&
          typeof responseBody.message === "object"
        ) {
          const innerMsg = (
            responseBody.message as Record<string, unknown>
          ).message;
          errorMessage =
            typeof innerMsg === "string"
              ? innerMsg
              : JSON.stringify(responseBody.message);
        } else if (typeof responseBody?.error === "string") {
          errorMessage = responseBody.error;
        } else if (
          responseBody?.error &&
          typeof responseBody.error === "object"
        ) {
          const innerErr = (responseBody.error as Record<string, unknown>)
            .message;
          errorMessage =
            typeof innerErr === "string"
              ? innerErr
              : JSON.stringify(responseBody.error);
        }

        const error: ApiError = {
          statusCode: responseBody?.statusCode || res.status,
          message: errorMessage,
          details: responseBody,
        };
        throw error;
      }

      return responseBody as ApiResponse<T>;
    } catch (err: unknown) {
      if (
        (err as ApiError)?.statusCode &&
        typeof (err as ApiError)?.message === "string"
      ) {
        throw err;
      }

      let fallbackMessage = "Error inesperado de red";
      if (err instanceof Error && typeof err.message === "string") {
        fallbackMessage = err.message;
      } else if (typeof err === "string") {
        fallbackMessage = err;
      } else if (err && typeof err === "object") {
        const anyErr = err as Record<string, unknown>;
        if (typeof anyErr.message === "string") {
          fallbackMessage = anyErr.message;
        } else if (anyErr.message && typeof anyErr.message === "object") {
          const inner = anyErr.message as Record<string, unknown>;
          fallbackMessage =
            typeof inner.message === "string"
              ? inner.message
              : JSON.stringify(anyErr.message);
        }
      }

      throw {
        statusCode: (err as ApiError)?.statusCode || 500,
        message: fallbackMessage,
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
