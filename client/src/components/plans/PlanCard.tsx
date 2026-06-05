import { useNavigate } from "react-router-dom";
import type { Plan } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";
import { formatDate, daysUntil } from "../../lib/utils";
import { usePlans } from "../../hooks/usePlans";
import { useToast } from "../ui/Toast";

interface Props {
  plan: Plan;
}

export function PlanCard({ plan }: Props) {
  const navigate = useNavigate();
  const { updateStatus } = usePlans();
  const toast = useToast();
  const days = daysUntil(plan.target_date);

  async function toggleStatus(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await updateStatus(plan.id, plan.status === "done" ? "pending" : "done");
      toast.show(plan.status === "done" ? "Marked as pending" : "Marked as done! 🎉", "success");
    } catch {
      toast.show("Failed to update status", "error");
    }
  }

  return (
    <div
      onClick={() => navigate(`/plans/${plan.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-tight">{plan.title}</h3>
        <button
          onClick={toggleStatus}
          className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
            plan.status === "done"
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-rose-400"
          }`}
        >
          {plan.status === "done" && "✓"}
        </button>
      </div>

      {plan.description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{plan.description}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
        <StatusBadge status={plan.status} />
        <CategoryBadge category={plan.category} />
        {plan.target_date && (
          <span className={`text-xs ${days !== null && days < 0 ? "text-red-500" : days !== null && days <= 7 ? "text-orange-500" : "text-gray-400"}`}>
            {days !== null && days < 0
              ? `${Math.abs(days)}d overdue`
              : days === 0
              ? "Today!"
              : days !== null
              ? `${days}d left`
              : formatDate(plan.target_date)}
          </span>
        )}
      </div>
    </div>
  );
}
