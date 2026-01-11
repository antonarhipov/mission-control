import React from 'react';
import type { Service } from '@/types';

interface ServiceBrowserProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelectService: (serviceId: string) => void;
}

export const ServiceBrowser: React.FC<ServiceBrowserProps> = ({
  services,
  selectedServiceId,
  onSelectService,
}) => {
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

  const getMetricStatus = (coverage: number) => {
    if (coverage >= 80) return { color: 'text-green-600', label: 'Good' };
    if (coverage >= 60) return { color: 'text-yellow-600', label: 'Fair' };
    return { color: 'text-red-600', label: 'Poor' };
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Services</h2>
        <p className="text-sm text-gray-600 mt-1">{services.length} services registered</p>
      </div>

      <div className="p-4 space-y-3">
        {services.map((service) => {
          const isSelected = service.id === selectedServiceId;
          const coverageStatus = getMetricStatus(service.metrics.testCoverage);

          return (
            <button
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {service.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">Owner: {service.ownerTeam}</p>
                </div>
                <span
                  className={`ml-2 px-2 py-0.5 text-xs font-medium rounded border ${getTierColor(
                    service.tier
                  )}`}
                >
                  {service.tier}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{service.description}</p>

              {/* Metrics */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  {/* Test Coverage */}
                  <div className="flex items-center">
                    <svg
                      className={`w-3.5 h-3.5 mr-1 ${coverageStatus.color}`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={coverageStatus.color}>
                      {service.metrics.testCoverage}% coverage
                    </span>
                  </div>

                  {/* Open Bugs */}
                  {service.metrics.openBugs > 0 && (
                    <div className="flex items-center text-red-600">
                      <svg
                        className="w-3.5 h-3.5 mr-1"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{service.metrics.openBugs} bugs</span>
                    </div>
                  )}
                </div>

                {/* Active Tasks Badge */}
                {service.activeTasks.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {service.activeTasks.length} active
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
