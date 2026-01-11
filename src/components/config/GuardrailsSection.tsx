import { useState } from 'react';
import { clsx } from 'clsx';
import { Shield, Users, AlertTriangle } from 'lucide-react';
import { PolicyList } from './PolicyList';
import { PermissionMatrix } from './PermissionMatrix';
import { PolicyViolationLog } from './PolicyViolationLog';
import { policies, agentPermissions, policyViolations, services } from '@/data/mockDataV2';

type GuardrailsTab = 'policies' | 'permissions' | 'violations';

export function GuardrailsSection() {
  const [activeTab, setActiveTab] = useState<GuardrailsTab>('policies');
  const [localPolicies, setLocalPolicies] = useState(policies);

  const handleTogglePolicy = (policyId: string) => {
    setLocalPolicies((prev) =>
      prev.map((policy) =>
        policy.id === policyId ? { ...policy, enabled: !policy.enabled } : policy
      )
    );
  };

  const tabs: Array<{ id: GuardrailsTab; label: string; icon: typeof Shield; count?: number }> = [
    { id: 'policies', label: 'Policies', icon: Shield, count: localPolicies.length },
    { id: 'permissions', label: 'Permissions', icon: Users, count: agentPermissions.length },
    { id: 'violations', label: 'Violations', icon: AlertTriangle, count: policyViolations.length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-1 bg-bg-1">
        <h2 className="text-lg font-semibold text-text-1 mb-1">Guardrails & Safety</h2>
        <p className="text-xs text-text-3">
          Manage agent policies, permissions, and review violations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 py-3 border-b border-border-1 bg-bg-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-bg-2 text-text-1'
                  : 'text-text-2 hover:text-text-1 hover:bg-bg-2/50'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'px-1.5 py-0.5 rounded text-[10px] font-medium',
                    activeTab === tab.id
                      ? 'bg-bg-3 text-text-1'
                      : 'bg-bg-2 text-text-3'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'policies' && (
          <div>
            <div className="mb-4 p-4 bg-accent-blue/10 border border-accent-blue/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent-blue mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-text-1 mb-1">Policy Management</h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    Policies define what agents can and cannot do. Toggle policies to enable or disable them.
                    Enabled policies will be enforced during agent operations.
                  </p>
                </div>
              </div>
            </div>
            <PolicyList policies={localPolicies} onTogglePolicy={handleTogglePolicy} />
          </div>
        )}

        {activeTab === 'permissions' && (
          <div>
            <div className="mb-4 p-4 bg-accent-blue/10 border border-accent-blue/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-accent-blue mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-text-1 mb-1">Permission Matrix</h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    View agent permissions at both global and service levels. Service-specific permissions
                    override global settings for fine-grained control.
                  </p>
                </div>
              </div>
            </div>
            <PermissionMatrix
              permissions={agentPermissions}
              services={services.map((s) => ({ id: s.id, name: s.name }))}
            />
          </div>
        )}

        {activeTab === 'violations' && (
          <div>
            <div className="mb-4 p-4 bg-accent-amber/10 border border-accent-amber/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent-amber mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-text-1 mb-1">Policy Violations</h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    Review recent policy violations. Violations occur when agents attempt actions that are
                    blocked or require approval according to active policies.
                  </p>
                </div>
              </div>
            </div>
            <PolicyViolationLog violations={policyViolations} />
          </div>
        )}
      </div>
    </div>
  );
}
