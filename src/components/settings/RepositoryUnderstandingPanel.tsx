import { useState } from 'react';
import { Folder, TrendingUp, FileCode, Layers, RefreshCw } from 'lucide-react';
import type { RepositoryUnderstanding } from '@/types';

interface RepositoryUnderstandingPanelProps {
  repositories: {
    id: string;
    name: string;
    path: string;
    understanding?: RepositoryUnderstanding;
  }[];
  onRefreshUnderstanding: (repoId: string) => void;
}

export function RepositoryUnderstandingPanel({
  repositories,
  onRefreshUnderstanding,
}: RepositoryUnderstandingPanelProps) {
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(
    repositories.length > 0 ? repositories[0].id : null
  );

  const selectedRepo = repositories.find(r => r.id === selectedRepoId);
  const understanding = selectedRepo?.understanding;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-accent-green';
    if (confidence >= 60) return 'text-accent-amber';
    return 'text-accent-red';
  };

  const getConfidenceBarColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-accent-green';
    if (confidence >= 60) return 'bg-accent-amber';
    return 'bg-accent-red';
  };

  return (
    <div className="flex h-full bg-bg-0">
      {/* Left: Repository List */}
      <div className="w-64 border-r border-border-1 overflow-y-auto">
        <div className="p-4 border-b border-border-1">
          <h3 className="text-sm font-semibold text-text-1 uppercase tracking-wide">
            Repositories
          </h3>
        </div>
        <div className="p-2">
          {repositories.map(repo => (
            <button
              key={repo.id}
              onClick={() => setSelectedRepoId(repo.id)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                selectedRepoId === repo.id
                  ? 'bg-accent-blue/10 text-accent-blue'
                  : 'hover:bg-bg-1 text-text-1'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{repo.name}</div>
                  <div className="text-xs text-text-3 truncate">{repo.path}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Understanding Details */}
      {selectedRepo ? (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-1">
              <div className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-accent-blue" />
                <div>
                  <h2 className="text-xl font-semibold text-text-1">{selectedRepo.name}</h2>
                  <div className="text-sm text-text-3">{selectedRepo.path}</div>
                </div>
              </div>
              <button
                onClick={() => onRefreshUnderstanding(selectedRepo.id)}
                className="flex items-center gap-2 px-3 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            {understanding ? (
              <>
                {/* Confidence Score */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                    Understanding Confidence
                  </h3>
                  <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-3">Overall Confidence</span>
                      <span className={`text-lg font-semibold ${getConfidenceColor(understanding.confidence)}`}>
                        {understanding.confidence}%
                      </span>
                    </div>
                    <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getConfidenceBarColor(understanding.confidence)} rounded-full transition-all`}
                        style={{ width: `${understanding.confidence}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-3 mt-2">
                      {understanding.confidence >= 80
                        ? 'High confidence - comprehensive understanding'
                        : understanding.confidence >= 60
                        ? 'Medium confidence - may need more analysis'
                        : 'Low confidence - limited understanding'}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                    Repository Summary
                  </h3>
                  <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
                    <p className="text-sm text-text-1 leading-relaxed whitespace-pre-wrap">
                      {understanding.summary}
                    </p>
                  </div>
                </div>

                {/* Key Patterns */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent-green" />
                    <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                      Key Patterns
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {understanding.patterns.map((pattern, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-bg-1 rounded border border-border-1"
                      >
                        <span className="text-sm text-text-1">{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conventions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-accent-blue" />
                    <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                      Conventions Learned
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {understanding.conventions.map((convention, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-bg-1 rounded border border-border-1"
                      >
                        <div className="text-xs text-text-3 capitalize mb-1">{convention.category}</div>
                        <div className="text-sm text-text-1">{convention.description}</div>
                        {convention.example && (
                          <pre className="mt-2 p-2 bg-bg-2 rounded text-xs text-text-2 font-mono overflow-x-auto">
                            {convention.example}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architecture Model */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-accent-purple" />
                    <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                      Architecture
                    </h3>
                  </div>
                  <div className="bg-bg-1 rounded-lg p-4 border border-border-1 space-y-3">
                    <div>
                      <div className="text-xs text-text-3 mb-1">Type</div>
                      <div className="text-sm font-medium text-text-1 capitalize">
                        {understanding.architecture.type}
                      </div>
                    </div>
                    {understanding.architecture.layers && understanding.architecture.layers.length > 0 && (
                      <div>
                        <div className="text-xs text-text-3 mb-2">Layers</div>
                        <div className="space-y-2">
                          {understanding.architecture.layers.map((layer, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 bg-bg-2 rounded text-sm text-text-1"
                            >
                              {layer}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {understanding.architecture.keyComponents && understanding.architecture.keyComponents.length > 0 && (
                      <div>
                        <div className="text-xs text-text-3 mb-2">Key Components</div>
                        <div className="space-y-1">
                          {understanding.architecture.keyComponents.map((component, index) => (
                            <div
                              key={index}
                              className="text-sm text-text-2 font-mono"
                            >
                              {component}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
                    <div className="text-xs text-text-3 mb-1">Last Analyzed</div>
                    <div className="text-sm font-medium text-text-1">
                      {new Date(understanding.analyzedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
                    <div className="text-xs text-text-3 mb-1">Patterns</div>
                    <div className="text-2xl font-bold text-text-1">
                      {understanding.patterns.length}
                    </div>
                  </div>
                  <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
                    <div className="text-xs text-text-3 mb-1">Conventions</div>
                    <div className="text-2xl font-bold text-text-1">
                      {understanding.conventions.length}
                    </div>
                  </div>
                  <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
                    <div className="text-xs text-text-3 mb-1">Confidence</div>
                    <div className={`text-2xl font-bold ${getConfidenceColor(understanding.confidence)}`}>
                      {understanding.confidence}%
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-text-3">
                <div className="text-center">
                  <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="mb-4">No understanding data available</p>
                  <button
                    onClick={() => onRefreshUnderstanding(selectedRepo.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Analyze Repository</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-text-3">
          <div className="text-center">
            <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select a repository to view understanding</p>
          </div>
        </div>
      )}
    </div>
  );
}
