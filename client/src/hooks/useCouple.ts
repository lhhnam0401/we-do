import { useAtom, useSetAtom } from "jotai";
import { coupleAtom } from "../atoms/couple";
import { currentUserAtom } from "../atoms/auth";
import { apiJson } from "../lib/api";
import type { Couple } from "../types";

export function useCouple() {
  const [couple, setCouple] = useAtom(coupleAtom);
  const setUser = useSetAtom(currentUserAtom);

  async function createCouple(): Promise<Couple> {
    const data = await apiJson<Couple>("/couples/create", { method: "POST" });
    setCouple(data);
    setUser((u) => u ? { ...u, couple_id: data.id } : u);
    return data;
  }

  async function joinCouple(code: string): Promise<Couple> {
    const data = await apiJson<Couple>("/couples/join", {
      method: "POST",
      body: JSON.stringify({ invite_code: code }),
    });
    setCouple(data);
    setUser((u) => u ? { ...u, couple_id: data.id } : u);
    return data;
  }

  async function leaveCouple(): Promise<void> {
    await apiJson("/couples/leave", { method: "DELETE" });
    setCouple(null);
    setUser((u) => u ? { ...u, couple_id: null } : u);
  }

  return { couple, createCouple, joinCouple, leaveCouple };
}
