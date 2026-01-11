import React, { useState } from 'react';
import { ServiceBrowser } from '@/components/shared/ServiceBrowser';
import { ServiceDetailView } from '@/components/shared/ServiceDetailView';
import { services } from '@/data/mockDataV2';

export const ServicesPanel: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const selectedService = selectedServiceId
    ? services.find((s) => s.id === selectedServiceId) || null
    : null;

  return (
    <div className="h-full flex">
      {/* Left: Service Browser */}
      <div className="w-96 border-r border-gray-200 bg-white">
        <ServiceBrowser
          services={services}
          selectedServiceId={selectedServiceId}
          onSelectService={setSelectedServiceId}
        />
      </div>

      {/* Right: Service Detail View or Empty State */}
      <div className="flex-1 bg-gray-50">
        {selectedService ? (
          <ServiceDetailView
            service={selectedService}
            onClose={() => setSelectedServiceId(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Service Selected</h3>
              <p className="text-sm text-gray-500">
                Select a service from the list to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
