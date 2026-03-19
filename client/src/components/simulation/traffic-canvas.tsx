"use client";

import { useRef, useEffect, useCallback } from "react";
import type { SimulationState, Vehicle, SimSignal } from "@/types";

interface TrafficCanvasProps {
  state: SimulationState | null;
  width?: number;
  height?: number;
}

const COLORS = {
  background: "#1a1a2e",
  road: "#2d2d44",
  roadLine: "#4a4a5a",
  laneMarking: "#fbbf24",
  vehicle: {
    N: "#60a5fa",
    S: "#34d399",
    E: "#f472b6",
    W: "#a78bfa",
  },
  signal: {
    RED: "#ef4444",
    YELLOW: "#eab308",
    GREEN: "#22c55e",
  },
  intersection: "#3d3d5c",
  text: "#e2e8f0",
  gridLine: "#252540",
};

export function TrafficCanvas({ state, width: propWidth, height: propHeight }: TrafficCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ width: 600, height: 450 });

  const updateSize = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    sizeRef.current = {
      width: propWidth || Math.floor(rect.width),
      height: propHeight || Math.floor(Math.max(rect.height, 350)),
    };
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = sizeRef.current.width;
      canvas.height = sizeRef.current.height;
    }
  }, [propWidth, propHeight]);

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = sizeRef.current;
    const gridSize = state?.signals?.length
      ? Math.max(...state.signals.map(s => Math.max(s.x, s.y)), 100)
      : 500;

    const scale = Math.min(width / (gridSize + 40), height / (gridSize + 40));
    const offsetX = (width - gridSize * scale) / 2;
    const offsetY = (height - gridSize * scale) / 2;

    const toScreen = (x: number, y: number) => ({
      sx: offsetX + x * scale,
      sy: offsetY + y * scale,
    });

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);

    // Grid pattern
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 0.5;
    const gridStep = 50 * scale;
    for (let x = offsetX; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = offsetY; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!state || !state.signals || state.signals.length === 0) {
      ctx.fillStyle = COLORS.text;
      ctx.font = "16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Start a simulation to see traffic flow", width / 2, height / 2);
      ctx.font = "12px Inter, sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Configure parameters and click Start", width / 2, height / 2 + 24);
      return;
    }

    // Draw roads between signals
    ctx.strokeStyle = COLORS.road;
    ctx.lineWidth = 20 * scale / 5;
    ctx.lineCap = "round";
    
    for (const signal of state.signals) {
      const { sx, sy } = toScreen(signal.x, signal.y);
      
      // Horizontal roads
      ctx.beginPath();
      ctx.moveTo(offsetX, sy);
      ctx.lineTo(offsetX + gridSize * scale, sy);
      ctx.stroke();
      
      // Vertical roads
      ctx.beginPath();
      ctx.moveTo(sx, offsetY);
      ctx.lineTo(sx, offsetY + gridSize * scale);
      ctx.stroke();
    }

    // Lane markings (dashed center lines)
    ctx.strokeStyle = COLORS.laneMarking;
    ctx.lineWidth = 1;
    ctx.setLineDash([4 * scale / 5, 8 * scale / 5]);
    
    for (const signal of state.signals) {
      const { sx, sy } = toScreen(signal.x, signal.y);
      ctx.beginPath();
      ctx.moveTo(offsetX, sy);
      ctx.lineTo(offsetX + gridSize * scale, sy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx, offsetY);
      ctx.lineTo(sx, offsetY + gridSize * scale);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw intersections
    for (const signal of state.signals) {
      const { sx, sy } = toScreen(signal.x, signal.y);
      const r = 12 * scale / 5;

      // Intersection box
      ctx.fillStyle = COLORS.intersection;
      ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
      ctx.strokeStyle = "#4a4a6a";
      ctx.lineWidth = 1;
      ctx.strokeRect(sx - r, sy - r, r * 2, r * 2);

      // Signal lights
      const nsPhase = signal.phases?.NS || signal.phases?.["NS"] || "RED";
      const ewPhase = signal.phases?.EW || signal.phases?.["EW"] || "RED";

      // NS signal (top/bottom)
      drawSignalLight(ctx, sx - r - 6, sy - 4, nsPhase as string, scale);
      // EW signal (left/right)
      drawSignalLight(ctx, sx - 4, sy - r - 6, ewPhase as string, scale);
    }

    // Draw vehicles
    for (const vehicle of state.vehicles) {
      const { sx, sy } = toScreen(vehicle.x, vehicle.y);
      const color = COLORS.vehicle[vehicle.direction] || "#60a5fa";

      ctx.fillStyle = color;
      ctx.globalAlpha = vehicle.waiting ? 0.6 : 1;

      const vSize = 4 * scale / 5;

      if (vehicle.direction === "N" || vehicle.direction === "S") {
        ctx.fillRect(sx - vSize / 2, sy - vSize, vSize, vSize * 2);
      } else {
        ctx.fillRect(sx - vSize, sy - vSize / 2, vSize * 2, vSize);
      }

      // Headlights
      ctx.fillStyle = "#fef3c7";
      const hl = 1.5 * scale / 5;
      switch (vehicle.direction) {
        case "N":
          ctx.fillRect(sx - vSize / 2, sy - vSize - hl, vSize, hl);
          break;
        case "S":
          ctx.fillRect(sx - vSize / 2, sy + vSize, vSize, hl);
          break;
        case "E":
          ctx.fillRect(sx + vSize, sy - vSize / 2, hl, vSize);
          break;
        case "W":
          ctx.fillRect(sx - vSize - hl, sy - vSize / 2, hl, vSize);
          break;
      }

      ctx.globalAlpha = 1;
    }

    // HUD overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(8, 8, 160, 60);
    ctx.strokeStyle = "#4a4a6a";
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, 160, 60);
    
    ctx.fillStyle = COLORS.text;
    ctx.font = "bold 11px Inter, monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Tick: ${state.tick}`, 16, 26);
    ctx.fillText(`Vehicles: ${state.vehicles.length}`, 16, 42);
    ctx.fillText(
      `Mode: ${state.signals[0]?.phases ? "Active" : "Idle"}`,
      16,
      58,
    );

    // Legend
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(width - 130, 8, 122, 80);
    ctx.strokeStyle = "#4a4a6a";
    ctx.strokeRect(width - 130, 8, 122, 80);
    
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.fillStyle = COLORS.text;
    ctx.fillText("Direction", width - 122, 24);
    
    const dirs: Array<{ label: string; color: string }> = [
      { label: "North", color: COLORS.vehicle.N },
      { label: "South", color: COLORS.vehicle.S },
      { label: "East", color: COLORS.vehicle.E },
      { label: "West", color: COLORS.vehicle.W },
    ];
    dirs.forEach((d, i) => {
      ctx.fillStyle = d.color;
      ctx.fillRect(width - 122, 30 + i * 14, 8, 8);
      ctx.fillStyle = COLORS.text;
      ctx.font = "10px Inter, sans-serif";
      ctx.fillText(d.label, width - 110, 38 + i * 14);
    });
  }, [state]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[350px] md:min-h-[420px] rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: "auto" }}
      />
    </div>
  );
}

function drawSignalLight(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  phase: string,
  scale: number,
) {
  const r = 3 * scale / 5;
  const color = COLORS.signal[phase as keyof typeof COLORS.signal] || COLORS.signal.RED;

  // Glow effect
  ctx.beginPath();
  ctx.arc(x + r, y + r, r * 2, 0, Math.PI * 2);
  ctx.fillStyle = color + "30";
  ctx.fill();

  // Light
  ctx.beginPath();
  ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Highlight
  ctx.beginPath();
  ctx.arc(x + r - 1, y + r - 1, r * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fill();
}
