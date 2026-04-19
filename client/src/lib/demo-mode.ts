/**
 * When NEXT_PUBLIC_DEMO_MODE is set to "true" (e.g. on Netlify), all API
 * calls are skipped and the frontend runs entirely on demo/seed data.
 * This lets the deployed site be fully interactive without a running backend.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
