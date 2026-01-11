import { useState } from 'react';
import { clsx } from 'clsx';
import { Plus, Users, Trash2, Folder, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useDataModel } from '@/hooks/useDataModel';
import { agents, teams, defaultAgentConfig, getAgentById } from '@/data/mockData';
import { GuardrailsSection } from '@/components/config/GuardrailsSection';
import type { Agent, Team, AgentConfig, AutonomyLevel, PermissionLevel, Repository } from '@/types';

type ConfigView = 'agents' | 'teams' | 'repositories' | 'defaults' | 'permissions' | 'guardrails';

export function ConfigPanel() {
  const { isV2, repositories } = useDataModel();
  const [view, setView] = useState<ConfigView>('teams');
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(
    isV2 && repositories && repositories.length > 0 ? repositories[0] : null
  );
  const [config, setConfig] = useState<AgentConfig>(defaultAgentConfig);

  const updateConfig = <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updatePermission = (key: keyof AgentConfig['permissions'], value: PermissionLevel) => {
    setConfig((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: value },
    }));
  };

  return (
    <div className="grid grid-cols-[260px_1fr] h-full">
      {/* Navigation sidebar */}
      <div className="bg-bg-1 border-r border-border-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-2">
          {/* Teams section */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-3">
              Teams
            </span>
            <button className="p-1 hover:bg-bg-3 rounded transition-colors">
              <Plus className="w-3.5 h-3.5 text-text-3" />
            </button>
          </div>
          {teams.map((team) => (
            <TeamNavItem
              key={team.id}
              team={team}
              isSelected={view === 'teams' && selectedTeam.id === team.id}
              onClick={() => {
                setView('teams');
                setSelectedTeam(team);
              }}
            />
          ))}

          {/* Agents section */}
          <div className="flex items-center justify-between px-3 py-2 mt-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-3">
              Agents
            </span>
            <button className="p-1 hover:bg-bg-3 rounded transition-colors">
              <Plus className="w-3.5 h-3.5 text-text-3" />
            </button>
          </div>
          {agents.map((agent) => (
            <AgentNavItem
              key={agent.id}
              agent={agent}
              isSelected={view === 'agents' && selectedAgent.id === agent.id}
              onClick={() => {
                setView('agents');
                setSelectedAgent(agent);
              }}
            />
          ))}

          {/* Repositories section (V2 only) */}
          {isV2 && repositories && repositories.length > 0 && (
            <>
              <div className="flex items-center justify-between px-3 py-2 mt-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-3">
                  Repositories
                </span>
                <button className="p-1 hover:bg-bg-3 rounded transition-colors">
                  <Plus className="w-3.5 h-3.5 text-text-3" />
                </button>
              </div>
              {repositories.map((repo) => (
                <RepositoryNavItem
                  key={repo.id}
                  repository={repo}
                  isSelected={view === 'repositories' && selectedRepository?.id === repo.id}
                  onClick={() => {
                    setView('repositories');
                    setSelectedRepository(repo);
                  }}
                />
              ))}
            </>
          )}

          {/* Global section */}
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-3 px-3 py-2 mt-4">
            Global
          </div>
          <NavItem
            icon="🌐"
            label="Defaults"
            isSelected={view === 'defaults'}
            onClick={() => setView('defaults')}
          />
          <NavItem
            icon="🔒"
            label="Permissions"
            isSelected={view === 'permissions'}
            onClick={() => setView('permissions')}
          />
          {isV2 && (
            <NavItem
              icon="🛡️"
              label="Guardrails"
              isSelected={view === 'guardrails'}
              onClick={() => setView('guardrails')}
            />
          )}
        </div>
      </div>

      {/* Main config area */}
      <div className="flex flex-col overflow-hidden">
        {view === 'teams' && <TeamConfigView team={selectedTeam} />}
        {view === 'agents' && (
          <AgentConfigView
            agent={selectedAgent}
            config={config}
            updateConfig={updateConfig}
          />
        )}
        {view === 'repositories' && selectedRepository && (
          <RepositoryConfigView repository={selectedRepository} />
        )}
        {view === 'defaults' && (
          <DefaultsConfigView
            config={config}
            updateConfig={updateConfig}
          />
        )}
        {view === 'permissions' && (
          <PermissionsConfigView
            config={config}
            updatePermission={updatePermission}
          />
        )}
        {view === 'guardrails' && <GuardrailsSection />}
      </div>
    </div>
  );
}

