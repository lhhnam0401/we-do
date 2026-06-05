import { atom } from "jotai";
import type { Plan, PlanStatus } from "../types";

export const plansAtom = atom<Plan[]>([]);
export const planFilterAtom = atom<"all" | PlanStatus>("all");

export const filteredPlansAtom = atom((get) => {
  const plans = get(plansAtom);
  const filter = get(planFilterAtom);
  if (filter === "all") return plans;
  return plans.filter((p) => p.status === filter);
});
