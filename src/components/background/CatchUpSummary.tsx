import { CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';

interface CatchUpItem {
  id: string;
  type: 'completed' | 'pending' | 'blocked';
  missionName: string;
  description: string;
  timestamp: string;
}

interface CatchUpSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  lastVisit: string;
  items: CatchUpItem[];
  onViewMission: (missionId: string) => void;
}

export function CatchUpSummary({
  isOpen,
  onClose,
  lastVisit,
  items,
  onViewMission,
}: CatchUpSummaryProps) {
  if (!isOpen) return null;

  const completed = items.filter(i => i.type === 'completed');
  const pending = items.filter(i => i.type === 'pending');
  const blocked = items.filter(i => i.type === 'blocked');

  const lastVisitDate = new Date(lastVisit);
  const now = new Date();
  const timeDiff = now.getTime() - lastVisitDate.getTime();
  const hoursAway = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesAway = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  const getTimeAwayText = () => {
    if (hoursAway > 24) {
      const days = Math.floor(hoursAway / 24);
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
    if (hoursAway > 0) {
      return `${hoursAway} ${hoursAway === 1 ? 'hour' : 'hours'}`;
    }
    return `${minutesAway} ${minutesAway === 1 ? 'minute' : 'minutes'}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-0 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-border-1">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-1 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-1 mb-1">
                Welcome Back! 👋
              </h2>
              <p className="text-sm text-text-3">
                You've been away for {getTimeAwayText()}. Here's what happened:
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-1 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-text-3" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-border-1">
            <div className="text-center p-4 bg-accent-green/10 rounded-lg border border-accent-green/30">
              <div className="text-3xl font-bold text-accent-green mb-1">
                {completed.length}
              </div>
              <div className="text-xs text-text-3 uppercase tracking-wide">
                Completed
              </div>
            </div>
            <div className="text-center p-4 bg-accent-amber/10 rounded-lg border border-accent-amber/30">
              <div className="text-3xl font-bold text-accent-amber mb-1">
                {pending.length}
              </div>
              <div className="text-xs text-text-3 uppercase tracking-wide">
                Pending Review
              </div>
            </div>
            <div className="text-center p-4 bg-accent-red/10 rounded-lg border border-accent-red/30">
              <div className="text-3xl font-bold text-accent-red mb-1">
                {blocked.length}
              </div>
              <div className="text-xs text-text-3 uppercase tracking-wide">
                Blocked
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6 space-y-6">
            {/* Blocked Items */}
            {blocked.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-accent-red" />
                  Needs Your Attention ({blocked.length})
                </h3>
                <div className="space-y-2">
                  {blocked.map(item => (
                    <div
                      key={item.id}
                      className="p-4 bg-accent-red/5 border border-accent-red/20 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-text-1 mb-1">
                            {item.missionName}
                          </h4>
                          <p className="text-xs text-text-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <AlertCircle className="w-4 h-4 text-accent-red flex-shrink-0 ml-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-3">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            onViewMission(item.id);
                            onClose();
                          }}
                          className="px-3 py-1 bg-accent-red hover:bg-accent-red/80 text-white rounded text-xs font-medium transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Items */}
            {pending.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-amber" />
                  Pending Review ({pending.length})
                </h3>
                <div className="space-y-2">
                  {pending.map(item => (
                    <div
                      key={item.id}
                      className="p-4 bg-bg-1 border border-border-1 rounded-lg hover:border-border-2 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-text-1 mb-1">
                            {item.missionName}
                          </h4>
                          <p className="text-xs text-text-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <Clock className="w-4 h-4 text-accent-amber flex-shrink-0 ml-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-3">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            onViewMission(item.id);
                            onClose();
                          }}
                          className="px-3 py-1 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded text-xs font-medium transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Items */}
            {completed.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-green" />
                  Completed ({completed.length})
                </h3>
                <div className="space-y-2">
                  {completed.map(item => (
                    <div
                      key={item.id}
                      className="p-4 bg-accent-green/5 border border-accent-green/20 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-text-1 mb-1">
                            {item.missionName}
                          </h4>
                          <p className="text-xs text-text-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-accent-green flex-shrink-0 ml-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-3">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            onViewMission(item.id);
                            onClose();
                          }}
                          className="px-3 py-1 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded text-xs font-medium transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-1 bg-bg-1">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors"
          >
            Got it, let's continue
          </button>
        </div>
      </div>
    </div>
  );
}