function TeamNavItem({
  team,
  isSelected,
  onClick,
}: {
  team: Team;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors',
        isSelected ? 'bg-bg-3' : 'hover:bg-bg-4'
      )}
    >
      <div
        className="w-7 h-7 rounded flex items-center justify-center"
        style={{ backgroundColor: team.color + '30' }}
      >
        <Users className="w-4 h-4" style={{ color: team.color }} />
      </div>
      <span className="flex-1 text-xs font-medium text-left">{team.name}</span>
      <span className="text-[10px] text-text-3">{team.agentIds.length}</span>
    </button>
  );
}

function AgentNavItem({
  agent,
  isSelected,
  onClick,
}: {
  agent: Agent;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors',
        isSelected ? 'bg-bg-3' : 'hover:bg-bg-4'
      )}
    >
      <div
        className="w-7 h-7 rounded flex items-center justify-center text-sm"
        style={{ backgroundColor: agent.color + '40' }}
      >
        {agent.emoji}
      </div>
      <span className="flex-1 text-xs font-medium text-left">{agent.name}</span>
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full',
          agent.status !== 'idle' ? 'bg-accent-green' : 'bg-text-3'
        )}
      />
    </button>
  );
}

function RepositoryNavItem({
  repository,
  isSelected,
  onClick,
}: {
  repository: Repository;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusIcon = repository.status === 'connected' ? (
    <CheckCircle2 className="w-3 h-3 text-accent-green" />
  ) : repository.status === 'disconnected' ? (
    <XCircle className="w-3 h-3 text-text-3" />
  ) : (
    <XCircle className="w-3 h-3 text-accent-amber" />
  );

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors',
        isSelected ? 'bg-bg-3' : 'hover:bg-bg-4'
      )}
    >
      <div className="w-7 h-7 rounded flex items-center justify-center bg-bg-3">
        <Folder className="w-4 h-4 text-text-3" />
      </div>
      <span className="flex-1 text-xs font-medium text-left truncate">{repository.name}</span>
      {statusIcon}
    </button>
  );
}

