const PASSPHRASE_PREFIX = "itms_passphrase_";
const SESSION_VERIFIED_KEY = "itms_passphrase_verified";

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function storageKey(email: string): string {
  return `${PASSPHRASE_PREFIX}${email}`;
}

export function hasPassphrase(email: string): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(storageKey(email));
}

export async function setPassphrase(
  email: string,
  passphrase: string,
): Promise<void> {
  const hash = await sha256(passphrase);
  localStorage.setItem(storageKey(email), hash);
}

export async function verifyPassphrase(
  email: string,
  passphrase: string,
): Promise<boolean> {
  const stored = localStorage.getItem(storageKey(email));
  if (!stored) return false;
  const hash = await sha256(passphrase);
  return hash === stored;
}

export function clearPassphrase(email: string): void {
  localStorage.removeItem(storageKey(email));
}

export function markSessionVerified(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_VERIFIED_KEY, "true");
}

export function isSessionVerified(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_VERIFIED_KEY) === "true";
}

export function clearSessionVerified(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_VERIFIED_KEY);
}

const DEMO_PASSPHRASES: Record<string, string> = {
  "admin@itms.com": "admin-secure-phrase",
  "operator@itms.com": "operator-secure-phrase",
  "viewer@itms.com": "viewer-secure-phrase",
};

export async function initDemoPassphrases(): Promise<void> {
  for (const [email, passphrase] of Object.entries(DEMO_PASSPHRASES)) {
    if (!hasPassphrase(email)) {
      await setPassphrase(email, passphrase);
    }
  }
}

export function getDemoPassphrase(email: string): string | undefined {
  return DEMO_PASSPHRASES[email];
}
