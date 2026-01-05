import { GitBranch } from 'lucide-react';
import { sessionStats } from '@/data/mockData';

export function Header() {
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
            {sessionStats.branch}
          </span>
        </div>
      </div>

      {/* Session cost */}
      <div className="flex items-center gap-3 font-mono text-xs px-3 py-1.5 bg-bg-2 rounded-md">
        <span>
          Session: <span className="text-accent-green font-medium">${sessionStats.totalCost.toFixed(2)}</span>
        </span>
        <span className="text-text-3">{(sessionStats.totalTokens / 1000).toFixed(0)}K tokens</span>
      </div>
    </header>
  );
}
