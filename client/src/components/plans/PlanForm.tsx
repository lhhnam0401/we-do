import { useState } from "react";
import type { Plan, PlanCategory } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const CATEGORIES: { value: PlanCategory; label: string }[] = [
  { value: "travel", label: "✈️ Travel" },
  { value: "food", label: "🍽️ Food" },
  { value: "home", label: "🏠 Home" },
  { value: "adventure", label: "🧗 Adventure" },
  { value: "other", label: "📌 Other" },
];

interface Props {
  initial?: Partial<Plan>;
  onSubmit: (data: { title: string; description: string; category: PlanCategory; target_date: string }) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function PlanForm({ initial, onSubmit, onCancel, submitLabel = "Save" }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<PlanCategory>(initial?.category ?? "other");
  const [targetDate, setTargetDate] = useState(initial?.target_date ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    setError("");
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description, category, target_date: targetDate });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Plant a tree 🌳"
        error={error}
        autoFocus
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details..."
          rows={3}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                category === c.value
                  ? "border-rose-400 bg-rose-50 text-rose-600"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Target date (optional)"
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
      />

      <div className="flex gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading} className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
