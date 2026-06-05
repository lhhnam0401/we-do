import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { plansAtom } from "../atoms/plans";
import { usePlans } from "../hooks/usePlans";
import { usePhotos } from "../hooks/usePhotos";
import { PlanForm } from "../components/plans/PlanForm";
import { StatusBadge } from "../components/plans/StatusBadge";
import { CategoryBadge } from "../components/plans/CategoryBadge";
import { PhotoGrid } from "../components/photos/PhotoGrid";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import { Spinner } from "../components/ui/Spinner";
import { formatDate } from "../lib/utils";
import type { Photo, PlanCategory } from "../types";

export function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const plans = useAtomValue(plansAtom);
  const { fetchPlans, updatePlan, updateStatus, deletePlan } = usePlans();
  const { fetchPhotos } = usePhotos(id!);
  const toast = useToast();

  const plan = plans.find((p) => p.id === id);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(!plan);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!plan) {
      fetchPlans().then(() => setLoading(false));
    }
    fetchPhotos().then(setPhotos);
  }, [id]);

  async function handleUpdate(data: { title: string; description: string; category: PlanCategory; target_date: string }) {
    await updatePlan(id!, {
      title: data.title,
      description: data.description || undefined,
      category: data.category,
      target_date: data.target_date || undefined,
    });
    setEditing(false);
    toast.show("Plan updated!", "success");
  }

  async function handleToggleStatus() {
    if (!plan) return;
    await updateStatus(id!, plan.status === "done" ? "pending" : "done");
    toast.show(plan.status === "done" ? "Marked as pending" : "Done! 🎉", "success");
  }

  async function handleDelete() {
    await deletePlan(id!);
    toast.show("Plan deleted", "info");
    navigate("/dashboard");
  }

  async function refreshPhotos() {
    const updated = await fetchPhotos();
    setPhotos(updated);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner className="w-8 h-8 text-rose-400" /></div>;
  }

  if (!plan) {
    return (
      <div className="px-4 py-5 text-center">
        <p className="text-gray-500">Plan not found.</p>
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mt-3">Back to plans</Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate("/dashboard")} className="text-sm text-gray-400">← Plans</button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(true)}>Delete</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{plan.title}</h1>
            {plan.description && <p className="text-gray-500 text-sm mt-1">{plan.description}</p>}
          </div>
          <button
            onClick={handleToggleStatus}
            className={`shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg transition-colors ${
              plan.status === "done" ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-rose-400"
            }`}
          >
            {plan.status === "done" && "✓"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge status={plan.status} />
          <CategoryBadge category={plan.category} />
        </div>

        {plan.target_date && (
          <p className="mt-2 text-xs text-gray-400">📅 Target: {formatDate(plan.target_date)}</p>
        )}
        {plan.completed_at && (
          <p className="mt-1 text-xs text-green-500">✅ Completed: {formatDate(plan.completed_at)}</p>
        )}
      </div>

      <PhotoGrid planId={id!} photos={photos} onRefresh={refreshPhotos} />

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Plan">
        <PlanForm
          initial={plan}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          submitLabel="Save Changes"
        />
      </Modal>

      <Modal open={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Delete Plan?">
        <p className="text-sm text-gray-500 mb-4">This will archive the plan. Are you sure?</p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