function NavItem({
  icon,
  label,
  isSelected,
  onClick,
}: {
  icon: string;
  label: string;
  isSelected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors',
        isSelected ? 'bg-bg-3' : 'hover:bg-bg-4'
      )}
    >
      <div className="w-7 h-7 rounded flex items-center justify-center text-sm bg-bg-3">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function TeamConfigView({ team }: { team: Team }) {
  const teamAgents = team.agentIds.map(id => getAgentById(id)).filter(Boolean);

  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 bg-bg-1 border-b border-border-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: team.color + '30' }}
            >
              <Users className="w-6 h-6" style={{ color: team.color }} />
            </div>
            <div>
              <h2 className="text-base font-semibold">{team.name}</h2>
              <p className="text-xs text-text-2">{team.description}</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
            Edit Team
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Team members */}
        <ConfigSection title="Team Members">
          <div className="py-2 space-y-2">
            {teamAgents.map((agent) => agent && (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 bg-bg-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: agent.color + '40' }}
                  >
                    {agent.emoji}
                  </div>
                  <div>
                    <h4 className="text-xs font-medium">{agent.name}</h4>
                    <p className="text-[10px] text-text-3 capitalize">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'text-[10px] px-1.5 py-0.5 rounded',
                      agent.status === 'running' && 'bg-accent-green/20 text-accent-green',
                      agent.status === 'thinking' && 'bg-accent-blue/20 text-accent-blue',
                      agent.status === 'waiting' && 'bg-accent-amber/20 text-accent-amber',
                      agent.status === 'idle' && 'bg-bg-3 text-text-3',
                      agent.status === 'error' && 'bg-accent-red/20 text-accent-red'
                    )}
                  >
                    {agent.status}
                  </span>
                  <button className="p-1.5 hover:bg-bg-3 rounded transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-text-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="py-3 border-t border-border-1">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add Agent to Team
            </button>
          </div>
        </ConfigSection>

        {/* Pipeline configuration */}
        <ConfigSection title="Default Pipeline">
          <div className="py-3">
            <p className="text-[11px] text-text-2 mb-3">
              Define the default workflow stages for worktrees assigned to this team.
            </p>
            <div className="flex items-center gap-2 p-3 bg-bg-2 rounded-lg">
              {['Design', 'Implementation', 'Testing', 'Review', 'Documentation'].map((stage, i, arr) => (
                <div key={stage} className="flex items-center gap-2">
                  <div className="px-3 py-1.5 text-[11px] font-medium bg-bg-3 border border-border-1 rounded">
                    {stage}
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-text-3">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ConfigSection>

        {/* Team settings */}
        <ConfigSection title="Team Settings">
          <ConfigRow
            label="Auto-assign to worktrees"
            description="Automatically assign this team to new worktrees matching patterns"
          >
            <Toggle enabled={true} onToggle={() => {}} />
          </ConfigRow>
          <ConfigRow
            label="Branch patterns"
            description="Patterns to match for auto-assignment"
          >
            <input
              type="text"
              defaultValue="feature/*, fix/*"
              className="px-3 py-1.5 text-xs font-mono bg-bg-2 border border-border-1 rounded text-text-1 w-[180px]"
            />
          </ConfigRow>
        </ConfigSection>
      </div>
    </>
  );
}

function RepositoryConfigView({ repository }: { repository: Repository }) {
  const statusConfig = {
    connected: {
      color: 'text-accent-green',
      bg: 'bg-accent-green/10',
      border: 'border-accent-green/30',
      icon: CheckCircle2,
      label: 'Connected',
    },
    disconnected: {
      color: 'text-accent-red',
      bg: 'bg-accent-red/10',
      border: 'border-accent-red/30',
      icon: XCircle,
      label: 'Disconnected',
    },
    error: {
      color: 'text-accent-amber',
      bg: 'bg-accent-amber/10',
      border: 'border-accent-amber/30',
      icon: XCircle,
      label: 'Error',
    },
  };

  const statusInfo = statusConfig[repository.status];
  const StatusIcon = statusInfo.icon;

  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 bg-bg-1 border-b border-border-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-bg-3">
              <Folder className="w-6 h-6 text-text-3" />
            </div>
            <div>
              <h2 className="text-base font-semibold">{repository.name}</h2>
              <p className="text-xs text-text-3 font-mono">{repository.path}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Sync Now
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors text-accent-red">
              Disconnect
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Connection Status */}
        <ConfigSection title="Connection Status">
          <div className="py-3">
            <div className={clsx(
              'flex items-center gap-3 p-3 rounded-lg border',
              statusInfo.bg,
              statusInfo.border
            )}>
              <StatusIcon className={clsx('w-5 h-5', statusInfo.color)} />
              <div className="flex-1">
                <h4 className={clsx('text-xs font-medium', statusInfo.color)}>
                  {statusInfo.label}
                </h4>
                <p className="text-[11px] text-text-3">
                  {repository.status === 'connected' && 'Repository is connected and ready'}
                  {repository.status === 'disconnected' && 'Repository is not connected'}
                  {repository.status === 'error' && 'Connection error - check credentials'}
                </p>
              </div>
              {repository.status === 'connected' && repository.lastSynced && (
                <span className="text-[10px] text-text-3">
                  Last synced: {repository.lastSynced}
                </span>
              )}
            </div>
          </div>
        </ConfigSection>

        {/* Repository Details */}
        <ConfigSection title="Repository Details">
          <ConfigRow
            label="Local Path"
            description="Working directory location"
          >
            <input
              type="text"
              value={repository.path}
              readOnly
              className="px-3 py-1.5 text-xs font-mono bg-bg-2 border border-border-1 rounded text-text-1 w-[300px]"
            />
          </ConfigRow>
          <ConfigRow
            label="Remote URL"
            description="Git remote repository"
          >
            <input
              type="text"
              value={repository.remoteUrl}
              readOnly
              className="px-3 py-1.5 text-xs font-mono bg-bg-2 border border-border-1 rounded text-text-1 w-[300px]"
            />
          </ConfigRow>
          <ConfigRow
            label="Default Branch"
            description="Main branch for this repository"
          >
            <input
              type="text"
              value={repository.defaultBranch}
              readOnly
              className="px-3 py-1.5 text-xs font-mono bg-bg-2 border border-border-1 rounded text-text-1 w-[140px]"
            />
          </ConfigRow>
        </ConfigSection>

        {/* Repository Settings */}
        <ConfigSection title="Repository Settings">
          <ConfigRow
            label="Auto-sync"
            description="Automatically sync with remote on changes"
          >
            <Toggle enabled={true} onToggle={() => {}} />
          </ConfigRow>
          <ConfigRow
            label="Sync interval"
            description="How often to check for remote updates"
          >
            <select
              defaultValue="5"
              className="px-3 py-1.5 text-xs bg-bg-2 border border-border-1 rounded text-text-1 min-w-[140px]"
            >
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          </ConfigRow>
          <ConfigRow
            label="Allow force push"
            description="Enable force push operations"
          >
            <Toggle enabled={false} onToggle={() => {}} />
          </ConfigRow>
        </ConfigSection>

        {/* Danger Zone */}
        <ConfigSection title="Danger Zone">
          <div className="py-3">
            <div className="flex items-start justify-between p-3 bg-accent-red/5 border border-accent-red/20 rounded-lg">
              <div>
                <h4 className="text-xs font-medium text-accent-red mb-1">
                  Remove Repository
                </h4>
                <p className="text-[11px] text-text-3">
                  This will disconnect the repository but keep local files intact.
                </p>
              </div>
              <button className="px-3 py-1.5 text-[11px] font-medium bg-accent-red text-white rounded hover:bg-accent-red/90 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </ConfigSection>
      </div>
    </>
  );
}

