import { clsx } from 'clsx';
import type { FileDiff } from '@/types';

interface ReasoningPanelProps {
  diff?: FileDiff;
}

export function ReasoningPanel({ diff }: ReasoningPanelProps) {
  if (!diff?.reasoning && !diff?.references && !diff?.testResults) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center text-text-3 p-4">
          <div className="text-2xl mb-2">🤔</div>
          <div className="text-sm">No reasoning context available</div>
          <div className="text-xs mt-1">Select a file with detailed analysis</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-3.5 py-3 border-b border-border-1 shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-2">
          Why This Change?
        </span>
      </div>

      <div className="p-3.5 space-y-5">
        {/* Decision Context */}
        {diff.reasoning && diff.reasoning.length > 0 && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-3 mb-2.5">
              🧠 Decision Context
            </h3>
            <div className="space-y-2">
              {diff.reasoning.map((decision, index) => (
                <div
                  key={index}
                  className="bg-bg-2 border border-border-1 rounded-md p-3"
                >
                  <h4 className="text-xs font-semibold mb-1.5 flex items-center gap-2">
                    <span
                      className={clsx(
                        'text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase',
                        decision.type === 'decision' && 'bg-accent-purple text-white',
                        decision.type === 'rationale' && 'bg-accent-blue text-white',
                        decision.type === 'alternative' && 'bg-accent-amber text-black'
                      )}
                    >
                      {decision.type}
                    </span>
                    {decision.title}
                  </h4>
                  <p className="text-xs text-text-2 leading-relaxed">
                    {decision.description.split(/(`[^`]+`)/).map((part, i) =>
                      part.startsWith('`') ? (
                        <code
                          key={i}
                          className="font-mono text-[11px] bg-bg-3 px-1 py-0.5 rounded text-accent-cyan"
                        >
                          {part.slice(1, -1)}
                        </code>
                      ) : (
                        part
                      )
                    )}
                  </p>
                  {decision.rejected && (
                    <div className="mt-2.5 bg-bg-3 rounded p-2.5 border-l-2 border-accent-amber">
                      <h5 className="text-[11px] font-semibold text-accent-amber mb-1">
                        ❌ {decision.rejected.title}
                      </h5>
                      <p className="text-[11px] text-text-3">{decision.rejected.reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {diff.references && diff.references.length > 0 && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-3 mb-2.5">
              📚 References Used
            </h3>
            <div className="space-y-1">
              {diff.references.map((ref, index) => (
                <a
                  key={index}
                  href={ref.url}
                  className="flex items-center gap-2 text-[11px] text-text-link px-2.5 py-1.5 bg-bg-3 rounded hover:bg-bg-4 transition-colors"
                >
                  {ref.type === 'doc' && '📖'}
                  {ref.type === 'code' && '💾'}
                  {ref.type === 'external' && '🔗'}
                  {ref.title}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Verification */}
        {diff.testResults && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-3 mb-2.5">
              ✅ Verification
            </h3>
            <div className="bg-bg-2 rounded-md p-3 border-l-2 border-accent-green">
              <h4 className="text-xs font-semibold text-accent-green mb-2">
                Tests Passed ({diff.testResults.passed}/{diff.testResults.total})
              </h4>
              <pre className="font-mono text-[10px] text-text-2 leading-relaxed">
                {diff.testResults.name}
                {diff.testResults.tests.map((test) => (
                  <span key={test.name}>
                    {'\n'}└─ {test.name} {test.passed ? '✓' : '✗'}
                  </span>
                ))}
              </pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
