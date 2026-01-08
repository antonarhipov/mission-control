import { clsx } from 'clsx';
import {
  GitCommit,
  DollarSign,
  Users,
  Folder,
  FileText,
  ChevronRight,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useDataModel } from '@/hooks/useDataModel';
import { SpecificationViewer } from './SpecificationViewer';
import type { TaskV2, Repository, TaskCommit, TaskFileChange, PipelineStageV2, Agent } from '@/types';

interface PipelineDetailViewProps {
  task: TaskV2;
  onNavigateToDiff: (taskId: string, commitSha?: string) => void;
  focusedCriterionId?: string;
}

export function PipelineDetailView({ task, onNavigateToDiff, focusedCriterionId }: PipelineDetailViewProps) {
  const { getTeamById, getRepositoryById, getAgentById } = useDataModel();
  const team = getTeamById(task.teamId);

  // Group data by repository for display
  const repoData = groupTaskDataByRepository(task, getRepositoryById);

  return (
    <div className="flex-1 overflow-auto bg-bg-0">
      {/* Task Header */}
      <header className="px-6 py-4 border-b border-border-1 bg-bg-1 shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-sm font-medium text-text-3">{task.id}</span>
              <div
                className={clsx(
                  'w-2 h-2 rounded-sm',
                  task.priority === 'critical' && 'bg-accent-red',
                  task.priority === 'high' && 'bg-accent-red',
                  task.priority === 'medium' && 'bg-accent-amber',
                  task.priority === 'low' && 'bg-accent-green'
                )}
              />
              <span className={clsx(
                'text-xs font-medium px-2 py-0.5 rounded',
                task.status === 'planning' && 'bg-accent-purple/20 text-accent-purple',
                task.status === 'in-progress' && 'bg-accent-blue/20 text-accent-blue',
                task.status === 'review' && 'bg-accent-amber/20 text-accent-amber',
                task.status === 'done' && 'bg-accent-green/20 text-accent-green',
                task.status === 'blocked' && 'bg-accent-red/20 text-accent-red',
                task.status === 'backlog' && 'bg-text-3/20 text-text-2'
              )}>
                {task.status === 'in-progress' ? 'In Progress' : task.status === 'planning' ? 'Planning' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>
            <h1 className="text-lg font-semibold mb-2">{task.title}</h1>
            {task.description && (
              <p className="text-sm text-text-2 leading-relaxed">{task.description}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 ml-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-2 rounded-md">
              <DollarSign className="w-4 h-4 text-accent-green" />
              <span className="text-sm font-semibold text-accent-green">
                ${task.totalCost.toFixed(2)}
              </span>
            </div>
            {team && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-2 rounded-md">
                <Users className="w-4 h-4 text-text-3" />
                <span className="text-xs text-text-2">{team.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className={clsx(
                  'text-[10px] font-medium px-2 py-0.5 rounded',
                  tag === 'feature' && 'bg-accent-purple/20 text-accent-purple',
                  tag === 'bug' && 'bg-accent-red/20 text-accent-red',
                  tag === 'refactor' && 'bg-accent-cyan/20 text-accent-cyan',
                  tag === 'docs' && 'bg-accent-blue/20 text-accent-blue',
                  tag === 'backend' && 'bg-accent-green/20 text-accent-green',
                  tag === 'api' && 'bg-accent-amber/20 text-accent-amber',
                  tag === 'database' && 'bg-accent-purple/20 text-accent-purple',
                  tag === 'migration' && 'bg-accent-cyan/20 text-accent-cyan'
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content sections */}
      <div className="p-6 space-y-6">
        {/* Specification Viewer (if specification exists) */}
        {task.specification && (
          <SpecificationViewer
            specification={task.specification}
            userPrompt={task.userPrompt}
            context={task.context}
            focusedCriterionId={focusedCriterionId}
          />
        )}

        {/* Pipeline Visualization */}
        <Section title="Pipeline Progress" icon={TrendingUp}>
          <PipelineStages stages={task.pipeline} currentStage={task.currentStage} />
        </Section>

        {/* Repositories Involved */}
        <Section title={`Repositories (${repoData.size})`} icon={Folder}>
          <div className="grid grid-cols-2 gap-3">
            {Array.from(repoData.values()).map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
          </div>
        </Section>

        {/* Agent Contributions */}
        <Section title="Agent Contributions" icon={Users}>
          <div className="space-y-2">
            {task.agents.map((taskAgent) => {
              const agent = getAgentById(taskAgent.agentId);
              if (!agent) return null;
              return (
                <AgentContributionCard
                  key={taskAgent.agentId}
                  agent={agent}
                  taskAgent={taskAgent}
                />
              );
            })}
          </div>
        </Section>

        {/* Recent Commits */}
        <Section
          title={`Recent Commits (${task.commits.length})`}
          icon={GitCommit}
          action={
            <button
              onClick={() => onNavigateToDiff(task.id)}
              className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blue/80 font-medium"
            >
              View All Diffs
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="space-y-2">
            {task.commits.slice(0, 10).map((commit) => {
              const repo = getRepositoryById(commit.repositoryId);
              return (
                <CommitRow
                  key={commit.sha}
                  commit={commit}
                  repository={repo}
                  onViewDiff={() => onNavigateToDiff(task.id, commit.sha)}
                />
              );
            })}
          </div>
        </Section>

        {/* Changed Files */}
        <Section title={`Changed Files (${task.fileChanges.length})`} icon={FileText}>
          {Array.from(repoData.entries()).map(([repoId, data]) => (
            <div key={repoId} className="mb-4 last:mb-0">
              <h4 className="text-xs font-semibold text-text-2 mb-2 flex items-center gap-2">
                <Folder className="w-3.5 h-3.5" />
                {data.name}
                <span className="text-[10px] text-text-3 font-normal">
                  ({data.files.length} {data.files.length === 1 ? 'file' : 'files'})
                </span>
              </h4>
              <div className="space-y-1">
                {data.files.map((file) => (
                  <FileRow key={file.id} file={file} />
                ))}
              </div>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

// Helper function to group task data by repository
function groupTaskDataByRepository(
  task: TaskV2,
  getRepositoryById: (id: string) => Repository | undefined
): Map<string, { id: string; name: string; files: TaskFileChange[] }> {
  const repoMap = new Map<string, { id: string; name: string; files: TaskFileChange[] }>();

  task.fileChanges.forEach((file) => {
    if (!repoMap.has(file.repositoryId)) {
      const repo = getRepositoryById(file.repositoryId);
      repoMap.set(file.repositoryId, {
        id: file.repositoryId,
        name: repo?.name || file.repositoryId,
        files: [],
      });
    }
    repoMap.get(file.repositoryId)!.files.push(file);
  });

  return repoMap;
}

// Section component for consistent styling
interface SectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon: Icon, action, children }: SectionProps) {
  return (
    <section className="bg-bg-1 rounded-lg border border-border-1 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text-2 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// Pipeline stages visualization
interface PipelineStagesProps {
  stages: PipelineStageV2[];
  currentStage: string;
}

function PipelineStages({ stages, currentStage }: PipelineStagesProps) {
  return (
    <div className="flex items-center gap-2">
      {stages.map((stage, index) => {
        const isCurrent = stage.name === currentStage;
        const isCompleted = stage.status === 'completed';
        const isActive = stage.status === 'active';
        const isBlocked = stage.status === 'blocked';

        return (
          <div key={stage.id} className="flex items-center flex-1">
            <div
              className={clsx(
                'flex-1 px-3 py-2 rounded-md border-2 transition-all',
                isCurrent && 'ring-2 ring-accent-blue ring-offset-2 ring-offset-bg-0',
                isCompleted && 'bg-accent-green/20 border-accent-green',
                isActive && 'bg-accent-blue/20 border-accent-blue',
                isBlocked && 'bg-accent-red/20 border-accent-red',
                !isCompleted && !isActive && !isBlocked && 'bg-bg-2 border-border-1'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={clsx(
                  'text-xs font-medium',
                  isCompleted && 'text-accent-green',
                  isActive && 'text-accent-blue',
                  isBlocked && 'text-accent-red',
                  !isCompleted && !isActive && !isBlocked && 'text-text-3'
                )}>
                  {stage.name}
                </span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" />}
                {isActive && <Clock className="w-3.5 h-3.5 text-accent-blue animate-pulse" />}
                {isBlocked && <AlertCircle className="w-3.5 h-3.5 text-accent-red" />}
              </div>
              <div className="text-[10px] text-text-3">
                Cost: ${stage.cost.toFixed(2)}
              </div>
            </div>
            {index < stages.length - 1 && (
              <ChevronRight className="w-4 h-4 text-text-3 mx-1 shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Repository card
interface RepositoryCardProps {
  repo: { id: string; name: string; files: TaskFileChange[] };
}

function RepositoryCard({ repo }: RepositoryCardProps) {
  const totalAdditions = repo.files.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = repo.files.reduce((sum, f) => sum + f.deletions, 0);

  return (
    <div className="bg-bg-2 border border-border-1 rounded-md p-3">
      <div className="flex items-center gap-2 mb-2">
        <Folder className="w-4 h-4 text-text-3" />
        <span className="text-xs font-medium text-text-1">{repo.name}</span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-text-3">
        <span>{repo.files.length} files</span>
        <span className="text-accent-green">+{totalAdditions}</span>
        <span className="text-accent-red">-{totalDeletions}</span>
      </div>
    </div>
  );
}

// Agent contribution card
interface AgentContributionCardProps {
  agent: Agent;
  taskAgent: TaskV2['agents'][0];
}

function AgentContributionCard({ agent, taskAgent }: AgentContributionCardProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-bg-2 border border-border-1 rounded-md">
      <div
        className="w-8 h-8 rounded flex items-center justify-center text-sm"
        style={{ backgroundColor: agent.color + '40' }}
      >
        {agent.emoji}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium">{agent.name}</span>
          <span className={clsx(
            'text-[10px] px-1.5 py-0.5 rounded',
            taskAgent.role === 'primary' && 'bg-accent-blue/20 text-accent-blue',
            taskAgent.role === 'supporting' && 'bg-text-3/20 text-text-2',
            taskAgent.role === 'waiting' && 'bg-accent-amber/20 text-accent-amber',
            taskAgent.role === 'completed' && 'bg-accent-green/20 text-accent-green'
          )}>
            {taskAgent.role}
          </span>
          {taskAgent.isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          )}
        </div>
        <div className="text-[10px] text-text-3">
          Stage: {taskAgent.stage}
        </div>
      </div>
      {taskAgent.contribution && (
        <div className="text-right">
          <div className="text-xs font-medium text-accent-green">
            ${taskAgent.contribution.cost.toFixed(2)}
          </div>
          <div className="text-[10px] text-text-3">
            {taskAgent.contribution.commits} commits
          </div>
        </div>
      )}
    </div>
  );
}

// Commit row
interface CommitRowProps {
  commit: TaskCommit;
  repository?: Repository;
  onViewDiff: () => void;
}

function CommitRow({ commit, repository, onViewDiff }: CommitRowProps) {
  const { getAgentById } = useDataModel();
  const agent = commit.agentId ? getAgentById(commit.agentId) : undefined;

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-bg-2 border border-border-1 rounded-md hover:bg-bg-3 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[10px] text-text-3">
            {commit.sha.slice(0, 7)}
          </span>
          {repository && (
            <span className="text-[10px] text-text-3 flex items-center gap-1">
              <Folder className="w-3 h-3" />
              {repository.name}
            </span>
          )}
          {agent && (
            <span
              className="w-4 h-4 rounded flex items-center justify-center text-[8px]"
              style={{ backgroundColor: agent.color + '60' }}
            >
              {agent.emoji}
            </span>
          )}
        </div>
        <p className="text-xs text-text-1 truncate">{commit.message}</p>
        <div className="flex items-center gap-3 text-[10px] text-text-3 mt-1">
          <span>{commit.filesChanged} files</span>
          <span className="text-accent-green">+{commit.additions}</span>
          <span className="text-accent-red">-{commit.deletions}</span>
          <span className="text-accent-green">${commit.cost.totalCost.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={onViewDiff}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-accent-blue hover:text-accent-blue/80 font-medium"
      >
        View
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
}

// File row
interface FileRowProps {
  file: TaskFileChange;
}

function FileRow({ file }: FileRowProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-bg-2 rounded text-xs hover:bg-bg-3 transition-colors">
      <FileText className={clsx(
        'w-3.5 h-3.5',
        file.changeType === 'added' && 'text-accent-green',
        file.changeType === 'modified' && 'text-accent-blue',
        file.changeType === 'deleted' && 'text-accent-red'
      )} />
      <span className="font-mono text-[10px] text-text-3 uppercase">
        {file.changeType[0]}
      </span>
      <span className="flex-1 truncate text-text-2">{file.path}</span>
      <span className="text-[10px] text-accent-green">+{file.additions}</span>
      <span className="text-[10px] text-accent-red">-{file.deletions}</span>
    </div>
  );
}
