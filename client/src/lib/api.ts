import { getDefaultStore } from "jotai";
import { accessTokenAtom, currentUserAtom } from "../atoms/auth";
import { coupleAtom } from "../atoms/couple";
import { plansAtom } from "../atoms/plans";

const BASE = "/api";
const store = getDefaultStore();

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/auth/refresh`, { method: "POST", credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    store.set(accessTokenAtom, data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
}

export function clearAuth() {
  store.set(accessTokenAtom, null);
  store.set(currentUserAtom, null);
  store.set(coupleAtom, null);
  store.set(plansAtom, []);
  window.location.href = "/login";
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = store.get(accessTokenAtom);
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let res = await fetch(`${BASE}${path}`, { ...options, headers, credentials: "include" });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, { ...options, headers, credentials: "include" });
    } else {
      clearAuth();
    }
  }
  return res;
}

export async function apiJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}
