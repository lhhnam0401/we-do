import { categoryLabel } from "../../lib/utils";

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      {categoryLabel(category)}
    </span>
  );
}
