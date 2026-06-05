export function isMobile(): boolean {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    travel: "✈️ Travel",
    food: "🍽️ Food",
    home: "🏠 Home",
    adventure: "🧗 Adventure",
    other: "📌 Other",
  };
  return labels[cat] ?? cat;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}
