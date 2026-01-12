import { useState } from 'react';
import { WorkspaceShell } from './WorkspaceShell';
import { ReviewQueue } from '@/components/review/ReviewQueue';
import { ChangeReviewDetail } from '@/components/review/ChangeReviewDetail';
import { BatchApprovalPanel } from '@/components/review/BatchApprovalPanel';
import { CheckSquare, Layers } from 'lucide-react';
import type { Approval } from '@/types';

interface ReviewSurfaceProps {
  selectedMissionId?: string | null;
  onNavigateToMission?: (missionId: string) => void;
  onNavigateToConversation?: (missionId: string) => void;
}

export function ReviewSurface({
  selectedMissionId: _selectedMissionId, // Reserved for future use (auto-selecting review items)
  onNavigateToMission,
  onNavigateToConversation,
}: ReviewSurfaceProps) {
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [showBatchApproval, setShowBatchApproval] = useState(false);

  // Mock approvals data - in real app, this would come from API
  const mockApprovals: Approval[] = [
    {
      id: 'approval-1',
      type: 'change',
      title: 'Add JWT token generation endpoint',
      description: 'Create POST /auth/token endpoint that generates JWT tokens for authenticated users',
      agentId: 'agent-architect-01',
      status: 'pending',
      confidence: 95,
      priority: 'high',
      reasoning: 'This endpoint is critical for the authentication flow. Using industry-standard JWT libraries ensures security and compatibility.',
      affectedFiles: ['src/auth/routes.ts', 'src/auth/jwt.service.ts'],
      impact: 'New endpoint that other services will depend on for authentication',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'approval-2',
      type: 'decision',
      title: 'Use Redis for session storage',
      description: 'Store user sessions in Redis instead of PostgreSQL for better performance',
      agentId: 'agent-architect-01',
      status: 'pending',
      confidence: 85,
      priority: 'high',
      requiresInput: true,
      question: 'Should we use Redis for session storage? This adds a new infrastructure dependency but significantly improves performance.',
      reasoning: 'Redis provides sub-millisecond latency for session lookups, while PostgreSQL queries take 10-50ms. For high-traffic applications, this matters.',
      impact: 'Requires Redis deployment and adds operational complexity',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'approval-3',
      type: 'change',
      title: 'Implement password hashing with bcrypt',
      description: 'Hash user passwords using bcrypt with salt rounds of 12',
      agentId: 'agent-implementer-02',
      status: 'pending',
      confidence: 98,
      priority: 'critical',
      reasoning: 'Bcrypt is the industry standard for password hashing. Using 12 rounds balances security and performance.',
      affectedFiles: ['src/auth/password.service.ts', 'src/users/user.entity.ts'],
      impact: 'Critical security implementation - must be done correctly',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'approval-4',
      type: 'action',
      title: 'Run security audit before deployment',
      description: 'Execute npm audit and OWASP dependency check',
      agentId: 'agent-tester-01',
      status: 'pending',
      confidence: 92,
      priority: 'high',
      reasoning: 'Security audit is essential before deploying authentication changes to production',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: 'approval-5',
      type: 'change',
      title: 'Add rate limiting to auth endpoints',
      description: 'Implement rate limiting (5 attempts per 15 minutes) on login and token endpoints',
      agentId: 'agent-implementer-02',
      status: 'pending',
      confidence: 88,
      priority: 'medium',
      reasoning: 'Rate limiting prevents brute force attacks on authentication endpoints',
      affectedFiles: ['src/middleware/rate-limit.ts', 'src/auth/routes.ts'],
      impact: 'Protects against brute force attacks but may impact legitimate users if too restrictive',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
      id: 'approval-6',
      type: 'decision',
      title: 'Token expiration: 15 minutes or 1 hour?',
      description: 'Choose JWT token expiration time - shorter is more secure, longer is more convenient',
      agentId: 'agent-architect-01',
      status: 'pending',
      confidence: 65,
      priority: 'medium',
      requiresInput: true,
      question: 'What should the JWT token expiration time be? 15 minutes requires refresh tokens but is more secure. 1 hour is more convenient but less secure if tokens are compromised.',
      reasoning: 'Industry standard is 15-60 minutes for access tokens with refresh tokens for longer sessions',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 'approval-7',
      type: 'change',
      title: 'Add user login endpoint with validation',
      description: 'Create POST /auth/login with email/password validation and error handling',
      agentId: 'agent-implementer-02',
      status: 'pending',
      confidence: 94,
      priority: 'high',
      reasoning: 'Login endpoint with proper validation and error handling is essential for security',
      affectedFiles: ['src/auth/routes.ts', 'src/auth/auth.controller.ts', 'src/auth/dto/login.dto.ts'],
      impact: 'Core authentication functionality',
      timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    },
    {
      id: 'approval-8',
      type: 'action',
      title: 'Update API documentation',
      description: 'Document all new authentication endpoints in OpenAPI spec',
      agentId: 'agent-docs-01',
      status: 'pending',
      confidence: 90,
      priority: 'medium',
      reasoning: 'API documentation must be updated before frontend can integrate',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    },
  ];

  const selectedApproval = mockApprovals.find(a => a.id === selectedApprovalId);
  const pendingCount = mockApprovals.filter(a => a.status === 'pending').length;
  const highConfidenceCount = mockApprovals.filter(
    a => a.status === 'pending' && (a.confidence || 0) >= 90
  ).length;

  const handleApprove = (approvalId: string) => {
    console.log('Approve:', approvalId);
    // In real app, update approval status
    // For now, just deselect
    setSelectedApprovalId(null);
  };

  const handleReject = (approvalId: string, reason?: string) => {
    console.log('Reject:', approvalId, reason);
    setSelectedApprovalId(null);
  };

  const handleBatchApprove = (approvalIds: string[]) => {
    console.log('Batch approve:', approvalIds);
    setShowBatchApproval(false);
  };

  const handleAnswerUncertainty = (response: 'yes' | 'no' | 'clarify') => {
    console.log('Answer uncertainty:', response);
    // In real app, send response to agent
  };

  return (
    <WorkspaceShell>
      <div className="flex flex-col h-full bg-bg-0">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border-1 bg-bg-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-text-1 mb-1">Review Surface</h1>
              <p className="text-sm text-text-3">
                {pendingCount} items pending review
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="flex items-center gap-6 px-4 py-2 bg-bg-1 rounded-lg border border-border-1">
                <div className="text-center">
                  <div className="text-lg font-semibold text-accent-amber">{pendingCount}</div>
                  <div className="text-xs text-text-3">Total</div>
                </div>
                <div className="w-px h-8 bg-border-1" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-accent-green">{highConfidenceCount}</div>
                  <div className="text-xs text-text-3">High Confidence</div>
                </div>
              </div>

              {/* Batch Approve Button */}
              <button
                onClick={() => setShowBatchApproval(true)}
                disabled={highConfidenceCount === 0}
                className="flex items-center gap-2 px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Batch Approve</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {selectedApproval ? (
            // Three-column layout: Queue | Detail | Context
            <div className="grid grid-cols-[320px_1fr_360px] h-full">
              {/* Left: Review Queue */}
              <ReviewQueue
                approvals={mockApprovals}
                selectedApprovalId={selectedApprovalId}
                onSelectApproval={setSelectedApprovalId}
              />

              {/* Middle: Detail View */}
              <div className="border-r border-border-1">
                <ChangeReviewDetail
                  approval={selectedApproval}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onAnswerUncertainty={handleAnswerUncertainty}
                />
              </div>

              {/* Right: Context Panel */}
              <div className="flex flex-col h-full bg-bg-0 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Mission Context */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
                      Mission Context
                    </h3>
                    <div className="bg-bg-1 p-4 rounded-lg border border-border-1 space-y-3">
                      <div>
                        <div className="text-xs text-text-3 mb-1">Part of Mission</div>
                        <div className="text-sm font-medium text-text-1">User Authentication with JWT</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-3 mb-1">Current Phase</div>
                        <div className="text-sm text-text-1">Executing</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-3 mb-1">Progress</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-bg-2 rounded-full overflow-hidden">
                            <div className="h-full bg-accent-green rounded-full" style={{ width: '65%' }} />
                          </div>
                          <span className="text-xs font-medium text-text-2">65%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related Items */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
                      Related Items
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-bg-1 rounded border border-border-1 text-sm text-text-2">
                        <Layers className="w-4 h-4 text-text-3" />
                        <span>3 other changes in this batch</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-bg-1 rounded border border-border-1 text-sm text-text-2">
                        <Layers className="w-4 h-4 text-text-3" />
                        <span>2 pending decisions</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          // In a real app, approvals would have a missionId
                          // For now, use a placeholder mission ID
                          const missionId = (selectedApproval as any).missionId || 'mission-payment-202';
                          onNavigateToMission?.(missionId);
                        }}
                        className="w-full text-left px-3 py-2 bg-bg-1 hover:bg-bg-2 rounded border border-border-1 text-sm text-text-1 transition-colors"
                      >
                        View in Diff Panel
                      </button>
                      <button
                        onClick={() => {
                          const missionId = (selectedApproval as any).missionId || 'mission-payment-202';
                          onNavigateToMission?.(missionId);
                        }}
                        className="w-full text-left px-3 py-2 bg-bg-1 hover:bg-bg-2 rounded border border-border-1 text-sm text-text-1 transition-colors"
                      >
                        View Mission Details
                      </button>
                      <button
                        onClick={() => {
                          const missionId = (selectedApproval as any).missionId || 'mission-payment-202';
                          onNavigateToConversation?.(missionId);
                        }}
                        className="w-full text-left px-3 py-2 bg-bg-1 hover:bg-bg-2 rounded border border-border-1 text-sm text-text-1 transition-colors"
                      >
                        View Conversation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Empty state: Just show queue
            <div className="grid grid-cols-[320px_1fr] h-full">
              <ReviewQueue
                approvals={mockApprovals}
                selectedApprovalId={selectedApprovalId}
                onSelectApproval={setSelectedApprovalId}
              />
              <div className="flex items-center justify-center border-l border-border-1 bg-bg-0">
                <div className="text-center space-y-3 max-w-md px-6">
                  <CheckSquare className="w-12 h-12 mx-auto text-text-3 opacity-50" />
                  <h2 className="text-lg font-semibold text-text-2">Select an item to review</h2>
                  <p className="text-sm text-text-3">
                    Choose an item from the queue to see details, reasoning, and approve or reject the change.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Batch Approval Modal */}
      {showBatchApproval && (
        <BatchApprovalPanel
          approvals={mockApprovals}
          onBatchApprove={handleBatchApprove}
          onClose={() => setShowBatchApproval(false)}
        />
      )}
    </WorkspaceShell>
  );
}
