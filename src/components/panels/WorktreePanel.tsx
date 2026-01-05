import { clsx } from 'clsx';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  Clock,
  FileCode,
  ChevronRight,
  Users,
} from 'lucide-react';
import { WorktreeSidebar } from '@/components/shared/WorktreeSidebar';
import { WorktreeStatusBadge } from '@/components/shared/WorktreeCard';
import { worktrees, getAgentById, getTaskById, getTeamById } from '@/data/mockData';
import type { Worktree, PipelineStage } from '@/types';

interface WorktreePanelProps {
  selectedWorktreeId: string | null;
  onSelectWorktree: (id: string | null) => void;
}

export function WorktreePanel({ selectedWorktreeId, onSelectWorktree }: WorktreePanelProps) {
  // Default to first worktree if none selected
  const effectiveWorktreeId = selectedWorktreeId || worktrees[0]?.id;
  const selectedWorktree = worktrees.find(w => w.id === effectiveWorktreeId);

  return (
    <div className="grid grid-cols-[340px_1fr] h-full">
      {/* Worktree list (shared component) */}
      <WorktreeSidebar
        selectedWorktreeId={effectiveWorktreeId}
        onSelectWorktree={onSelectWorktree}
        showAllTasksOption={false}
      />

      {/* Worktree detail */}
      {selectedWorktree && (
        <WorktreeDetail worktree={selectedWorktree} />
      )}
    </div>
  );
}