function AgentConfigView({
  agent,
  config,
  updateConfig,
}: {
  agent: Agent;
  config: AgentConfig;
  updateConfig: <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 bg-bg-1 border-b border-border-1">
        <h2 className="text-base font-semibold flex items-center gap-2.5 mb-1">
          <span className="text-2xl">{agent.emoji}</span>
          {agent.name} Agent
        </h2>
        <p className="text-xs text-text-2">
          {getAgentDescription(agent.role)}
        </p>
      </div>

      {/* Config sections */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Model Configuration */}
        <ConfigSection title="Model Configuration">
          <ConfigRow
            label="Base Model"
            description="Primary model for code generation"
          >
            <select
              value={config.model}
              onChange={(e) => updateConfig('model', e.target.value)}
              className="px-3 py-1.5 text-xs bg-bg-2 border border-border-1 rounded text-text-1 min-w-[180px]"
            >
              <option value="claude-sonnet-4">Claude Sonnet 4</option>
              <option value="claude-opus-4">Claude Opus 4</option>
              <option value="claude-haiku-4">Claude Haiku 4</option>
            </select>
          </ConfigRow>

          <ConfigRow
            label="Temperature"
            description="Lower = deterministic, higher = creative"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={config.temperature * 100}
                onChange={(e) => updateConfig('temperature', Number(e.target.value) / 100)}
                className="w-[120px] h-1 bg-bg-3 rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-accent-blue [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="font-mono text-[11px] text-text-2 w-7">
                {config.temperature.toFixed(1)}
              </span>
            </div>
          </ConfigRow>

          <ConfigRow
            label="Extended Thinking"
            description="Chain-of-thought for complex tasks"
          >
            <Toggle
              enabled={config.extendedThinking}
              onToggle={() => updateConfig('extendedThinking', !config.extendedThinking)}
            />
          </ConfigRow>
        </ConfigSection>

        {/* Behavior */}
        <ConfigSection title="Behavior">
          <ConfigRow
            label="Autonomy Level"
            description="How independently agent acts"
          >
            <select
              value={config.autonomyLevel}
              onChange={(e) => updateConfig('autonomyLevel', e.target.value as AutonomyLevel)}
              className="px-3 py-1.5 text-xs bg-bg-2 border border-border-1 rounded text-text-1 min-w-[180px]"
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="autonomous">Autonomous</option>
              <option value="full-auto">Full Auto</option>
            </select>
          </ConfigRow>

          <ConfigRow
            label="Auto-commit"
            description="Commit after successful changes"
          >
            <Toggle
              enabled={config.autoCommit}
              onToggle={() => updateConfig('autoCommit', !config.autoCommit)}
            />
          </ConfigRow>
        </ConfigSection>
      </div>
    </>
  );
}

