import React from 'react';
import type { Service } from '@/types';

interface ServiceDetailViewProps {
  service: Service;
  onClose: () => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ service, onClose }) => {
  const getTierColor = (tier: Service['tier']) => {
    switch (tier) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMetricColor = (value: number, thresholds: { good: number; fair: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.fair) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">{service.name}</h2>
              <span
                className={`px-2 py-1 text-xs font-medium rounded border ${getTierColor(
                  service.tier
                )}`}
              >
                {service.tier}
              </span>
            </div>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Owner: {service.ownerTeam}</span>
          </div>
          {service.lastDeployed && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last deployed: {service.lastDeployed}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quality Metrics */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quality Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Test Coverage</div>
              <div
                className={`text-2xl font-semibold ${getMetricColor(
                  service.metrics.testCoverage,
                  { good: 80, fair: 60 }
                )}`}
              >
                {service.metrics.testCoverage}%
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Open Bugs</div>
              <div
                className={`text-2xl font-semibold ${
                  service.metrics.openBugs === 0
                    ? 'text-green-600'
                    : service.metrics.openBugs <= 3
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {service.metrics.openBugs}
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Tech Debt Score</div>
              <div
                className={`text-2xl font-semibold ${getMetricColor(
                  100 - service.metrics.techDebtScore,
                  { good: 75, fair: 50 }
                )}`}
              >
                {service.metrics.techDebtScore}
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Lines of Code</div>
              <div className="text-2xl font-semibold text-gray-900">
                {service.metrics.linesOfCode.toLocaleString()}
              </div>
            </div>
          </div>
        </section>

        {/* Dependencies */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Dependencies</h3>
          <div className="space-y-3">
            {/* Depends On */}
            {service.dependencies.dependsOn.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">Depends On (Upstream)</h4>
                <div className="flex flex-wrap gap-2">
                  {service.dependencies.dependsOn.map((depId) => (
                    <span
                      key={depId}
                      className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium"
                    >
                      {depId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Used By */}
            {service.dependencies.usedBy.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">Used By (Downstream)</h4>
                <div className="flex flex-wrap gap-2">
                  {service.dependencies.usedBy.map((depId) => (
                    <span
                      key={depId}
                      className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium"
                    >
                      {depId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations */}
            {service.dependencies.integrations.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">Integrations</h4>
                <div className="space-y-2">
                  {service.dependencies.integrations.map((integration, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded border border-gray-200 text-xs"
                    >
                      <span className="font-medium text-gray-900">{integration.type}</span>
                      {integration.target && (
                        <span className="text-gray-600"> → {integration.target}</span>
                      )}
                      <p className="text-gray-600 mt-1">{integration.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Active Tasks */}
        {service.activeTasks.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Tasks</h3>
            <div className="space-y-2">
              {service.activeTasks.map((taskId) => (
                <div
                  key={taskId}
                  className="p-3 bg-blue-50 border border-blue-200 rounded text-sm"
                >
                  <span className="font-medium text-blue-900">{taskId}</span>
                  <span className="ml-2 text-xs text-blue-600">Currently modifying this service</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Commits */}
        {service.recentCommits.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Commits</h3>
            <div className="space-y-2">
              {service.recentCommits.map((commit) => (
                <div
                  key={commit.sha}
                  className="p-3 bg-white border border-gray-200 rounded"
                >
                  <div className="flex items-start justify-between mb-1">
                    <code className="text-xs font-mono text-gray-600">{commit.sha}</code>
                    <span className="text-xs text-gray-400">{commit.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">{commit.message}</p>
                  <p className="text-xs text-gray-600">by {commit.author}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Repositories */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Repositories</h3>
          <div className="space-y-2">
            {service.repositories.map((repoId) => (
              <div
                key={repoId}
                className="p-3 bg-white border border-gray-200 rounded flex items-center"
              >
                <svg
                  className="w-4 h-4 text-gray-600 mr-2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-sm text-gray-900">{repoId}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
