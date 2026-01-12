import { GitBranch } from 'lucide-react';
import { useDataModel } from '@/hooks/useDataModel';

interface HeaderProps {
  isV3Enabled?: boolean;
  onToggleV3?: () => void;
}

export function Header({ isV3Enabled = false, onToggleV3 }: HeaderProps) {
  const { sessionStats } = useDataModel();

  return (
    <header className="flex items-center justify-between px-4 h-12 bg-bg-1 border-b border-border-1 shrink-0">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-accent-blue to-accent-purple rounded flex items-center justify-center text-xs font-bold">
            MC
          </div>
          <span className="font-semibold text-sm">Mission Control</span>
        </div>

        {/* Workspace selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-2 border border-border-1 rounded-md text-xs">
          <span className="font-mono font-medium">{sessionStats.projectName}</span>
          <span className="flex items-center gap-1 text-text-2">
            <GitBranch className="w-3.5 h-3.5" />
            {sessionStats.activeBranch}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* V2/V3 Toggle */}
        {onToggleV3 && (
          <button
            onClick={onToggleV3}
            className="flex items-center gap-2 px-3 py-1.5 bg-bg-2 hover:bg-bg-3 border border-border-1 rounded-md text-xs font-medium transition-colors"
            title="Toggle between V2 and V3 modes"
          >
            <span className={isV3Enabled ? 'text-text-3' : 'text-accent-blue font-semibold'}>V2</span>
            <div className={`w-8 h-4 rounded-full transition-colors ${isV3Enabled ? 'bg-accent-blue' : 'bg-bg-3'} relative`}>
              <div className={`absolute top-0.5 ${isV3Enabled ? 'right-0.5' : 'left-0.5'} w-3 h-3 bg-white rounded-full transition-all`} />
            </div>
            <span className={isV3Enabled ? 'text-accent-blue font-semibold' : 'text-text-3'}>V3</span>
          </button>
        )}

        {/* Session cost */}
        <div className="flex items-center gap-3 font-mono text-xs px-3 py-1.5 bg-bg-2 rounded-md">
          <span>
            Session: <span className="text-accent-green font-medium">${sessionStats.totalCost.toFixed(2)}</span>
          </span>
          <span className="text-text-3">{(sessionStats.totalTokens / 1000).toFixed(0)}K tokens</span>
        </div>
      </div>
    </header>
  );
}
