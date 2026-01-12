import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
      <div className="p-4 bg-accent-red/10 rounded-full mb-4">
        <AlertCircle className="w-12 h-12 text-accent-red" />
      </div>
      <h3 className="text-lg font-semibold text-text-1 mb-2">{title}</h3>
      <p className="text-sm text-text-3 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
