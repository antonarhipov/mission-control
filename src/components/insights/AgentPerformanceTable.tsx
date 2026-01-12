import { useState } from 'react';
import { ArrowUp, ArrowDown, Users } from 'lucide-react';

interface AgentPerformance {
  agentId: string;
  name: string;
  emoji: string;
  role: string;
  missions: number;
  approvalRate: number; // 0-100
  reworkRate: number; // 0-100
  avgCost: number;
  qualityScore: number; // 0-100
}

interface AgentPerformanceTableProps {
  agents: AgentPerformance[];
}

type SortField = 'name' | 'missions' | 'approvalRate' | 'reworkRate' | 'avgCost' | 'qualityScore';
type SortDirection = 'asc' | 'desc';

export function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('missions');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAgents = [...agents].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    switch (sortField) {
      case 'name':
        aVal = a.name;
        bVal = b.name;
        break;
      case 'missions':
        aVal = a.missions;
        bVal = b.missions;
        break;
      case 'approvalRate':
        aVal = a.approvalRate;
        bVal = b.approvalRate;
        break;
      case 'reworkRate':
        aVal = a.reworkRate;
        bVal = b.reworkRate;
        break;
      case 'avgCost':
        aVal = a.avgCost;
        bVal = b.avgCost;
        break;
      case 'qualityScore':
        aVal = a.qualityScore;
        bVal = b.qualityScore;
        break;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUp className="w-3 h-3 text-text-3 opacity-30" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 text-accent-blue" />
      : <ArrowDown className="w-3 h-3 text-accent-blue" />;
  };

  const getApprovalRateColor = (rate: number) => {
    if (rate >= 90) return 'text-accent-green';
    if (rate >= 75) return 'text-accent-amber';
    return 'text-accent-red';
  };

  const getReworkRateColor = (rate: number) => {
    if (rate <= 10) return 'text-accent-green';
    if (rate <= 25) return 'text-accent-amber';
    return 'text-accent-red';
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'text-accent-green';
    if (score >= 75) return 'text-accent-amber';
    return 'text-accent-red';
  };

  return (
    <div className="bg-bg-0 rounded-lg border border-border-1">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border-1">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent-purple" />
          <h2 className="text-lg font-semibold text-text-1">Agent Performance</h2>
        </div>
        <div className="text-sm text-text-3">{agents.length} agents</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg-1 border-b border-border-1">
            <tr>
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 text-xs font-semibold text-text-2 uppercase tracking-wide hover:text-text-1 transition-colors"
                >
                  <span>Agent</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-right px-6 py-3">
                <button
                  onClick={() => handleSort('missions')}
                  className="flex items-center justify-end gap-1 w-full text-xs font-semibold text-text-2 uppercase tracking-wide hover:text-text-1 transition-colors"
                >
                  <span>Missions</span>
                  <SortIcon field="missions" />
                </button>
              </th>
              <th className="text-right px-6 py-3">
                <button
                  onClick={() => handleSort('approvalRate')}
                  className="flex items-center justify-end gap-1 w-full text-xs font-semibold text-text-2 uppercase tracking-wide hover:text-text-1 transition-colors"
                >
                  <span>Approval Rate</span>
                  <SortIcon field="approvalRate" />
                </button>
              </th>
              <th className="text-right px-6 py-3">
                <button
                  onClick={() => handleSort('reworkRate')}
                  className="flex items-center justify-end gap-1 w-full text-xs font-semibold text-text-2 uppercase tracking-wide hover:text-text-1 transition-colors"
                >
                  <span>Rework Rate</span>
                  <SortIcon field="reworkRate" />
                </button>
              </th>
              <th className="text-right px-6 py-3">
                <button
                  onClick={() => handleSort('avgCost')}
                  className="flex items-center justify-end gap-1 w-full text-xs font-semibold text-text-2 uppercase tracking-wide hover:text-text-1 transition-colors"
                >
                  <span>Avg Cost</span>
                  <SortIcon field="avgCost" />
                </button>
              </th>
              <th className="text-right px-6 py-3">
                <button
                  onClick={() => handleSort('qualityScore')}
                  className="flex items-center justify-end gap-1 w-full text-xs font-semibold text-text-2 uppercase tracking-wide hover:text-text-1 transition-colors"
                >
                  <span>Quality</span>
                  <SortIcon field="qualityScore" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-1">
            {sortedAgents.map((agent) => (
              <tr
                key={agent.agentId}
                className="hover:bg-bg-1 transition-colors"
              >
                {/* Agent Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{agent.emoji}</span>
                    <div>
                      <div className="text-sm font-medium text-text-1">{agent.name}</div>
                      <div className="text-xs text-text-3 capitalize">{agent.role}</div>
                    </div>
                  </div>
                </td>

                {/* Missions */}
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-text-1">{agent.missions}</span>
                </td>

                {/* Approval Rate */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-bg-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          agent.approvalRate >= 90 ? 'bg-accent-green' :
                          agent.approvalRate >= 75 ? 'bg-accent-amber' : 'bg-accent-red'
                        }`}
                        style={{ width: `${agent.approvalRate}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getApprovalRateColor(agent.approvalRate)}`}>
                      {agent.approvalRate}%
                    </span>
                  </div>
                </td>

                {/* Rework Rate */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-bg-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          agent.reworkRate <= 10 ? 'bg-accent-green' :
                          agent.reworkRate <= 25 ? 'bg-accent-amber' : 'bg-accent-red'
                        }`}
                        style={{ width: `${agent.reworkRate}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getReworkRateColor(agent.reworkRate)}`}>
                      {agent.reworkRate}%
                    </span>
                  </div>
                </td>

                {/* Avg Cost */}
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-text-1">
                    ${agent.avgCost.toFixed(2)}
                  </span>
                </td>

                {/* Quality Score */}
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-semibold ${getQualityScoreColor(agent.qualityScore)}`}>
                    {agent.qualityScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="px-6 py-4 border-t border-border-1 bg-bg-1">
        <div className="grid grid-cols-4 gap-6 text-xs text-text-3">
          <div>
            <span>Total Missions: </span>
            <span className="font-semibold text-text-1">
              {agents.reduce((sum, a) => sum + a.missions, 0)}
            </span>
          </div>
          <div>
            <span>Avg Approval Rate: </span>
            <span className="font-semibold text-text-1">
              {(agents.reduce((sum, a) => sum + a.approvalRate, 0) / agents.length).toFixed(1)}%
            </span>
          </div>
          <div>
            <span>Avg Rework Rate: </span>
            <span className="font-semibold text-text-1">
              {(agents.reduce((sum, a) => sum + a.reworkRate, 0) / agents.length).toFixed(1)}%
            </span>
          </div>
          <div>
            <span>Avg Quality: </span>
            <span className="font-semibold text-text-1">
              {(agents.reduce((sum, a) => sum + a.qualityScore, 0) / agents.length).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
