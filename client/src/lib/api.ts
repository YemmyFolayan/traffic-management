"use client";

import type {
  AnalyticsOverview,
  ApiResponse,
  AuthTokens,
  ComparisonData,
  DRLConfig,
  DRLModel,
  Intersection,
  SimulationRun,
  TrafficMetric,
  User,
  UserRole,
} from "@/types";
import { isDemoMode } from "@/lib/demo-mode";

const ACCESS_TOKEN_KEY = "itms_access_token";
const REFRESH_TOKEN_KEY = "itms_refresh_token";

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1"
  ).replace(/\/$/, "");
}

export interface TrafficMetricsQuery {
  intersectionId?: string;
  from?: string;
  to?: string;
}

export type LoginRegisterEntity = { user: User; tokens: AuthTokens };

class ApiClient {
  private readonly baseUrl = getBaseUrl();
  private refreshPromise: Promise<boolean> | null = null;

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(tokens: AuthTokens): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  private buildQueryString(
    query?: Record<string, string | number | boolean | undefined>,
  ): string {
    if (!query) return "";
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue;
      params.set(k, String(v));
    }
    const s = params.toString();
    return s ? `?${s}` : "";
  }

  private async tryRefresh(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;

        const res = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        const data = (await res.json()) as ApiResponse<{ tokens: AuthTokens }>;
        if (!data.status || !data.entity?.tokens) {
          this.clearTokens();
          return false;
        }
        this.setTokens(data.entity.tokens);
        return true;
      } catch {
        this.clearTokens();
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private shouldAttemptRefresh(path: string, status: number): boolean {
    if (status !== 401) return false;
    const p = path.replace(/^\//, "");
    if (p.startsWith("auth/login")) return false;
    if (p.startsWith("auth/register")) return false;
    if (p.startsWith("auth/refresh")) return false;
    return true;
  }

  private async parseJson<T>(res: Response): Promise<ApiResponse<T>> {
    const text = await res.text();
    if (!text.trim()) {
      return {
        entity: null as T,
        error: null,
        status: res.ok,
      };
    }
    try {
      return JSON.parse(text) as ApiResponse<T>;
    } catch {
      return {
        entity: null as T,
        error: { code: "PARSE_ERROR", message: "Invalid response from server" },
        status: false,
      };
    }
  }

  async request<T>(
    method: string,
    path: string,
    options?: {
      body?: unknown;
      skipAuth?: boolean;
      query?: Record<string, string | number | boolean | undefined>;
    },
  ): Promise<ApiResponse<T>> {
    if (isDemoMode()) {
      return { entity: null as T, error: null, status: false };
    }

    const queryString = this.buildQueryString(options?.query);
    const url = `${this.baseUrl}/${path.replace(/^\//, "")}${queryString}`;

    const exec = async (): Promise<Response> => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (!options?.skipAuth) {
        const access = this.getAccessToken();
        if (access) headers.Authorization = `Bearer ${access}`;
      }

      return fetch(url, {
        method,
        headers,
        body:
          options?.body !== undefined
            ? JSON.stringify(options.body)
            : undefined,
      });
    };

    let res = await exec();

    if (this.shouldAttemptRefresh(path, res.status)) {
      const ok = await this.tryRefresh();
      if (ok) res = await exec();
    }

    return this.parseJson<T>(res);
  }

  get<T>(
    path: string,
    options?: {
      skipAuth?: boolean;
      query?: Record<string, string | number | boolean | undefined>;
    },
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", path, options);
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: { skipAuth?: boolean },
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", path, { body, skipAuth: options?.skipAuth });
  }

  put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", path, { body });
  }

  delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", path);
  }

  login(
    email: string,
    password: string,
  ): Promise<ApiResponse<LoginRegisterEntity>> {
    return this.post<LoginRegisterEntity>(
      "/auth/login",
      { email, password },
      { skipAuth: true },
    );
  }

  register(
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ): Promise<ApiResponse<LoginRegisterEntity>> {
    return this.post<LoginRegisterEntity>(
      "/auth/register",
      { email, password, name, role },
      { skipAuth: true },
    );
  }

  getMe(): Promise<ApiResponse<User>> {
    return this.get<User>("/auth/me");
  }

  getIntersections(): Promise<ApiResponse<Intersection[]>> {
    return this.get<Intersection[]>("/intersections");
  }

  createIntersection(
    data: Omit<Intersection, "id" | "createdAt">,
  ): Promise<ApiResponse<Intersection>> {
    return this.post<Intersection>("/intersections", data);
  }

  updateIntersection(
    id: string,
    data: Partial<Omit<Intersection, "id" | "createdAt">>,
  ): Promise<ApiResponse<Intersection>> {
    return this.put<Intersection>(`/intersections/${id}`, data);
  }

  deleteIntersection(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/intersections/${id}`);
  }

  getAnalyticsOverview(): Promise<ApiResponse<AnalyticsOverview>> {
    return this.get<AnalyticsOverview>("/analytics/overview");
  }

  getComparisonData(): Promise<ApiResponse<ComparisonData[]>> {
    return this.get<ComparisonData[]>("/analytics/comparison");
  }

  getTrafficMetrics(
    params?: TrafficMetricsQuery,
  ): Promise<ApiResponse<TrafficMetric[]>> {
    return this.get<TrafficMetric[]>("/analytics/traffic-metrics", {
      query: params as Record<string, string | number | boolean | undefined>,
    });
  }

  getSimulationHistory(): Promise<ApiResponse<SimulationRun[]>> {
    return this.get<SimulationRun[]>("/simulations/history");
  }

  getDRLModels(): Promise<ApiResponse<DRLModel[]>> {
    return this.get<DRLModel[]>("/drl/models");
  }

  startTraining(config: DRLConfig): Promise<ApiResponse<DRLModel>> {
    return this.post<DRLModel>("/drl/training", config);
  }

  getUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>("/users");
  }

  updateUser(
    id: string,
    data: Partial<Pick<User, "name" | "email" | "role">>,
  ): Promise<ApiResponse<User>> {
    return this.put<User>(`/users/${id}`, data);
  }

  deleteUser(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/users/${id}`);
  }
}

export const api = new ApiClient();
