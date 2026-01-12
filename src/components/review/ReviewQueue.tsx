import { FileText, GitCommit, Zap, CheckCircle, Filter } from 'lucide-react';
import { useState } from 'react';
import type { Approval } from '@/types';

interface ReviewQueueProps {
  approvals: Approval[];
  selectedApprovalId: string | null;
  onSelectApproval: (approvalId: string) => void;
}

export function ReviewQueue({ approvals, selectedApprovalId, onSelectApproval }: ReviewQueueProps) {
  const [filterType, setFilterType] = useState<'all' | Approval['type']>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'confidence' | 'recent'>('priority');

  // Filter approvals
  const filteredApprovals = approvals.filter(approval => {
    if (approval.status !== 'pending') return false; // Only show pending
    if (filterType === 'all') return true;
    return approval.type === filterType;
  });

  // Sort approvals
  const sortedApprovals = [...filteredApprovals].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = a.priority ? priorityOrder[a.priority] : 0;
      const bPriority = b.priority ? priorityOrder[b.priority] : 0;
      return bPriority - aPriority;
    } else if (sortBy === 'confidence') {
      return (a.confidence || 0) - (b.confidence || 0); // Low confidence first
    } else {
      // Sort by timestamp (most recent first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  // Group by type
  const groupedApprovals = sortedApprovals.reduce((acc, approval) => {
    if (!acc[approval.type]) acc[approval.type] = [];
    acc[approval.type].push(approval);
    return acc;
  }, {} as Record<string, Approval[]>);

  type ApprovalType = 'decision' | 'change' | 'action';

  const typeLabels: Record<ApprovalType, string> = {
    decision: 'Decisions',
    change: 'Changes',
    action: 'Actions',
  };

  const typeIcons: Record<ApprovalType, React.ReactNode> = {
    decision: <FileText className="w-4 h-4" />,
    change: <GitCommit className="w-4 h-4" />,
    action: <Zap className="w-4 h-4" />,
  };

  const typeOrder: ApprovalType[] = ['decision', 'change', 'action'];

  // Get priority badge color
  const getPriorityColor = (priority?: 'low' | 'medium' | 'high' | 'critical') => {
    switch (priority) {
      case 'critical':
        return 'bg-accent-red/20 text-accent-red';
      case 'high':
        return 'bg-accent-amber/20 text-accent-amber';
      case 'medium':
        return 'bg-accent-blue/20 text-accent-blue';
      case 'low':
        return 'bg-text-3/20 text-text-3';
      default:
        return 'bg-bg-2 text-text-3';
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border-1">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-text-1 mb-1">Review Queue</h2>
            <p className="text-sm text-text-3">{sortedApprovals.length} items pending</p>
          </div>
          <CheckCircle className="w-5 h-5 text-accent-amber" />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-3" />
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-2 text-text-2 hover:bg-bg-3'
              }`}
            >
              All ({approvals.filter(a => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterType('decision')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filterType === 'decision'
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-2 text-text-2 hover:bg-bg-3'
              }`}
            >
              Decisions ({approvals.filter(a => a.status === 'pending' && a.type === 'decision').length})
            </button>
            <button
              onClick={() => setFilterType('change')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filterType === 'change'
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-2 text-text-2 hover:bg-bg-3'
              }`}
            >
              Changes ({approvals.filter(a => a.status === 'pending' && a.type === 'change').length})
            </button>
            <button
              onClick={() => setFilterType('action')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filterType === 'action'
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-2 text-text-2 hover:bg-bg-3'
              }`}
            >
              Actions ({approvals.filter(a => a.status === 'pending' && a.type === 'action').length})
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-bg-1 border border-border-1 rounded text-xs text-text-2 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          >
            <option value="priority">By Priority</option>
            <option value="confidence">By Confidence (Low First)</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto">
        {sortedApprovals.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-3">
            <div className="text-center space-y-2">
              <CheckCircle className="w-12 h-12 mx-auto opacity-50" />
              <p>No pending items</p>
              <p className="text-xs">All caught up!</p>
            </div>
          </div>
        ) : filterType === 'all' ? (
          // Grouped view
          <div className="p-4 space-y-4">
            {typeOrder.map(type => {
              const items = groupedApprovals[type];
              if (!items || items.length === 0) return null;

              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-text-2">
                    {typeIcons[type]}
                    <span>{typeLabels[type]}</span>
                    <span className="text-xs text-text-3">({items.length})</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(approval => (
                      <button
                        key={approval.id}
                        onClick={() => onSelectApproval(approval.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedApprovalId === approval.id
                            ? 'bg-accent-blue/10 border-accent-blue'
                            : 'bg-bg-1 border-border-1 hover:bg-bg-2'
                        }`}
                      >
                        <div className="space-y-2">
                          {/* Title and Priority */}
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-medium text-text-1 line-clamp-2 flex-1">
                              {approval.title}
                            </h3>
                            {approval.priority && (
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                                {approval.priority}
                              </span>
                            )}
                          </div>

                          {/* Metadata */}
                          <div className="flex items-center gap-3 text-xs text-text-3">
                            <span>{formatTime(approval.timestamp)}</span>
                            {approval.confidence !== undefined && (
                              <>
                                <span>•</span>
                                <span className={approval.confidence < 70 ? 'text-accent-red font-medium' : ''}>
                                  {approval.confidence}% confidence
                                </span>
                              </>
                            )}
                            {approval.agentId && (
                              <>
                                <span>•</span>
                                <span>Agent</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Filtered view
          <div className="p-4 space-y-2">
            {sortedApprovals.map(approval => (
              <button
                key={approval.id}
                onClick={() => onSelectApproval(approval.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedApprovalId === approval.id
                    ? 'bg-accent-blue/10 border-accent-blue'
                    : 'bg-bg-1 border-border-1 hover:bg-bg-2'
                }`}
              >
                <div className="space-y-2">
                  {/* Title and Priority */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-text-1 line-clamp-2 flex-1">
                      {approval.title}
                    </h3>
                    {approval.priority && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                        {approval.priority}
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-xs text-text-3">
                    <span>{formatTime(approval.timestamp)}</span>
                    {approval.confidence !== undefined && (
                      <>
                        <span>•</span>
                        <span className={approval.confidence < 70 ? 'text-accent-red font-medium' : ''}>
                          {approval.confidence}% confidence
                        </span>
                      </>
                    )}
                    {approval.agentId && (
                      <>
                        <span>•</span>
                        <span>Agent</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
