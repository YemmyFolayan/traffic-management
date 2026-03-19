"use client";

import { Badge } from "@/components/ui/badge";

export function DemoDataNotice({
  show,
  message = "Sample data — connect the API for live data.",
}: {
  show: boolean;
  message?: string;
}) {
  if (!show) return null;
  return (
    <div
      className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-sm text-muted-foreground"
      role="status"
    >
      <Badge
        variant="outline"
        className="shrink-0 border-amber-500/40 font-normal text-amber-800 dark:text-amber-400"
      >
        Demo Mode
      </Badge>
      <span>{message}</span>
    </div>
  );
}
