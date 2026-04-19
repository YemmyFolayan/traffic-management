"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import { isDemoMode } from "@/lib/demo-mode";
import { DEMO_ADMIN, DEMO_USERS } from "@/lib/demo-data";
import type { RegisterPayload, User } from "@/types";
import { UserRole } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoSession: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, "name" | "email">>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isDemoSession: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.login(email, password);
      if (!res.status || !res.entity) {
        throw new Error(res.error?.message ?? "Login failed");
      }
      api.setTokens(res.entity.tokens);
      set({
        user: res.entity.user,
        isAuthenticated: true,
        isLoading: false,
        isDemoSession: false,
      });
    } catch (e) {
      const demoAccounts: Record<string, { password: string; user: User }> = {
        "admin@itms.com": { password: "admin123", user: DEMO_ADMIN },
        "operator@itms.com": {
          password: "operator123",
          user: { ...DEMO_USERS[1] },
        },
        "viewer@itms.com": {
          password: "viewer123",
          user: { ...DEMO_USERS[2] },
        },
      };

      const demo = demoAccounts[email];
      if (demo && password === demo.password) {
        if (typeof window !== "undefined") {
          localStorage.setItem("itms_demo_email", email);
        }
        api.setTokens({ accessToken: "demo-token", refreshToken: "demo-refresh" });
        set({
          user: demo.user,
          isAuthenticated: true,
          isLoading: false,
          isDemoSession: true,
        });
        return;
      }

      set({ isLoading: false });
      throw e;
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await api.register(
        payload.email,
        payload.password,
        payload.name,
        payload.role,
      );
      if (!res.status || !res.entity) {
        throw new Error(res.error?.message ?? "Registration failed");
      }
      api.setTokens(res.entity.tokens);
      set({
        user: res.entity.user,
        isAuthenticated: true,
        isLoading: false,
        isDemoSession: false,
      });
    } catch (e) {
      if (isDemoMode()) {
        const demoUser: User = {
          id: `demo-${Date.now()}`,
          email: payload.email,
          name: payload.name,
          role: payload.role ?? UserRole.VIEWER,
          createdAt: new Date().toISOString(),
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("itms_demo_email", payload.email);
        }
        api.setTokens({ accessToken: "demo-token", refreshToken: "demo-refresh" });
        set({
          user: demoUser,
          isAuthenticated: true,
          isLoading: false,
          isDemoSession: true,
        });
        return;
      }
      set({ isLoading: false });
      throw e;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("itms_demo_email");
    }
    api.clearTokens();
    set({ user: null, isAuthenticated: false, isDemoSession: false });
  },

  loadUser: async () => {
    const token = api.getAccessToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false, isDemoSession: false });
      return;
    }

    if (token === "demo-token") {
      const storedEmail =
        typeof window !== "undefined" ? localStorage.getItem("itms_demo_email") : null;
      const demoUser = DEMO_USERS.find((u) => u.email === storedEmail) || DEMO_ADMIN;
      set({ user: demoUser, isAuthenticated: true, isLoading: false, isDemoSession: true });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await api.getMe();
      if (!res.status || !res.entity) {
        api.clearTokens();
        set({ user: null, isAuthenticated: false, isLoading: false, isDemoSession: false });
        return;
      }
      set({
        user: res.entity,
        isAuthenticated: true,
        isLoading: false,
        isDemoSession: false,
      });
    } catch {
      api.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false, isDemoSession: false });
    }
  },

  updateProfile: async (data) => {
    const current = get().user;
    if (!current) return;

    if (get().isDemoSession || isDemoMode()) {
      set({ user: { ...current, ...data }, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await api.put<User>("/auth/me", data);
      if (!res.status || !res.entity) {
        throw new Error(res.error?.message ?? "Update failed");
      }
      set({ user: res.entity, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },
}));
