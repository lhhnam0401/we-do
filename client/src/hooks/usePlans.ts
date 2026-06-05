import { useAtom } from "jotai";
import { plansAtom } from "../atoms/plans";
import { apiJson } from "../lib/api";
import type { Plan, PlanCategory, PlanStatus } from "../types";

export function usePlans() {
  const [plans, setPlans] = useAtom(plansAtom);

  async function fetchPlans() {
    const data = await apiJson<Plan[]>("/plans");
    setPlans(data);
  }

  async function createPlan(payload: {
    title: string;
    description?: string;
    category: PlanCategory;
    target_date?: string;
  }) {
    const plan = await apiJson<Plan>("/plans", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setPlans((prev) => [plan, ...prev]);
    return plan;
  }

  async function updatePlan(id: string, payload: Partial<{ title: string; description: string; category: PlanCategory; target_date: string }>) {
    const plan = await apiJson<Plan>(`/plans/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    setPlans((prev) => prev.map((p) => (p.id === id ? plan : p)));
    return plan;
  }

  async function updateStatus(id: string, status: PlanStatus) {
    const plan = await apiJson<Plan>(`/plans/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    setPlans((prev) => prev.map((p) => (p.id === id ? plan : p)));
    return plan;
  }

  async function deletePlan(id: string) {
    await apiJson(`/plans/${id}`, { method: "DELETE" });
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }

  async function refreshPlan(id: string) {
    try {
      const plan = await apiJson<Plan>(`/plans/${id}`);
      setPlans((prev) => {
        const exists = prev.some((p) => p.id === id);
        return exists ? prev.map((p) => (p.id === id ? plan : p)) : [plan, ...prev];
      });
    } catch {
      // plan may have been deleted
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return { plans, fetchPlans, createPlan, updatePlan, updateStatus, deletePlan, refreshPlan };
}