function WorktreeDetail({ worktree }: { worktree: Worktree }) {
  const task = getTaskById(worktree.taskId);
  const team = getTeamById(worktree.teamId);

  return (
    <div className="flex flex-col bg-bg-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-bg-1 border-b border-border-1 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <GitBranch className="w-5 h-5 text-text-2" />
            <h2 className="text-base font-semibold font-mono">{worktree.branch}</h2>
            <WorktreeStatusBadge status={worktree.status} />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Sync from {worktree.baseBranch}
            </button>
            {worktree.status === 'active' ? (
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
                <Pause className="w-3.5 h-3.5" />
                Pause
              </button>
            ) : (
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
                <Play className="w-3.5 h-3.5" />
                Resume
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-accent-green text-white rounded hover:brightness-110 transition-all">
              <GitPullRequest className="w-3.5 h-3.5" />
              Create PR
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-text-2">
          <span className="flex items-center gap-1.5">
            📁 {worktree.path}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Started {worktree.createdAt}
          </span>
          {task && (
            <span className="flex items-center gap-1.5">
              🎯 <span className="font-mono text-text-link">{task.id}</span>
            </span>
          )}
          {team && (
            <span
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px]"
              style={{ backgroundColor: team.color + '20', color: team.color }}
            >
              <Users className="w-3 h-3" />
              {team.name}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Conflict warning */}
        {worktree.status === 'conflict' && worktree.conflicts && (
          <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent-red shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-accent-red mb-1">
                  Merge Conflicts Detected
                </h3>
                <p className="text-xs text-text-2 mb-3">
                  {worktree.conflicts.length} file(s) have conflicts with {worktree.baseBranch}. 
                  The agents are waiting for manual resolution.
                </p>
                <div className="space-y-2 mb-3">
                  {worktree.conflicts.map((conflict, i) => (
                    <div key={i} className="bg-bg-1 rounded p-2 text-xs font-mono">
                      <div className="text-accent-red">{conflict.file}</div>
                      <div className="text-text-3 mt-1">
                        Ours: {conflict.ourChange}
                      </div>
                      <div className="text-text-3">
                        Theirs: {conflict.theirChange}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-[11px] font-medium bg-accent-red text-white rounded hover:brightness-110 transition-all">
                    Resolve Conflicts
                  </button>
                  <button className="px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
                    View in Diff
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team & Pipeline */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-3 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              {team ? team.name : 'Team'} Pipeline
            </h3>
            {team && (
              <span className="text-[10px] text-text-3">{team.description}</span>
            )}
          </div>
          <div className="bg-bg-1 border border-border-1 rounded-lg p-4">
            <div className="flex items-center gap-2">
              {worktree.pipeline.map((stage, index) => (
                <PipelineStageCard 
                  key={stage.id} 
                  stage={stage} 
                  isLast={index === worktree.pipeline.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Agent contributions */}
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-3 mb-3">
            Agent Contributions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {worktree.agents.map((wa) => {
              const agent = getAgentById(wa.agentId);
              if (!agent) return null;
              return (
                <AgentContributionCard
                  key={wa.agentId}
                  agent={agent}
                  worktreeAgent={wa}
                />
              );
            })}
          </div>
        </section>

        {/* Recent commits */}
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-3 mb-3 flex items-center gap-2">
            <GitCommit className="w-3.5 h-3.5" />
            Recent Commits
          </h3>
          <div className="bg-bg-1 border border-border-1 rounded-lg overflow-hidden">
            {worktree.commits.slice(0, 5).map((commit, index) => {
              const agent = commit.agentId ? getAgentById(commit.agentId) : null;
              return (
                <div
                  key={commit.sha}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 hover:bg-bg-2 transition-colors',
                    index !== worktree.commits.length - 1 && 'border-b border-border-1'
                  )}
                >
                  <div
                    className={clsx(
                      'w-8 h-8 rounded flex items-center justify-center text-sm shrink-0',
                      commit.authorType === 'agent' ? 'bg-accent-blue/20' : 'bg-accent-purple/20'
                    )}
                  >
                    {agent ? agent.emoji : '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{commit.message}</div>
                    <div className="flex items-center gap-2 text-[10px] text-text-3 mt-0.5">
                      <span className="font-mono text-text-link">{commit.sha}</span>
                      <span>{commit.author}</span>
                      <span>{commit.timestamp}</span>
                      {commit.additions !== undefined && (
                        <span className="text-accent-green">+{commit.additions}</span>
                      )}
                      {commit.deletions !== undefined && (
                        <span className="text-accent-red">-{commit.deletions}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Changed files preview */}
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-3 mb-3 flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5" />
            Changed Files ({worktree.fileChanges.length})
          </h3>
          <div className="bg-bg-1 border border-border-1 rounded-lg overflow-hidden">
            {worktree.fileChanges.slice(0, 6).map((file, index, arr) => {
              const agent = file.agentId ? getAgentById(file.agentId) : null;
              return (
                <div
                  key={file.filename}
                  className={clsx(
                    'flex items-center justify-between px-4 py-2.5 hover:bg-bg-2 transition-colors',
                    index !== arr.length - 1 && 'border-b border-border-1'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        'text-[10px] font-semibold w-3.5',
                        file.changeType === 'added' && 'text-accent-green',
                        file.changeType === 'modified' && 'text-accent-amber',
                        file.changeType === 'deleted' && 'text-accent-red'
                      )}
                    >
                      {file.changeType === 'added' ? 'A' : file.changeType === 'modified' ? 'M' : 'D'}
                    </span>
                    <span className="font-mono text-xs">{file.filename}</span>
                    {agent && (
                      <span className="text-xs" title={agent.name}>{agent.emoji}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-accent-green">+{file.additions}</span>
                    {file.deletions > 0 && (
                      <span className="font-mono text-[11px] text-accent-red">-{file.deletions}</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-text-3" />
                  </div>
                </div>
              );
            })}
            {worktree.fileChanges.length > 6 && (
              <div className="px-4 py-2 text-center text-[11px] text-text-3 border-t border-border-1">
                +{worktree.fileChanges.length - 6} more files
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function PipelineStageCard({ stage, isLast }: { stage: PipelineStage; isLast: boolean }) {
  const agent = stage.agentId ? getAgentById(stage.agentId) : null;

  const statusStyles = {
    pending: 'bg-bg-3 border-border-1 text-text-3',
    active: 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue',
    completed: 'bg-accent-green/20 border-accent-green/50 text-accent-green',
    blocked: 'bg-accent-red/20 border-accent-red/50 text-accent-red',
  };

  return (
    <>
      <div
        className={clsx(
          'flex-1 p-3 rounded-lg border text-center',
          statusStyles[stage.status]
        )}
      >
        <div className="text-xs font-medium mb-1">{stage.name}</div>
        {agent && (
          <div className="text-[10px] flex items-center justify-center gap-1">
            <span>{agent.emoji}</span>
            <span className="opacity-75">{agent.name}</span>
          </div>
        )}
        {stage.status === 'completed' && (
          <div className="text-[10px] mt-1 opacity-75">{stage.completedAt}</div>
        )}
        {stage.status === 'active' && (
          <div className="flex items-center justify-center gap-1 text-[10px] mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            In progress
          </div>
        )}
      </div>
      {!isLast && (
        <ChevronRight className="w-4 h-4 text-text-3 shrink-0" />
      )}
    </>
  );
}

function AgentContributionCard({
  agent,
  worktreeAgent,
}: {
  agent: ReturnType<typeof getAgentById>;
  worktreeAgent: Worktree['agents'][0];
}) {
  if (!agent) return null;

  return (
    <div
      className={clsx(
        'bg-bg-1 border rounded-lg p-3',
        worktreeAgent.isActive
          ? 'border-accent-blue/50'
          : worktreeAgent.role === 'completed'
          ? 'border-accent-green/50'
          : 'border-border-1'
      )}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div
          className={clsx(
            'w-9 h-9 rounded-lg flex items-center justify-center text-lg',
            worktreeAgent.isActive && 'ring-2 ring-accent-green ring-offset-2 ring-offset-bg-1'
          )}
          style={{ backgroundColor: agent.color + '30' }}
        >
          {agent.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{agent.name}</span>
            {worktreeAgent.isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            )}
          </div>
          <div className="text-[10px] text-text-3">
            {worktreeAgent.stage} • {worktreeAgent.role}
          </div>
        </div>
      </div>

      {worktreeAgent.contribution && (
        <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-border-1">
          <div>
            <div className="text-xs font-semibold font-mono">{worktreeAgent.contribution.commits}</div>
            <div className="text-[9px] text-text-3">commits</div>
          </div>
          <div>
            <div className="text-xs font-semibold font-mono">{worktreeAgent.contribution.filesChanged}</div>
            <div className="text-[9px] text-text-3">files</div>
          </div>
          <div>
            <div className="text-xs font-semibold font-mono text-accent-green">+{worktreeAgent.contribution.linesAdded}</div>
            <div className="text-[9px] text-text-3">added</div>
          </div>
          <div>
            <div className="text-xs font-semibold font-mono">${worktreeAgent.contribution.cost.toFixed(2)}</div>
            <div className="text-[9px] text-text-3">cost</div>
          </div>
        </div>
      )}
    </div>
  );
}
