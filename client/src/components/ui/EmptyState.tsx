interface Props {
  emoji: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ emoji, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="text-5xl">{emoji}</span>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}
