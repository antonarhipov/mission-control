import { useState, useCallback } from 'react';
import { WorkspaceShell } from './WorkspaceShell';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import { AgentMemoryPanel } from '@/components/settings/AgentMemoryPanel';
import { RepositoryUnderstandingPanel } from '@/components/settings/RepositoryUnderstandingPanel';
import { SkillsCatalogue } from '@/components/settings/SkillsCatalogue';
import { TeamMemoryPanel } from '@/components/settings/TeamMemoryPanel';
import { Brain, Folder, Code, Users, DollarSign, Puzzle } from 'lucide-react';
import type { AgentMemory, TeamMemory, AgentSkill, RepositoryUnderstanding, PipelineConfiguration, Team } from '@/types';

type SettingsTab = 'agents' | 'repositories' | 'skills' | 'teams' | 'budgets' | 'integrations';

export function SettingsWorkspace() {
  const { agents, repositories, teams: initialTeams } = useV3DataModel();
  const [activeTab, setActiveTab] = useState<SettingsTab>('agents');

  // LOCAL STATE: Teams (allow editing pipelines and membership)
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  // Mock data state for agent memories
  const [agentMemories, setAgentMemories] = useState<Record<string, AgentMemory>>(() => {
    const memories: Record<string, AgentMemory> = {};
    agents.forEach(agent => {
      memories[agent.id] = {
        projectUnderstanding: `${agent.name} has comprehensive understanding of the project architecture and best practices.`,
        conventions: [
          'Use TypeScript strict mode',
          'Follow component-based architecture',
          'Write tests for all business logic',
        ],
        pastDecisions: [
          {
            missionId: 'mission-001',
            decision: 'Decided to use React with TypeScript for frontend',
            outcome: 'Improved type safety and developer experience'
          },
          {
            missionId: 'mission-002',
            decision: 'Adopted Tailwind CSS for styling consistency',
            outcome: 'Faster development with consistent design system'
          },
        ],
      };
    });
    return memories;
  });

  // Mock data state for team memories
  const [teamMemories, setTeamMemories] = useState<Record<string, TeamMemory>>(() => {
    const memories: Record<string, TeamMemory> = {};
    teams.forEach(team => {
      memories[team.id] = {
        teamId: team.id,
        sharedDecisions: [
          'All features must pass code review',
          'Test coverage must be above 80%',
        ],
      };
    });
    return memories;
  });

  // Mock data state for repository understanding
  const [repoUnderstanding] = useState<Record<string, RepositoryUnderstanding>>(() => {
    const understanding: Record<string, RepositoryUnderstanding> = {};
    repositories.forEach(repo => {
      understanding[repo.id] = {
        summary: `${repo.name} is a well-structured project following modern development practices.`,
        patterns: [
          'Component-based architecture',
          'Hooks-based state management',
          'Tailwind CSS utility classes',
          'Type-safe interfaces',
        ],
        architecture: {
          type: 'component-based',
          layers: ['UI Components', 'Business Logic', 'Data Layer'],
          keyComponents: ['App.tsx', 'WorkspaceShell', 'DataModel'],
        },
        conventions: [
          {
            category: 'naming',
            description: 'Use PascalCase for component names',
            example: 'export function UserProfile() { ... }',
          },
          {
            category: 'formatting',
            description: 'Use 2-space indentation',
          },
        ],
        confidence: 85,
        analyzedAt: new Date().toISOString(),
      };
    });
    return understanding;
  });

  // Mock data state for skills catalogue
  const [skills, setSkills] = useState<Array<AgentSkill & { id: string }>>([
    {
      id: 'skill-1',
      name: 'TypeScript Development',
      description: 'Modular capability for writing and maintaining TypeScript code with strong typing and modern ES6+ features',
      category: 'coding',
      isActive: true,
      tags: ['typescript', 'javascript', 'es6'],
      instructions: 'Use strict TypeScript mode. Prefer interfaces over types for object shapes. Leverage type inference where possible.',
      useCases: ['Building type-safe applications', 'Refactoring JavaScript to TypeScript'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'skill-2',
      name: 'React Component Design',
      description: 'Design and implement React components following best practices and modern patterns',
      category: 'coding',
      isActive: true,
      tags: ['react', 'ui', 'components'],
      instructions: 'Use functional components with hooks. Keep components small and focused. Extract reusable logic into custom hooks.',
      useCases: ['Building reusable UI components', 'Implementing responsive designs'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'skill-3',
      name: 'API Integration',
      description: 'Integrate with REST and GraphQL APIs, handle authentication and error cases',
      category: 'api',
      isActive: true,
      tags: ['rest', 'graphql', 'api'],
      instructions: 'Always handle errors gracefully. Use try-catch blocks. Implement retry logic for transient failures. Log API calls for debugging.',
      useCases: ['Connecting frontend to backend', 'Third-party service integration'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'skill-4',
      name: 'Unit Testing',
      description: 'Write comprehensive unit tests using Jest, Vitest, or similar frameworks',
      category: 'testing',
      isActive: true,
      tags: ['jest', 'vitest', 'testing'],
      instructions: 'Test behavior, not implementation. Use descriptive test names. Mock external dependencies. Aim for high coverage.',
      useCases: ['Ensuring code quality', 'Regression prevention'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'skill-5',
      name: 'Code Review',
      description: 'Review code for quality, security, and maintainability issues',
      category: 'analysis',
      isActive: true,
      tags: ['review', 'quality', 'security'],
      instructions: 'Check for common vulnerabilities, performance issues, and code smells. Provide constructive feedback. Verify tests exist.',
      useCases: ['Pull request reviews', 'Architecture assessment'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'skill-6',
      name: 'SQL Database Design',
      description: 'Design relational database schemas, write optimized queries, and manage migrations',
      category: 'database',
      isActive: true,
      tags: ['sql', 'postgresql', 'mysql'],
      instructions: 'Normalize schema to 3NF. Use indexes strategically. Avoid N+1 queries. Use prepared statements for security.',
      useCases: ['Database schema design', 'Query optimization'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'skill-7',
      name: 'Technical Documentation',
      description: 'Write clear and comprehensive technical documentation for APIs, components, and systems',
      category: 'documentation',
      isActive: true,
      tags: ['docs', 'markdown', 'api-docs'],
      instructions: 'Write for your audience. Include examples. Keep docs up to date with code. Use clear section headings.',
      useCases: ['API documentation', 'Component documentation'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'skill-8',
      name: 'Security Auditing',
      description: 'Identify and fix security vulnerabilities in web applications',
      category: 'security',
      isActive: true,
      tags: ['security', 'owasp', 'vulnerabilities'],
      instructions: 'Check OWASP Top 10. Validate all inputs. Use parameterized queries. Implement proper authentication and authorization.',
      useCases: ['Security assessments', 'Vulnerability patching'],
      createdAt: '2024-01-01T00:00:00Z',
    },
  ]);

  // Handlers
  const handleUpdateAgentMemory = (agentId: string, memory: AgentMemory) => {
    setAgentMemories(prev => ({ ...prev, [agentId]: memory }));
  };

  const handleUpdateTeamMemory = (teamId: string, memory: TeamMemory) => {
    setTeamMemories(prev => ({ ...prev, [teamId]: memory }));
  };

  const handleRefreshUnderstanding = (repoId: string) => {
    console.log('Refreshing understanding for repository:', repoId);
    // In real implementation, this would trigger repository analysis
  };

  const handleAddSkill = (skill: AgentSkill & { id: string }) => {
    setSkills(prev => [...prev, skill]);
  };

  const handleUpdateSkill = (id: string, skill: AgentSkill & { id: string }) => {
    setSkills(prev => prev.map(s => s.id === id ? skill : s));
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  // CALLBACK: Update pipeline for a team
  const handleUpdatePipeline = useCallback((teamId: string, pipeline: PipelineConfiguration) => {
    setTeams(prev =>
      prev.map(t => (t.id === teamId ? { ...t, pipeline } : t))
    );
    // TODO: Persist to localStorage or backend
    console.log('Pipeline updated for team:', teamId, pipeline);
  }, []);

  // CALLBACK: Update team (for agent management)
  const handleUpdateTeam = useCallback((team: Team) => {
    setTeams(prev => prev.map(t => (t.id === team.id ? team : t)));
    // TODO: Persist to localStorage or backend
    console.log('Team updated:', team);
  }, []);

  const tabs: { id: SettingsTab; label: string; icon: typeof Brain; count?: number }[] = [
    { id: 'agents', label: 'Agents', icon: Brain, count: agents.length },
    { id: 'repositories', label: 'Repositories', icon: Folder, count: repositories.length },
    { id: 'skills', label: 'Skills', icon: Code, count: skills.length },
    { id: 'teams', label: 'Teams', icon: Users, count: teams.length },
    { id: 'budgets', label: 'Budgets', icon: DollarSign },
    { id: 'integrations', label: 'Integrations', icon: Puzzle },
  ];

  return (
    <WorkspaceShell>
      <div className="flex flex-col h-full">
        {/* Tab Navigation */}
        <div className="flex-shrink-0 border-b border-border-1 bg-bg-0">
          <div className="flex items-center gap-1 px-4 py-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm
                    ${activeTab === tab.id
                      ? 'bg-accent-blue/10 text-accent-blue'
                      : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-semibold
                      ${activeTab === tab.id
                        ? 'bg-accent-blue/20 text-accent-blue'
                        : 'bg-bg-2 text-text-3'
                      }
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'agents' && (
            <AgentMemoryPanel
              agents={agents}
              memories={agentMemories}
              skills={skills}
              onUpdateMemory={handleUpdateAgentMemory}
            />
          )}

          {activeTab === 'repositories' && (
            <RepositoryUnderstandingPanel
              repositories={repositories.map(repo => ({
                id: repo.id,
                name: repo.name,
                path: repo.path,
                understanding: repoUnderstanding[repo.id],
              }))}
              onRefreshUnderstanding={handleRefreshUnderstanding}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsCatalogue
              skills={skills}
              onAdd={handleAddSkill}
              onUpdate={handleUpdateSkill}
              onDelete={handleDeleteSkill}
            />
          )}

          {activeTab === 'teams' && (
            <TeamMemoryPanel
              teams={teams}
              memories={teamMemories}
              onUpdateMemory={handleUpdateTeamMemory}
              onUpdatePipeline={handleUpdatePipeline}
              onUpdateTeam={handleUpdateTeam}
            />
          )}

          {activeTab === 'budgets' && (
            <div className="flex items-center justify-center h-full text-text-3">
              <div className="text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Budget management coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="flex items-center justify-center h-full text-text-3">
              <div className="text-center">
                <Puzzle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Integrations coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
