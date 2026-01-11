import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { AgentPermission } from '@/types';
import { getAgentById } from '@/data/mockData';

interface PermissionMatrixProps {
  permissions: AgentPermission[];
  services: Array<{ id: string; name: string }>;
}

export function PermissionMatrix({ permissions, services }: PermissionMatrixProps) {
  const permissionTypes = [
    { key: 'canRead' as const, label: 'Read' },
    { key: 'canWrite' as const, label: 'Write' },
    { key: 'canDelete' as const, label: 'Delete' },
    { key: 'canDeploy' as const, label: 'Deploy' },
    { key: 'canMergeToMain' as const, label: 'Merge' },
    { key: 'requiresReview' as const, label: 'Review' },
  ];

  return (
    <div className="space-y-4">
      {/* Global Permissions */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-text-2 mb-3">
          Global Permissions
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-1">
                <th className="text-left py-2 px-3 font-medium text-text-2">Agent</th>
                {permissionTypes.map((type) => (
                  <th key={type.key} className="text-center py-2 px-2 font-medium text-text-2">
                    {type.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => {
                const agent = getAgentById(perm.agentId);
                if (!agent) return null;
                return (
                  <tr key={perm.agentId} className="border-b border-border-1 hover:bg-bg-2 transition-colors">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <span>{agent.emoji}</span>
                        <span className="text-text-1">{agent.name}</span>
                      </div>
                    </td>
                    {permissionTypes.map((type) => {
                      const hasPermission = perm.globalPermissions[type.key];
                      return (
                        <td key={type.key} className="text-center py-2 px-2">
                          {hasPermission ? (
                            type.key === 'requiresReview' ? (
                              <AlertCircle className="w-4 h-4 text-accent-amber inline" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-accent-green inline" />
                            )
                          ) : (
                            <XCircle className="w-4 h-4 text-text-3 inline" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service-Specific Permissions */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-text-2 mb-3">
          Service-Specific Overrides
        </h4>
        <div className="space-y-3">
          {permissions.map((perm) => {
            const agent = getAgentById(perm.agentId);
            if (!agent) return null;

            const servicePerms = Object.entries(perm.servicePermissions);
            if (servicePerms.length === 0) {
              return (
                <div key={perm.agentId} className="p-3 bg-bg-2 rounded-md border border-border-1">
                  <div className="flex items-center gap-2 text-xs text-text-2">
                    <span>{agent.emoji}</span>
                    <span>{agent.name}</span>
                    <span className="text-text-3">— No service-specific overrides</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={perm.agentId} className="p-3 bg-bg-2 rounded-md border border-border-1">
                <div className="flex items-center gap-2 mb-2">
                  <span>{agent.emoji}</span>
                  <span className="text-xs font-medium text-text-1">{agent.name}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-border-1">
                        <th className="text-left py-1.5 px-2 font-medium text-text-3">Service</th>
                        {permissionTypes.map((type) => (
                          <th key={type.key} className="text-center py-1.5 px-1 font-medium text-text-3">
                            {type.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {servicePerms.map(([serviceId, perms]) => {
                        const service = services.find((s) => s.id === serviceId);
                        return (
                          <tr key={serviceId} className="border-b border-border-1 last:border-0">
                            <td className="py-1.5 px-2 text-text-2">
                              {service?.name || serviceId}
                            </td>
                            {permissionTypes.map((type) => {
                              const hasPermission = perms[type.key];
                              return (
                                <td key={type.key} className="text-center py-1.5 px-1">
                                  {hasPermission ? (
                                    type.key === 'requiresReview' ? (
                                      <AlertCircle className="w-3.5 h-3.5 text-accent-amber inline" />
                                    ) : (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-green inline" />
                                    )
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 text-text-3 inline" />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