function DefaultsConfigView({
  config,
  updateConfig,
}: {
  config: AgentConfig;
  updateConfig: <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => void;
}) {
  return (
    <>
      <div className="px-5 py-4 bg-bg-1 border-b border-border-1">
        <h2 className="text-base font-semibold">Default Configuration</h2>
        <p className="text-xs text-text-2">
          Settings applied to all new agents unless overridden
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <ConfigSection title="Model Defaults">
          <ConfigRow label="Default Model" description="Model for new agents">
            <select
              value={config.model}
              onChange={(e) => updateConfig('model', e.target.value)}
              className="px-3 py-1.5 text-xs bg-bg-2 border border-border-1 rounded text-text-1 min-w-[180px]"
            >
              <option value="claude-sonnet-4">Claude Sonnet 4</option>
              <option value="claude-opus-4">Claude Opus 4</option>
              <option value="claude-haiku-4">Claude Haiku 4</option>
            </select>
          </ConfigRow>
        </ConfigSection>
      </div>
    </>
  );
}

function PermissionsConfigView({
  config,
  updatePermission,
}: {
  config: AgentConfig;
  updatePermission: (key: keyof AgentConfig['permissions'], value: PermissionLevel) => void;
}) {
  return (
    <>
      <div className="px-5 py-4 bg-bg-1 border-b border-border-1">
        <h2 className="text-base font-semibold">Global Permissions</h2>
        <p className="text-xs text-text-2">
          Default tool access permissions for all agents
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <ConfigSection title="Tool Permissions">
          <div className="space-y-2 py-2">
            <ToolPermission
              icon="📁"
              name="File System"
              description="Read, write, delete files"
              value={config.permissions.fileSystem}
              onChange={(v) => updatePermission('fileSystem', v)}
              options={['disabled', 'read-only', 'full']}
            />
            <ToolPermission
              icon="💻"
              name="Terminal"
              description="Execute shell commands"
              value={config.permissions.terminal}
              onChange={(v) => updatePermission('terminal', v)}
              options={['disabled', 'allowlist', 'ask', 'full']}
            />
            <ToolPermission
              icon="🔀"
              name="Git Operations"
              description="Commit, branch, push"
              value={config.permissions.git}
              onChange={(v) => updatePermission('git', v)}
              options={['disabled', 'allowlist', 'full']}
            />
            <ToolPermission
              icon="🌐"
              name="Web Browsing"
              description="Access documentation, APIs"
              value={config.permissions.web}
              onChange={(v) => updatePermission('web', v)}
              options={['disabled', 'allowlist', 'full']}
            />
          </div>
        </ConfigSection>
      </div>
    </>
  );
}

function ConfigSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-1 border border-border-1 rounded-lg overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border-1 text-[13px] font-semibold">
        {title}
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

function ConfigRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between py-3.5 border-b border-border-1 last:border-b-0">
      <div>
        <h4 className="text-xs font-medium mb-0.5">{label}</h4>
        <p className="text-[11px] text-text-3">{description}</p>
      </div>
      <div className="ml-5 shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        'w-10 h-[22px] rounded-full relative transition-colors',
        enabled ? 'bg-accent-green' : 'bg-bg-3'
      )}
    >
      <span
        className={clsx(
          'absolute w-[18px] h-[18px] bg-white rounded-full top-0.5 transition-transform',
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

function ToolPermission({
  icon,
  name,
  description,
  value,
  onChange,
  options,
}: {
  icon: string;
  name: string;
  description: string;
  value: PermissionLevel;
  onChange: (value: PermissionLevel) => void;
  options: PermissionLevel[];
}) {
  const labels: Record<PermissionLevel, string> = {
    disabled: 'Disabled',
    'read-only': 'Read Only',
    allowlist: 'Allowlist Only',
    ask: 'Ask Each Time',
    full: 'Full Access',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-bg-2 rounded">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded flex items-center justify-center text-xs bg-bg-3">
          {icon}
        </div>
        <div>
          <h5 className="text-xs font-medium">{name}</h5>
          <p className="text-[10px] text-text-3">{description}</p>
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PermissionLevel)}
        className="px-2.5 py-1 text-[11px] bg-bg-3 border border-border-1 rounded text-text-1"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labels[opt]}
          </option>
        ))}
      </select>
    </div>
  );
}

function getAgentDescription(role: Agent['role']): string {
  const descriptions: Record<Agent['role'], string> = {
    implementer: 'Writes and modifies code based on specifications from the Architect',
    architect: 'Designs system architecture and creates implementation plans',
    tester: 'Writes and runs tests, validates code changes',
    reviewer: 'Reviews code for quality, security, and best practices',
    docs: 'Writes and maintains documentation',
  };
  return descriptions[role];
}
