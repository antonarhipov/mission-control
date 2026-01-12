import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
      <div className="p-4 bg-bg-1 rounded-full mb-4">
        <Icon className="w-12 h-12 text-text-3 opacity-50" />
      </div>
      <h3 className="text-lg font-semibold text-text-1 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-3 max-w-md mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
