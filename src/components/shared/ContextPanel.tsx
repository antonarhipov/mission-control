import React from 'react';
import type { TaskContext } from '@/types';

interface ContextPanelProps {
  context: TaskContext | null;
  isLoading?: boolean;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ context, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
        <p className="mt-2 text-sm text-text-3">Loading context...</p>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="p-6 text-center text-text-3">
        <p className="text-sm">No context available for this task.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      {/* Related Tasks Section */}
      {context.relatedTasks.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-2 mb-2">Related Past Tasks</h3>
          <div className="space-y-2">
            {context.relatedTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 bg-bg-2 rounded-md border border-border-1 hover:border-accent-blue/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xs font-medium text-text-1">{task.title}</h4>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                      task.outcome === 'success'
                        ? 'bg-accent-green/20 text-accent-green'
                        : 'bg-accent-amber/20 text-accent-amber'
                    }`}
                  >
                    {task.outcome}
                  </span>
                </div>
                <p className="text-[11px] text-text-2 mb-1.5 leading-relaxed">{task.lessonsLearned}</p>
                <p className="text-[10px] text-text-3">Completed {task.completedAt}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Affected Services Section */}
      {context.affectedServices.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-2 mb-2">Affected Services</h3>
          <div className="space-y-2">
            {context.affectedServices.map((service) => (
              <div
                key={service.id}
                className="p-3 bg-bg-2 rounded-md border border-border-1 hover:border-accent-blue/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-xs font-medium text-text-1">{service.name}</h4>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                      service.criticalityLevel === 'critical'
                        ? 'bg-accent-red/20 text-accent-red'
                        : service.criticalityLevel === 'high'
                        ? 'bg-accent-amber/20 text-accent-amber'
                        : service.criticalityLevel === 'medium'
                        ? 'bg-accent-amber/10 text-accent-amber'
                        : 'bg-bg-3 text-text-3'
                    }`}
                  >
                    {service.criticalityLevel}
                  </span>
                </div>
                <p className="text-[11px] text-text-2 mb-1">{service.description}</p>
                <p className="text-[10px] text-text-3">Owner: {service.owner}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Changes Section */}
      {context.recentChanges.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-2 mb-2">Recent Changes</h3>
          <div className="space-y-2">
            {context.recentChanges.map((change, index) => (
              <div
                key={index}
                className="p-3 bg-bg-2 rounded-md border border-border-1"
              >
                <div className="flex items-start justify-between mb-1">
                  <code className="text-[10px] font-mono text-accent-blue">{change.file}</code>
                  <span className="text-[10px] text-text-3">{change.timestamp}</span>
                </div>
                <p className="text-[11px] text-text-2 mb-1">{change.summary}</p>
                <p className="text-[10px] text-text-3">by {change.author}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Known Issues Section */}
      {context.knownIssues.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-2 mb-2">Known Issues & Workarounds</h3>
          <div className="space-y-2">
            {context.knownIssues.map((issue, index) => (
              <div
                key={index}
                className="p-3 bg-accent-amber/10 rounded-md border border-accent-amber/30"
              >
                <div className="flex items-start mb-2">
                  <svg
                    className="w-3.5 h-3.5 text-accent-amber mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs text-text-1">{issue.description}</p>
                </div>
                <div className="pl-5">
                  <p className="text-[10px] font-medium text-text-2 mb-1">Workaround:</p>
                  <p className="text-[11px] text-text-2 mb-1.5 leading-relaxed">{issue.workaround}</p>
                  <p className="text-[10px] text-text-3">
                    Reported by {issue.reportedBy} • {issue.reportedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Code Patterns Section */}
      {context.codePatterns.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-2 mb-2">Code Patterns</h3>
          <div className="space-y-2">
            {context.codePatterns.map((pattern, index) => (
              <div
                key={index}
                className="p-3 bg-accent-blue/10 rounded-md border border-accent-blue/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xs font-medium text-text-1">{pattern.pattern}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-accent-blue/20 text-accent-blue">
                    {pattern.category}
                  </span>
                </div>
                <p className="text-[11px] text-text-2 mb-2 leading-relaxed">{pattern.description}</p>
                {pattern.example && (
                  <pre className="text-[10px] bg-bg-3 p-2 rounded border border-border-1 overflow-x-auto">
                    <code className="text-text-2">{pattern.example}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
