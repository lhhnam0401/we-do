import { useAtom, useSetAtom } from "jotai";
import { accessTokenAtom, currentUserAtom } from "../atoms/auth";
import { coupleAtom } from "../atoms/couple";
import { plansAtom } from "../atoms/plans";
import { apiJson } from "../lib/api";
import type { Couple, User } from "../types";

export function useAuth() {
  const [token, setToken] = useAtom(accessTokenAtom);
  const [user, setUser] = useAtom(currentUserAtom);
  const setCouple = useSetAtom(coupleAtom);
  const setPlans = useSetAtom(plansAtom);

  async function register(email: string, password: string, display_name: string) {
    const data = await apiJson<{ access_token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name }),
    });
    setToken(data.access_token);
    const me = await apiJson<User>("/auth/me");
    setUser(me);
    if (me.couple_id) {
      const couple = await apiJson<Couple>("/couples/me");
      setCouple(couple);
    }
  }

  async function login(email: string, password: string) {
    const data = await apiJson<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    const me = await apiJson<User>("/auth/me");
    setUser(me);
    if (me.couple_id) {
      const couple = await apiJson<Couple>("/couples/me");
      setCouple(couple);
    }
  }

  async function logout() {
    await apiJson("/auth/logout", { method: "POST" }).catch(() => {});
    setToken(null);
    setUser(null);
    setCouple(null);
    setPlans([]);
  }

  async function restoreSession() {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
      if (!res.ok) return false;
      const data = await res.json();
      setToken(data.access_token);
      const me = await apiJson<User>("/auth/me");
      setUser(me);
      if (me.couple_id) {
        const couple = await apiJson<Couple>("/couples/me");
        setCouple(couple);
      }
      return true;
    } catch {
      return false;
    }
  }

  return { token, user, login, register, logout, restoreSession };
}
