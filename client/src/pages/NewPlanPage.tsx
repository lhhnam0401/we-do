import { useNavigate } from "react-router-dom";
import { usePlans } from "../hooks/usePlans";
import { PlanForm } from "../components/plans/PlanForm";
import { useToast } from "../components/ui/Toast";
import type { PlanCategory } from "../types";

export function NewPlanPage() {
  const navigate = useNavigate();
  const { createPlan } = usePlans();
  const toast = useToast();

  async function handleSubmit(data: { title: string; description: string; category: PlanCategory; target_date: string }) {
    const plan = await createPlan({
      title: data.title,
      description: data.description || undefined,
      category: data.category,
      target_date: data.target_date || undefined,
    });
    toast.show("Plan created! 🎉", "success");
    navigate(`/plans/${plan.id}`);
  }

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 mb-4">← Back</button>
      <h1 className="text-2xl font-bold mb-5">New Plan</h1>
      <PlanForm onSubmit={handleSubmit} onCancel={() => navigate(-1)} submitLabel="Create Plan" />
    </div>
  );
}
