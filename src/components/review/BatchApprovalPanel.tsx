import { useState } from 'react';
import { CheckCircle, X, CheckSquare, Square } from 'lucide-react';
import type { Approval } from '@/types';

interface BatchApprovalPanelProps {
  approvals: Approval[];
  onBatchApprove: (approvalIds: string[]) => void;
  onClose: () => void;
}

export function BatchApprovalPanel({
  approvals,
  onBatchApprove,
  onClose,
}: BatchApprovalPanelProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Only show high-confidence pending approvals
  const eligibleApprovals = approvals.filter(
    a => a.status === 'pending' && (a.confidence || 0) >= 90
  );

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(eligibleApprovals.map(a => a.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const handleBatchApprove = () => {
    if (selectedIds.length > 0) {
      onBatchApprove(selectedIds);
      setSelectedIds([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-0 rounded-lg border border-border-1 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-border-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-text-1 mb-2">
                Batch Approval
              </h2>
              <p className="text-sm text-text-3">
                Select high-confidence items to approve multiple changes at once
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-bg-1 rounded transition-colors"
            >
              <X className="w-5 h-5 text-text-3" />
            </button>
          </div>

          {/* Stats and Select All */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-1">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-text-3">Eligible:</span>
                <span className="ml-2 font-semibold text-text-1">{eligibleApprovals.length}</span>
              </div>
              <div>
                <span className="text-text-3">Selected:</span>
                <span className="ml-2 font-semibold text-accent-blue">{selectedIds.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                disabled={selectedIds.length === eligibleApprovals.length}
                className="px-3 py-1.5 text-xs font-medium text-accent-blue hover:bg-accent-blue/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                disabled={selectedIds.length === 0}
                className="px-3 py-1.5 text-xs font-medium text-text-2 hover:bg-bg-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deselect All
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6">
          {eligibleApprovals.length === 0 ? (
            <div className="flex items-center justify-center h-full text-text-3">
              <div className="text-center space-y-2">
                <CheckCircle className="w-12 h-12 mx-auto opacity-50" />
                <p>No high-confidence items available</p>
                <p className="text-xs">Only changes with 90%+ confidence can be batch approved</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {eligibleApprovals.map(approval => {
                const isSelected = selectedIds.includes(approval.id);

                return (
                  <button
                    key={approval.id}
                    onClick={() => toggleSelection(approval.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-accent-blue/10 border-accent-blue'
                        : 'bg-bg-1 border-border-1 hover:border-border-2'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 mt-0.5">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-accent-blue" />
                        ) : (
                          <Square className="w-5 h-5 text-text-3" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Title and Type */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium text-text-1 line-clamp-2 flex-1">
                            {approval.title}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-accent-green" />
                            <span className="text-xs font-semibold text-accent-green">
                              {approval.confidence}%
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        {approval.description && (
                          <p className="text-xs text-text-3 line-clamp-2">
                            {approval.description}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center gap-3 text-xs text-text-3">
                          <span className="capitalize">{approval.type}</span>
                          {approval.affectedFiles && approval.affectedFiles.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{approval.affectedFiles.length} file{approval.affectedFiles.length !== 1 ? 's' : ''}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-border-1 bg-bg-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBatchApprove}
              disabled={selectedIds.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Approve {selectedIds.length} Item{selectedIds.length !== 1 ? 's' : ''}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="mt-3 text-xs text-text-3 text-center">
            Only high-confidence changes (90%+) are available for batch approval
          </p>
        </div>
      </div>
    </div>
  );
}
