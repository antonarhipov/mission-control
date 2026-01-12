import { useState } from 'react';
import { Eye, Filter } from 'lucide-react';
import { ObservationCard } from './ObservationCard';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import type { Observation } from '@/types';

interface ObservationsPanelProps {
  onObservationAction: (observationId: string, action: 'yes' | 'no' | 'ask' | 'dismiss') => void;
}

export function ObservationsPanel({ onObservationAction }: ObservationsPanelProps) {
  const { observations } = useV3DataModel();
  const [filterType, setFilterType] = useState<'all' | Observation['type']>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'confidence'>('recent');

  // Filter observations
  const filteredObservations = observations.filter(obs => {
    if (obs.acknowledged) return false; // Don't show acknowledged
    if (filterType === 'all') return true;
    return obs.type === filterType;
  });

  // Sort observations
  const sortedObservations = [...filteredObservations].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      // Sort by confidence (descending)
      return b.confidence - a.confidence;
    }
  });

  // Group by type
  const groupedObservations = sortedObservations.reduce((acc, obs) => {
    if (!acc[obs.type]) acc[obs.type] = [];
    acc[obs.type].push(obs);
    return acc;
  }, {} as Record<string, Observation[]>);

  const typeLabels: Record<Observation['type'], string> = {
    'pattern-detected': 'Patterns',
    'risk-identified': 'Risks',
    'opportunity': 'Opportunities',
    'inconsistency': 'Inconsistencies',
    'dependency-update': 'Dependency Updates',
    'test-coverage': 'Test Coverage',
    'performance': 'Performance',
    'security': 'Security',
  };

  const typeOrder: Array<Observation['type']> = [
    'risk-identified',
    'security',
    'performance',
    'opportunity',
    'pattern-detected',
    'inconsistency',
    'test-coverage',
    'dependency-update',
  ];

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-border-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-text-1 mb-1">Agent Observations</h2>
            <p className="text-sm text-text-3">
              Proactive insights and suggestions from your agent team
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-accent-cyan" />
            <span className="text-2xl font-bold text-accent-cyan">{sortedObservations.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-text-3" />
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-1 text-text-2 hover:bg-bg-2'
              }`}
            >
              All ({observations.filter(o => !o.acknowledged).length})
            </button>
            <button
              onClick={() => setFilterType('risk-identified')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filterType === 'risk-identified'
                  ? 'bg-accent-amber text-white'
                  : 'bg-bg-1 text-text-2 hover:bg-bg-2'
              }`}
            >
              Risks ({observations.filter(o => !o.acknowledged && o.type === 'risk-identified').length})
            </button>
            <button
              onClick={() => setFilterType('opportunity')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filterType === 'opportunity'
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-1 text-text-2 hover:bg-bg-2'
              }`}
            >
              Opportunities ({observations.filter(o => !o.acknowledged && o.type === 'opportunity').length})
            </button>
            <button
              onClick={() => setFilterType('security')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filterType === 'security'
                  ? 'bg-accent-red text-white'
                  : 'bg-bg-1 text-text-2 hover:bg-bg-2'
              }`}
            >
              Security ({observations.filter(o => !o.acknowledged && o.type === 'security').length})
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'confidence')}
            className="px-3 py-1.5 bg-bg-1 border border-border-1 rounded text-xs text-text-2 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          >
            <option value="recent">Most Recent</option>
            <option value="confidence">By Confidence</option>
          </select>
        </div>
      </div>

      {/* Observations List */}
      <div className="flex-1 overflow-y-auto p-6">
        {sortedObservations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <Eye className="w-16 h-16 mx-auto text-text-3 opacity-50" />
              <div>
                <p className="text-lg font-medium text-text-2">No observations</p>
                <p className="text-sm text-text-3 mt-1">
                  {filterType === 'all'
                    ? 'Your agents haven\'t detected anything noteworthy yet'
                    : `No ${filterType}s found`}
                </p>
              </div>
            </div>
          </div>
        ) : filterType === 'all' ? (
          // Grouped view
          <div className="space-y-6">
            {typeOrder.map(type => {
              const observations = groupedObservations[type];
              if (!observations || observations.length === 0) return null;

              return (
                <div key={type}>
                  <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
                    {typeLabels[type]} ({observations.length})
                  </h3>
                  <div className="space-y-3">
                    {observations.map(observation => (
                      <ObservationCard
                        key={observation.id}
                        observation={observation}
                        onAction={onObservationAction}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Filtered view
          <div className="space-y-3">
            {sortedObservations.map(observation => (
              <ObservationCard
                key={observation.id}
                observation={observation}
                onAction={onObservationAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
