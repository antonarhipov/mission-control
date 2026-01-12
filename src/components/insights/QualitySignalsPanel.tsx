import { CheckCircle2, XCircle, AlertTriangle, Shield, Bug, Zap } from 'lucide-react';

interface QualitySignalsPanelProps {
  tests: {
    total: number;
    passing: number;
    failing: number;
    skipped: number;
  };
  coverage: {
    overall: number; // 0-100
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  lint: {
    errors: number;
    warnings: number;
    info: number;
  };
  security: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  performance: {
    score: number; // 0-100
    issues: number;
  };
}

export function QualitySignalsPanel({
  tests,
  coverage,
  lint,
  security,
  performance,
}: QualitySignalsPanelProps) {
  const testPassRate = tests.total > 0
    ? Math.round((tests.passing / tests.total) * 100)
    : 0;

  const getCoverageColor = (percent: number) => {
    if (percent >= 80) return 'text-accent-green';
    if (percent >= 60) return 'text-accent-amber';
    return 'text-accent-red';
  };

  const getCoverageBarColor = (percent: number) => {
    if (percent >= 80) return 'bg-accent-green';
    if (percent >= 60) return 'bg-accent-amber';
    return 'bg-accent-red';
  };

  const totalSecurityIssues = security.critical + security.high + security.medium + security.low;
  const totalLintIssues = lint.errors + lint.warnings;

  return (
    <div className="bg-bg-0 rounded-lg border border-border-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-1">Quality Signals</h2>
        <Shield className="w-5 h-5 text-accent-cyan" />
      </div>

      {/* Tests */}
      <div>
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
          Test Suite
        </h3>
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="bg-bg-1 rounded-lg p-3 border border-border-1">
            <div className="text-lg font-bold text-text-1">{tests.total}</div>
            <div className="text-xs text-text-3">Total</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-3 border border-accent-green/30">
            <div className="text-lg font-bold text-accent-green">{tests.passing}</div>
            <div className="text-xs text-text-3">Passing</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-3 border border-accent-red/30">
            <div className="text-lg font-bold text-accent-red">{tests.failing}</div>
            <div className="text-xs text-text-3">Failing</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-3 border border-border-1">
            <div className="text-lg font-bold text-text-3">{tests.skipped}</div>
            <div className="text-xs text-text-3">Skipped</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tests.failing > 0 ? (
            <XCircle className="w-4 h-4 text-accent-red" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-accent-green" />
          )}
          <span className="text-sm text-text-2">
            {testPassRate}% pass rate
            {tests.failing > 0 && (
              <span className="text-accent-red font-medium ml-1">
                - {tests.failing} test{tests.failing > 1 ? 's' : ''} failing
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Code Coverage */}
      <div className="pt-4 border-t border-border-1">
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
          Code Coverage
        </h3>
        <div className="space-y-3">
          {/* Overall */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-3">Overall</span>
              <span className={`text-sm font-semibold ${getCoverageColor(coverage.overall)}`}>
                {coverage.overall}%
              </span>
            </div>
            <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${getCoverageBarColor(coverage.overall)} rounded-full transition-all`}
                style={{ width: `${coverage.overall}%` }}
              />
            </div>
          </div>

          {/* Detailed metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-1 rounded p-3 border border-border-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-3">Statements</span>
                <span className={`text-xs font-semibold ${getCoverageColor(coverage.statements)}`}>
                  {coverage.statements}%
                </span>
              </div>
              <div className="h-1 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getCoverageBarColor(coverage.statements)} rounded-full`}
                  style={{ width: `${coverage.statements}%` }}
                />
              </div>
            </div>
            <div className="bg-bg-1 rounded p-3 border border-border-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-3">Branches</span>
                <span className={`text-xs font-semibold ${getCoverageColor(coverage.branches)}`}>
                  {coverage.branches}%
                </span>
              </div>
              <div className="h-1 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getCoverageBarColor(coverage.branches)} rounded-full`}
                  style={{ width: `${coverage.branches}%` }}
                />
              </div>
            </div>
            <div className="bg-bg-1 rounded p-3 border border-border-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-3">Functions</span>
                <span className={`text-xs font-semibold ${getCoverageColor(coverage.functions)}`}>
                  {coverage.functions}%
                </span>
              </div>
              <div className="h-1 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getCoverageBarColor(coverage.functions)} rounded-full`}
                  style={{ width: `${coverage.functions}%` }}
                />
              </div>
            </div>
            <div className="bg-bg-1 rounded p-3 border border-border-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-3">Lines</span>
                <span className={`text-xs font-semibold ${getCoverageColor(coverage.lines)}`}>
                  {coverage.lines}%
                </span>
              </div>
              <div className="h-1 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getCoverageBarColor(coverage.lines)} rounded-full`}
                  style={{ width: `${coverage.lines}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lint Issues */}
      <div className="pt-4 border-t border-border-1">
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
          Code Quality
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-accent-red" />
            <div>
              <div className="text-lg font-bold text-accent-red">{lint.errors}</div>
              <div className="text-xs text-text-3">Errors</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-amber" />
            <div>
              <div className="text-lg font-bold text-accent-amber">{lint.warnings}</div>
              <div className="text-xs text-text-3">Warnings</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent-blue" />
            <div>
              <div className="text-lg font-bold text-accent-blue">{lint.info}</div>
              <div className="text-xs text-text-3">Info</div>
            </div>
          </div>
        </div>
        {totalLintIssues > 0 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-accent-amber/10 rounded border border-accent-amber/30">
            <AlertTriangle className="w-4 h-4 text-accent-amber" />
            <span className="text-xs text-accent-amber">
              {totalLintIssues} lint issue{totalLintIssues > 1 ? 's' : ''} need attention
            </span>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="pt-4 border-t border-border-1">
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
          Security Scan
        </h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-bg-1 rounded-lg p-3 border border-accent-red/50">
            <div className="text-lg font-bold text-accent-red">{security.critical}</div>
            <div className="text-xs text-text-3">Critical</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-3 border border-accent-amber/50">
            <div className="text-lg font-bold text-accent-amber">{security.high}</div>
            <div className="text-xs text-text-3">High</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-3 border border-accent-blue/30">
            <div className="text-lg font-bold text-accent-blue">{security.medium}</div>
            <div className="text-xs text-text-3">Medium</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-3 border border-border-1">
            <div className="text-lg font-bold text-text-3">{security.low}</div>
            <div className="text-xs text-text-3">Low</div>
          </div>
        </div>
        {totalSecurityIssues === 0 ? (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-accent-green/10 rounded border border-accent-green/30">
            <CheckCircle2 className="w-4 h-4 text-accent-green" />
            <span className="text-xs text-accent-green">No security vulnerabilities detected</span>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-accent-red/10 rounded border border-accent-red/30">
            <Shield className="w-4 h-4 text-accent-red" />
            <span className="text-xs text-accent-red font-medium">
              {totalSecurityIssues} security issue{totalSecurityIssues > 1 ? 's' : ''} detected
              {security.critical > 0 && ` (${security.critical} critical)`}
            </span>
          </div>
        )}
      </div>

      {/* Performance */}
      <div className="pt-4 border-t border-border-1">
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
          Performance
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-3">Performance Score</span>
              <span className={`text-sm font-semibold ${getCoverageColor(performance.score)}`}>
                {performance.score}
              </span>
            </div>
            <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${getCoverageBarColor(performance.score)} rounded-full transition-all`}
                style={{ width: `${performance.score}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-amber" />
            <div>
              <div className="text-lg font-bold text-text-1">{performance.issues}</div>
              <div className="text-xs text-text-3">Issues</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
