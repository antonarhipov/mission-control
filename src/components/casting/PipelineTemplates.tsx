import { Layers, Target, Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  stages: {
    id: string;
    name: string;
    agentRoles: string[]; // Role suggestions
  }[];
  bestFor: string[];
  estimatedCost: number;
  estimatedTime: string;
}

interface PipelineTemplatesProps {
  templates: PipelineTemplate[];
  selectedTemplate?: string;
  onSelectTemplate: (templateId: string) => void;
  onApplyTemplate: (templateId: string) => void;
}

export function PipelineTemplates({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onApplyTemplate,
}: PipelineTemplatesProps) {
  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border-1">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-accent-amber" />
          <h2 className="text-lg font-semibold text-text-1">Pipeline Templates</h2>
        </div>
        <p className="text-sm text-text-3">
          Start with a pre-configured team composition
        </p>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {templates.map(template => {
            const isSelected = selectedTemplate === template.id;

            return (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className={`
                  bg-bg-0 rounded-lg border p-4 cursor-pointer transition-all
                  ${isSelected
                    ? 'border-accent-blue shadow-lg ring-2 ring-accent-blue/20'
                    : 'border-border-1 hover:border-border-2 hover:shadow-md'
                  }
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-accent-blue/10' : 'bg-bg-1'
                    }`}>
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-text-1">{template.name}</h3>
                      <p className="text-xs text-text-3 mt-0.5">{template.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-accent-blue flex-shrink-0" />
                  )}
                </div>

                {/* Pipeline Stages */}
                <div className="mb-3 pb-3 border-b border-border-1">
                  <div className="text-xs font-medium text-text-3 uppercase mb-2">
                    Pipeline Stages
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {template.stages.map((stage, index) => (
                      <div key={stage.id} className="flex items-center gap-1">
                        <div className="px-2 py-1 bg-bg-1 rounded text-xs text-text-2">
                          {stage.name}
                        </div>
                        {index < template.stages.length - 1 && (
                          <span className="text-text-3">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-text-3 uppercase mb-2">
                    Best For
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {template.bestFor.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent-blue/10 text-accent-blue rounded text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estimates */}
                <div className="flex items-center justify-between text-xs text-text-3">
                  <div>
                    <span>Est. Cost:</span>
                    <span className="ml-1 font-semibold text-text-1">
                      ${template.estimatedCost.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span>Est. Time:</span>
                    <span className="ml-1 font-semibold text-text-1">
                      {template.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyTemplate(template.id);
                    }}
                    className="w-full mt-3 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors"
                  >
                    Apply Template
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Default templates
export const defaultTemplates: PipelineTemplate[] = [
  {
    id: 'tdd',
    name: 'Test-Driven Development',
    description: 'Comprehensive testing at every stage with quality gates',
    icon: <Target className="w-5 h-5 text-accent-green" />,
    stages: [
      { id: 'design', name: 'Design', agentRoles: ['architect'] },
      { id: 'test-spec', name: 'Test Specification', agentRoles: ['tester'] },
      { id: 'implementation', name: 'Implementation', agentRoles: ['implementer'] },
      { id: 'test-validation', name: 'Test Validation', agentRoles: ['tester'] },
      { id: 'review', name: 'Code Review', agentRoles: ['reviewer'] },
      { id: 'docs', name: 'Documentation', agentRoles: ['docs'] },
    ],
    bestFor: ['Critical features', 'High reliability', 'Long-term maintenance'],
    estimatedCost: 8.50,
    estimatedTime: '2-3 days',
  },
  {
    id: 'security-first',
    name: 'Security-First Pipeline',
    description: 'Multiple security reviews and threat modeling',
    icon: <Shield className="w-5 h-5 text-accent-blue" />,
    stages: [
      { id: 'threat-model', name: 'Threat Modeling', agentRoles: ['architect'] },
      { id: 'secure-design', name: 'Secure Design', agentRoles: ['architect'] },
      { id: 'implementation', name: 'Implementation', agentRoles: ['implementer'] },
      { id: 'security-test', name: 'Security Testing', agentRoles: ['tester'] },
      { id: 'security-review', name: 'Security Review', agentRoles: ['reviewer'] },
      { id: 'docs', name: 'Security Docs', agentRoles: ['docs'] },
    ],
    bestFor: ['Authentication', 'Payment systems', 'Sensitive data'],
    estimatedCost: 10.20,
    estimatedTime: '3-4 days',
  },
  {
    id: 'rapid-prototype',
    name: 'Rapid Prototype',
    description: 'Fast iteration with minimal overhead',
    icon: <Zap className="w-5 h-5 text-accent-amber" />,
    stages: [
      { id: 'quick-design', name: 'Quick Design', agentRoles: ['architect'] },
      { id: 'implementation', name: 'Implementation', agentRoles: ['implementer'] },
      { id: 'basic-test', name: 'Basic Testing', agentRoles: ['tester'] },
    ],
    bestFor: ['Prototypes', 'POC', 'Experimental features'],
    estimatedCost: 3.80,
    estimatedTime: '0.5-1 day',
  },
  {
    id: 'balanced',
    name: 'Balanced Pipeline',
    description: 'Standard pipeline with all essential stages',
    icon: <Sparkles className="w-5 h-5 text-accent-purple" />,
    stages: [
      { id: 'design', name: 'Design', agentRoles: ['architect'] },
      { id: 'implementation', name: 'Implementation', agentRoles: ['implementer'] },
      { id: 'testing', name: 'Testing', agentRoles: ['tester'] },
      { id: 'review', name: 'Review', agentRoles: ['reviewer'] },
      { id: 'docs', name: 'Documentation', agentRoles: ['docs'] },
    ],
    bestFor: ['Standard features', 'General development', 'Most use cases'],
    estimatedCost: 6.50,
    estimatedTime: '1-2 days',
  },
  {
    id: 'documentation-heavy',
    name: 'Documentation-Heavy',
    description: 'Extensive documentation at every stage',
    icon: <Layers className="w-5 h-5 text-accent-cyan" />,
    stages: [
      { id: 'spec', name: 'Specification', agentRoles: ['architect', 'docs'] },
      { id: 'implementation', name: 'Implementation', agentRoles: ['implementer'] },
      { id: 'inline-docs', name: 'Inline Docs', agentRoles: ['docs'] },
      { id: 'testing', name: 'Testing', agentRoles: ['tester'] },
      { id: 'review', name: 'Review', agentRoles: ['reviewer'] },
      { id: 'user-docs', name: 'User Documentation', agentRoles: ['docs'] },
      { id: 'api-docs', name: 'API Documentation', agentRoles: ['docs'] },
    ],
    bestFor: ['Public APIs', 'SDK development', 'Open source'],
    estimatedCost: 9.00,
    estimatedTime: '2-3 days',
  },
];
