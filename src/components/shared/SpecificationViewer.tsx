import { useState } from 'react';
import { clsx } from 'clsx';
import {
  FileText,
  GitBranch,
  Target,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Folder,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Clock,
  XCircle,
  AlertCircle as AlertCircleIcon,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from 'lucide-react';
import type { TaskSpecification } from '@/types';

interface SpecificationViewerProps {
  specification: TaskSpecification;
  userPrompt?: string;
  context?: string;
}

export function SpecificationViewer({ specification, userPrompt, context }: SpecificationViewerProps) {
  const [expandedSections, setExpandedSections] = useState({
    userRequest: true,
    summary: true,
    technicalApproach: true,
    acceptanceCriteria: true,
    scope: true,
    dependencies: specification.dependencies ? true : false,
    risks: specification.risks ? true : false,
    approval: true,
    revisions: specification.revisions ? false : false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const completedCriteria = specification.acceptanceCriteria.filter(ac => ac.completed).length;
  const totalCriteria = specification.acceptanceCriteria.length;
  const completionPercentage = totalCriteria > 0 ? Math.round((completedCriteria / totalCriteria) * 100) : 0;

  // Helper function to get status badge
  const getStatusBadge = () => {
    switch (specification.status) {
      case 'draft':
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-text-3/10 border border-text-3/30 rounded text-[10px]">
            <Clock className="w-3 h-3 text-text-3" />
            <span className="text-text-3 font-medium">Draft</span>
          </div>
        );
      case 'pending_approval':
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-accent-amber/10 border border-accent-amber/30 rounded text-[10px]">
            <AlertCircleIcon className="w-3 h-3 text-accent-amber" />
            <span className="text-accent-amber font-medium">Pending Approval</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-accent-green/10 border border-accent-green/30 rounded text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-accent-green" />
            <span className="text-accent-green font-medium">Approved</span>
          </div>
        );
      case 'changes_requested':
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-accent-blue/10 border border-accent-blue/30 rounded text-[10px]">
            <MessageSquare className="w-3 h-3 text-accent-blue" />
            <span className="text-accent-blue font-medium">Changes Requested</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-accent-red/10 border border-accent-red/30 rounded text-[10px]">
            <XCircle className="w-3 h-3 text-accent-red" />
            <span className="text-accent-red font-medium">Rejected</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-bg-1 rounded-lg border border-border-1">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-purple" />
            <h3 className="text-sm font-semibold text-text-1">Task Specification</h3>
            <span className="text-[10px] text-text-3">• Generated {specification.generatedAt}</span>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Approval Card (if pending approval) */}
      {specification.status === 'pending_approval' && (
        <div className="px-4 py-4 border-b border-border-1 bg-accent-amber/5">
          <SpecificationApprovalCard specification={specification} />
        </div>
      )}

      {/* Feedback/Rejection Info (if changes requested or rejected) */}
      {(specification.status === 'changes_requested' || specification.status === 'rejected') && specification.userFeedback && (
        <div className="px-4 py-3 border-b border-border-1 bg-accent-blue/5">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-text-1 mb-1">User Feedback</p>
              <p className="text-[11px] text-text-2 leading-relaxed">{specification.userFeedback}</p>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-border-1">
        {/* User Request */}
        {(userPrompt || context) && (
          <CollapsibleSection
            title="User Request"
            icon={User}
            expanded={expandedSections.userRequest}
            onToggle={() => toggleSection('userRequest')}
          >
            {userPrompt && (
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-text-3 uppercase tracking-wide mb-1 block">
                  Original Prompt
                </label>
                <p className="text-xs text-text-1 leading-relaxed">{userPrompt}</p>
              </div>
            )}
            {context && (
              <div>
                <label className="text-[10px] font-semibold text-text-3 uppercase tracking-wide mb-1 block">
                  Context
                </label>
                <p className="text-xs text-text-2 leading-relaxed">{context}</p>
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* Summary */}
        <CollapsibleSection
          title="Summary"
          icon={FileText}
          expanded={expandedSections.summary}
          onToggle={() => toggleSection('summary')}
        >
          <p className="text-xs text-text-1 leading-relaxed">{specification.summary}</p>
        </CollapsibleSection>

        {/* Technical Approach */}
        <CollapsibleSection
          title="Technical Approach"
          icon={Code2}
          expanded={expandedSections.technicalApproach}
          onToggle={() => toggleSection('technicalApproach')}
        >
          <div className="space-y-3">
            {/* Repositories */}
            <div>
              <label className="text-[10px] font-semibold text-text-3 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Folder className="w-3 h-3" />
                Repositories ({specification.technicalApproach.repositories.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {specification.technicalApproach.repositories.map((repo) => (
                  <span
                    key={repo}
                    className="text-[10px] font-mono px-2 py-1 bg-bg-2 border border-border-1 rounded"
                  >
                    {repo}
                  </span>
                ))}
              </div>
            </div>

            {/* Components */}
            <div>
              <label className="text-[10px] font-semibold text-text-3 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                Components ({specification.technicalApproach.components.length})
              </label>
              <div className="space-y-1">
                {specification.technicalApproach.components.map((component) => (
                  <div
                    key={component}
                    className="text-[10px] font-mono px-2 py-1 bg-bg-2 border border-border-1 rounded text-text-2"
                  >
                    {component}
                  </div>
                ))}
              </div>
            </div>

            {/* Design */}
            <div>
              <label className="text-[10px] font-semibold text-text-3 uppercase tracking-wide mb-1.5">
                Design
              </label>
              <p className="text-xs text-text-1 leading-relaxed">{specification.technicalApproach.design}</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Acceptance Criteria */}
        <CollapsibleSection
          title={`Acceptance Criteria (${completedCriteria}/${totalCriteria} • ${completionPercentage}%)`}
          icon={Target}
          expanded={expandedSections.acceptanceCriteria}
          onToggle={() => toggleSection('acceptanceCriteria')}
          badge={
            completionPercentage === 100 ? (
              <span className="text-[10px] px-1.5 py-0.5 bg-accent-green/20 text-accent-green rounded">
                Complete
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 bg-accent-blue/20 text-accent-blue rounded">
                {completionPercentage}%
              </span>
            )
          }
        >
          <div className="space-y-2">
            {specification.acceptanceCriteria.map((criterion) => (
              <div
                key={criterion.id}
                className="flex items-start gap-2.5 px-3 py-2 bg-bg-2 border border-border-1 rounded"
              >
                <div className="pt-0.5">
                  {criterion.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded border-2 border-border-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={clsx(
                      'text-[11px] leading-relaxed',
                      criterion.completed ? 'text-text-3 line-through' : 'text-text-1'
                    )}
                  >
                    {criterion.description}
                  </p>
                  {criterion.completed && criterion.completedAt && (
                    <p className="text-[10px] text-text-3 mt-1">
                      ✓ {criterion.completedAt}
                      {criterion.verifiedBy && ` • ${criterion.verifiedBy}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Estimated Scope */}
        <CollapsibleSection
          title="Estimated Scope"
          icon={GitBranch}
          expanded={expandedSections.scope}
          onToggle={() => toggleSection('scope')}
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="px-3 py-2 bg-bg-2 border border-border-1 rounded">
              <label className="text-[10px] text-text-3 mb-1 block">Files</label>
              <span className="text-sm font-semibold text-text-1">{specification.estimatedScope.files}</span>
            </div>
            <div className="px-3 py-2 bg-bg-2 border border-border-1 rounded">
              <label className="text-[10px] text-text-3 mb-1 block">Complexity</label>
              <span
                className={clsx(
                  'text-sm font-semibold capitalize',
                  specification.estimatedScope.complexity === 'simple' && 'text-accent-green',
                  specification.estimatedScope.complexity === 'moderate' && 'text-accent-amber',
                  specification.estimatedScope.complexity === 'complex' && 'text-accent-red'
                )}
              >
                {specification.estimatedScope.complexity}
              </span>
            </div>
            {specification.estimatedScope.estimatedCost !== undefined && (
              <div className="px-3 py-2 bg-bg-2 border border-border-1 rounded">
                <label className="text-[10px] text-text-3 mb-1 block">Est. Cost</label>
                <span className="text-sm font-semibold text-accent-green flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {specification.estimatedScope.estimatedCost.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Dependencies */}
        {specification.dependencies && (
          <CollapsibleSection
            title="Dependencies"
            icon={GitBranch}
            expanded={expandedSections.dependencies}
            onToggle={() => toggleSection('dependencies')}
          >
            <div className="space-y-3">
              {specification.dependencies.blockedBy && specification.dependencies.blockedBy.length > 0 && (
                <div>
                  <label className="text-[10px] font-semibold text-text-3 uppercase tracking-wide mb-1.5 block">
                    Blocked By
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {specification.dependencies.blockedBy.map((taskId) => (
                      <span
                        key={taskId}
                        className="text-[10px] font-mono px-2 py-1 bg-accent-red/10 border border-accent-red/30 text-accent-red rounded"
                      >
                        {taskId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {specification.dependencies.requires && specification.dependencies.requires.length > 0 && (
                <div>
                  <label className="text-[10px] font-semibold text-text-3 uppercase tracking-wide mb-1.5 block">
                    Requires
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {specification.dependencies.requires.map((req) => (
                      <span
                        key={req}
                        className="text-[10px] px-2 py-1 bg-accent-blue/10 border border-accent-blue/30 text-accent-blue rounded"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Risks */}
        {specification.risks && specification.risks.length > 0 && (
          <CollapsibleSection
            title={`Risks (${specification.risks.length})`}
            icon={AlertTriangle}
            expanded={expandedSections.risks}
            onToggle={() => toggleSection('risks')}
          >
            <div className="space-y-1.5">
              {specification.risks.map((risk, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 px-3 py-2 bg-accent-amber/5 border border-accent-amber/20 rounded"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-accent-amber shrink-0 mt-0.5" />
                  <p className="text-[11px] text-text-1 leading-relaxed">{risk}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Approval Info */}
        {specification.approvedAt && (
          <CollapsibleSection
            title="Approval"
            icon={CheckCircle2}
            expanded={expandedSections.approval}
            onToggle={() => toggleSection('approval')}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3.5 h-3.5 text-text-3" />
                <span className="text-text-3">Approved:</span>
                <span className="text-text-1">{specification.approvedAt}</span>
              </div>
              {specification.approvedBy && (
                <div className="flex items-center gap-2 text-xs">
                  <User className="w-3.5 h-3.5 text-text-3" />
                  <span className="text-text-3">By:</span>
                  <span className="text-text-1">{specification.approvedBy}</span>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Revisions */}
        {specification.revisions && specification.revisions.length > 0 && (
          <CollapsibleSection
            title={`Revisions (${specification.revisions.length})`}
            icon={GitBranch}
            expanded={expandedSections.revisions}
            onToggle={() => toggleSection('revisions')}
          >
            <div className="space-y-2">
              {specification.revisions.map((revision) => (
                <div
                  key={revision.version}
                  className="px-3 py-2 bg-bg-2 border border-border-1 rounded"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-text-1">Version {revision.version}</span>
                    <span className="text-[10px] text-text-3">{revision.changedAt}</span>
                  </div>
                  <p className="text-[11px] text-text-2 leading-relaxed">{revision.changes}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}

// Collapsible section component
interface CollapsibleSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  expanded: boolean;
  onToggle: () => void;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon: Icon,
  expanded,
  onToggle,
  badge,
  children,
}: CollapsibleSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-2 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-text-3" />
          <span className="text-xs font-semibold text-text-1">{title}</span>
          {badge}
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-text-3" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-3" />
        )}
      </button>
      {expanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// Specification Approval Card
interface SpecificationApprovalCardProps {
  specification: TaskSpecification;
}

function SpecificationApprovalCard({ specification }: SpecificationApprovalCardProps) {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleApprove = () => {
    console.log('Approving specification');
    // In real app: call API to approve spec
    alert('Specification approved! Work can now begin.');
  };

  const handleRequestChanges = () => {
    if (!feedback.trim()) {
      alert('Please provide feedback about what changes are needed.');
      return;
    }
    console.log('Requesting changes:', feedback);
    // In real app: call API to request changes
    alert('Changes requested. AI will revise the specification.');
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    console.log('Rejecting specification:', feedback);
    // In real app: call API to reject spec
    alert('Specification rejected.');
  };

  return (
    <div className="space-y-3">
      {/* Alert Banner */}
      <div className="flex items-start gap-2 px-3 py-2 bg-accent-amber/10 border border-accent-amber/30 rounded">
        <AlertCircleIcon className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-text-1 mb-1">Specification Ready for Review</p>
          <p className="text-[11px] text-text-2 leading-relaxed">
            The AI has generated a specification for this task. Please review the technical approach, acceptance criteria, and risks before approving. Work cannot begin until you approve this specification.
          </p>
        </div>
      </div>

      {/* Summary Preview */}
      <div className="px-3 py-2 bg-bg-2 border border-border-1 rounded">
        <p className="text-[10px] font-semibold text-text-3 uppercase tracking-wide mb-1">Quick Summary</p>
        <p className="text-xs text-text-1 leading-relaxed">{specification.summary}</p>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-text-3">
          <span>{specification.estimatedScope.files} files</span>
          <span>•</span>
          <span className="capitalize">{specification.estimatedScope.complexity} complexity</span>
          {specification.estimatedScope.estimatedCost && (
            <>
              <span>•</span>
              <span>${specification.estimatedScope.estimatedCost.toFixed(2)} estimated</span>
            </>
          )}
        </div>
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div>
          <label className="text-xs font-semibold text-text-1 mb-2 block">
            Feedback or requested changes:
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Describe what changes are needed or why you're rejecting this specification..."
            className="w-full px-3 py-2 text-xs bg-bg-0 border border-border-1 rounded resize-none focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
            rows={3}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleApprove}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-accent-green text-white rounded hover:brightness-110 transition-all"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Approve & Start Work
        </button>
        <button
          onClick={() => {
            setShowFeedback(!showFeedback);
            if (!showFeedback) setFeedback('');
          }}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-all',
            showFeedback
              ? 'bg-bg-2 border border-border-1 text-text-2'
              : 'bg-accent-blue text-white hover:brightness-110'
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {showFeedback ? 'Cancel' : 'Request Changes'}
        </button>
        <button
          onClick={() => {
            setShowFeedback(!showFeedback);
            if (!showFeedback) setFeedback('');
          }}
          className={clsx(
            'flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-all',
            showFeedback
              ? 'bg-bg-2 border border-border-1 text-text-2'
              : 'bg-accent-red text-white hover:brightness-110'
          )}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          {showFeedback ? 'Hide' : 'Reject'}
        </button>
      </div>

      {/* Submit Feedback Button */}
      {showFeedback && feedback.trim() && (
        <div className="flex gap-2">
          <button
            onClick={handleRequestChanges}
            className="flex-1 px-4 py-2 text-xs font-semibold bg-accent-blue text-white rounded hover:brightness-110 transition-all"
          >
            Submit Change Request
          </button>
          <button
            onClick={handleReject}
            className="flex-1 px-4 py-2 text-xs font-semibold bg-accent-red text-white rounded hover:brightness-110 transition-all"
          >
            Submit Rejection
          </button>
        </div>
      )}
    </div>
  );
}
