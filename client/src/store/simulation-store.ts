"use client";

import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import type { SimulationConfig, SimulationState } from "@/types";
import { isDemoMode } from "@/lib/demo-mode";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";

const defaultConfig: SimulationConfig = {
  vehicleCount: 50,
  simulationSpeed: 1,
  gridSize: 10,
  intersectionCount: 4,
  useRL: false,
};

let socket: Socket | null = null;

interface SimulationStoreState {
  simulationState: SimulationState | null;
  isConnected: boolean;
  config: SimulationConfig;
  connect: () => void;
  disconnect: () => void;
  startSimulation: (config: SimulationConfig) => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  updateConfig: (partial: Partial<SimulationConfig>) => void;
}

export const useSimulationStore = create<SimulationStoreState>((set, get) => ({
  simulationState: null,
  isConnected: false,
  config: { ...defaultConfig },

  connect: () => {
    if (isDemoMode()) return;
    if (socket?.connected) return;

    const s = io(WS_URL, {
      transports: ["websocket", "polling"],
    });

    socket = s;

    s.on("connect", () => {
      set({ isConnected: true });
    });

    s.on("disconnect", () => {
      set({ isConnected: false });
    });

    s.on("simulation_update", (payload: SimulationState) => {
      set({ simulationState: payload });
    });
  },

  disconnect: () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }
    set({ isConnected: false });
  },

  startSimulation: (config) => {
    get().connect();
    set({ config });
    socket?.emit("start_simulation", config);
  },

  stopSimulation: () => {
    socket?.emit("stop_simulation");
  },

  resetSimulation: () => {
    socket?.emit("reset_simulation");
  },

  updateConfig: (partial) => {
    set((state) => ({
      config: { ...state.config, ...partial },
    }));
  },
}));
