import { WorkspaceShell } from './WorkspaceShell';
import { ProgressPanel } from '@/components/insights/ProgressPanel';
import { CostPanel } from '@/components/insights/CostPanel';
import { AgentPerformanceTable } from '@/components/insights/AgentPerformanceTable';
import { QualitySignalsPanel } from '@/components/insights/QualitySignalsPanel';
import { ActivityTimeline } from '@/components/insights/ActivityTimeline';
import { useV3DataModel } from '@/hooks/useV3DataModel';

export function InsightsWorkspace() {
  const { missions, agents } = useV3DataModel();

  // Progress metrics
  const progressData = {
    missions: {
      total: missions.length,
      completed: missions.filter(m => m.status === 'complete').length,
      inProgress: missions.filter(m => m.status === 'executing').length,
      blocked: missions.filter(m => m.status === 'blocked').length,
    },
    velocity: {
      current: 3.2,
      average: 2.8,
      trend: 'up' as const,
    },
    sprint: {
      name: 'Sprint 12',
      progress: 68,
      daysRemaining: 5,
      completedStories: 17,
      totalStories: 25,
    },
  };

  // Cost metrics
  const totalCost = missions.reduce((sum, m) => sum + m.cost, 0);
  const costData = {
    budget: {
      total: 500.0,
      spent: totalCost,
      remaining: 500.0 - totalCost,
    },
    costByPeriod: [
      { date: 'Week 1', cost: 45.20 },
      { date: 'Week 2', cost: 62.35 },
      { date: 'Week 3', cost: 58.90 },
      { date: 'Week 4', cost: 71.45 },
      { date: 'Week 5', cost: 68.30 },
      { date: 'Current', cost: 52.15 },
    ],
    burnRate: {
      current: 8.65,
      projected: 9.20,
      daysUntilBudgetExhausted: 22,
    },
  };

  // Agent performance data
  const agentPerformanceData = agents.map((agent) => ({
    agentId: agent.id,
    name: agent.name,
    emoji: agent.emoji,
    role: agent.role,
    missions: Math.floor(Math.random() * 10) + 3,
    approvalRate: Math.floor(Math.random() * 20) + 80,
    reworkRate: Math.floor(Math.random() * 15) + 5,
    avgCost: Math.random() * 5 + 2,
    qualityScore: Math.floor(Math.random() * 15) + 85,
  }));

  // Quality signals data
  const qualityData = {
    tests: {
      total: 487,
      passing: 479,
      failing: 3,
      skipped: 5,
    },
    coverage: {
      overall: 84,
      statements: 86,
      branches: 78,
      functions: 88,
      lines: 85,
    },
    lint: {
      errors: 2,
      warnings: 14,
      info: 8,
    },
    security: {
      critical: 0,
      high: 1,
      medium: 3,
      low: 7,
    },
    performance: {
      score: 87,
      issues: 4,
    },
  };

  // Activity timeline data
  const activityEvents = [
    {
      id: 'event-1',
      type: 'mission-completed' as const,
      title: 'User Authentication with JWT completed',
      description: 'All acceptance criteria met, tests passing',
      agentName: 'Alex Architect',
      agentEmoji: '🏗️',
      missionTitle: 'User Authentication with JWT',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'event-2',
      type: 'commit' as const,
      title: 'Add rate limiting middleware',
      description: '3 files changed, +127 lines',
      agentName: 'Charlie Coder',
      agentEmoji: '⚡',
      missionTitle: 'API Security Improvements',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: 'event-3',
      type: 'decision' as const,
      title: 'Chose PostgreSQL for session storage',
      description: 'Decided against Redis due to infrastructure constraints',
      agentName: 'Alex Architect',
      agentEmoji: '🏗️',
      missionTitle: 'User Authentication with JWT',
      timestamp: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    },
    {
      id: 'event-4',
      type: 'approval-rejected' as const,
      title: 'Change rejected: Password validation logic',
      description: 'Need to use bcrypt instead of plain SHA256',
      agentName: 'Charlie Coder',
      agentEmoji: '⚡',
      missionTitle: 'User Authentication with JWT',
      timestamp: new Date(Date.now() - 1000 * 60 * 78).toISOString(),
    },
    {
      id: 'event-5',
      type: 'agent-action' as const,
      title: 'Running security audit',
      description: 'npm audit and OWASP dependency check in progress',
      agentName: 'Taylor Tester',
      agentEmoji: '🧪',
      missionTitle: 'User Authentication with JWT',
      timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    },
    {
      id: 'event-6',
      type: 'file-changed' as const,
      title: 'Updated API documentation',
      description: 'Added authentication endpoints to OpenAPI spec',
      agentName: 'Diana Docs',
      agentEmoji: '📚',
      missionTitle: 'User Authentication with JWT',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'event-7',
      type: 'commit' as const,
      title: 'Refactor user service',
      description: '5 files changed, +245 -180 lines',
      agentName: 'Riley Refactor',
      agentEmoji: '♻️',
      missionTitle: 'Code Quality Sprint',
      timestamp: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
    },
    {
      id: 'event-8',
      type: 'mission-completed' as const,
      title: 'Payment Gateway Integration completed',
      description: 'Stripe integration successful with test coverage',
      agentName: 'Charlie Coder',
      agentEmoji: '⚡',
      missionTitle: 'Payment Gateway Integration',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: 'event-9',
      type: 'decision' as const,
      title: 'Using Stripe for payment processing',
      description: 'Evaluated Stripe vs PayPal - chose Stripe for better API',
      agentName: 'Alex Architect',
      agentEmoji: '🏗️',
      missionTitle: 'Payment Gateway Integration',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    {
      id: 'event-10',
      type: 'file-changed' as const,
      title: 'Added webhook handlers',
      description: 'Created handlers for Stripe payment events',
      agentName: 'Charlie Coder',
      agentEmoji: '⚡',
      missionTitle: 'Payment Gateway Integration',
      timestamp: new Date(Date.now() - 1000 * 60 * 280).toISOString(),
    },
  ];

  return (
    <WorkspaceShell>
      <div className="h-full overflow-auto bg-bg-0">
        <div className="max-w-[1800px] mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-text-1 mb-2">Insights</h1>
            <p className="text-sm text-text-3">
              Analytics, trends, and project health across missions, agents, and quality metrics
            </p>
          </div>

          {/* Top row: Progress and Cost */}
          <div className="grid grid-cols-2 gap-6">
            <ProgressPanel
              missions={progressData.missions}
              velocity={progressData.velocity}
              sprint={progressData.sprint}
            />
            <CostPanel
              budget={costData.budget}
              costByPeriod={costData.costByPeriod}
              burnRate={costData.burnRate}
            />
          </div>

          {/* Agent Performance Table */}
          <AgentPerformanceTable agents={agentPerformanceData} />

          {/* Bottom row: Quality and Activity */}
          <div className="grid grid-cols-2 gap-6">
            <QualitySignalsPanel
              tests={qualityData.tests}
              coverage={qualityData.coverage}
              lint={qualityData.lint}
              security={qualityData.security}
              performance={qualityData.performance}
            />
            <ActivityTimeline events={activityEvents} limit={10} />
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
