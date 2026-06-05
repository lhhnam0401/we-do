import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { filteredPlansAtom } from "../atoms/plans";
import { usePlans } from "../hooks/usePlans";
import { FilterTabs } from "../components/plans/FilterTabs";
import { PlanCard } from "../components/plans/PlanCard";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";

export function DashboardPage() {
  const navigate = useNavigate();
  const plans = useAtomValue(filteredPlansAtom);
  const { fetchPlans } = usePlans();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8 text-rose-400" />
      </div>
    );
  }

  return (
    <div className="px-4 py-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Our Plans</h1>
        <Button size="sm" onClick={() => navigate("/plans/new")}>+ New</Button>
      </div>

      <FilterTabs />

      <div className="mt-4 flex flex-col gap-3">
        {plans.length === 0 ? (
          <EmptyState
            emoji="🌱"
            title="No plans yet"
            description="Start by creating your first shared plan together!"
            action={<Button onClick={() => navigate("/plans/new")}>Create a plan</Button>}
          />
        ) : (
          plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
        )}
      </div>
    </div>
  );
}
