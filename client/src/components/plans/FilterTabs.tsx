import { useAtom } from "jotai";
import { planFilterAtom } from "../../atoms/plans";

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "done", label: "Done" },
] as const;

export function FilterTabs() {
  const [filter, setFilter] = useAtom(planFilterAtom);

  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => setFilter(t.value)}
          className={`flex-1 py-1.5 text-sm rounded-lg font-medium transition-colors ${
            filter === t.value ? "bg-white text-rose-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
