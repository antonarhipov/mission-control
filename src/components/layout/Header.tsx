import { GitBranch } from 'lucide-react';
import { useDataModel } from '@/hooks/useDataModel';

export function Header() {
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
