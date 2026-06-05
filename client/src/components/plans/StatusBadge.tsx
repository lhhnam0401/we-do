import type { PlanStatus } from "../../types";

export function StatusBadge({ status }: { status: PlanStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        status === "done" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {status === "done" ? "✅ Done" : "🕐 Pending"}
    </span>
  );
}
