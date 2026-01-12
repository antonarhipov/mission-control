import { useState, useRef } from 'react';
import { Send, Plus, X, FolderGit2, FileCode, Package, Sparkles } from 'lucide-react';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface IntentInputProps {
  onStartMission: (intent: {
    description: string;
    toolkitId: string;
    context?: {
      repositories?: string[];
      files?: string[];
      dependencies?: string[];
    };
    constraints?: string[];
  }) => void;
  disabled?: boolean;
}

// Mock specification toolkits (in production, these would come from integrations)
const SPEC_TOOLKITS = [
  {
    id: 'openspec-v1',
    name: 'openspec',
    description: 'Open Specification Engine - AI-powered spec refinement',
    provider: 'openspec',
  },
  {
    id: 'agent-os-v2',
    name: 'Agent-OS Spec Builder',
    description: 'Agent-OS native specification workflow',
    provider: 'Agent-OS',
  },
  {
    id: 'manual',
    name: 'Manual Specification',
    description: 'Create specification manually without toolkit assistance',
    provider: 'Built-in',
  },
];

export function IntentInput({ onStartMission, disabled = false }: IntentInputProps) {
  const [description, setDescription] = useState('');
  const [selectedToolkitId, setSelectedToolkitId] = useState<string>(SPEC_TOOLKITS[0].id);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [contextFiles, setContextFiles] = useState<string[]>([]);
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [constraints, setConstraints] = useState<string[]>([]);
  const [newConstraint, setNewConstraint] = useState('');
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);
  const [showToolkitDropdown, setShowToolkitDropdown] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { repositories } = useV3DataModel();

  const selectedToolkit = SPEC_TOOLKITS.find(t => t.id === selectedToolkitId);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
  };

  const addConstraint = () => {
    if (newConstraint.trim()) {
      setConstraints([...constraints, newConstraint.trim()]);
      setNewConstraint('');
    }
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const toggleRepo = (repoId: string) => {
    setSelectedRepos(prev =>
      prev.includes(repoId)
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    );
  };

  const handleStartMission = () => {
    if (!description.trim()) return;

    onStartMission({
      description: description.trim(),
      toolkitId: selectedToolkitId,
      context: {
        repositories: selectedRepos.length > 0 ? selectedRepos : undefined,
        files: contextFiles.length > 0 ? contextFiles : undefined,
        dependencies: dependencies.length > 0 ? dependencies : undefined,
      },
      constraints: constraints.length > 0 ? constraints : undefined,
    });

    // Reset form
    setDescription('');
    setSelectedToolkitId(SPEC_TOOLKITS[0].id);
    setSelectedRepos([]);
    setContextFiles([]);
    setDependencies([]);
    setConstraints([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-border-1">
        <h2 className="text-xl font-semibold text-text-1 mb-2">Start a New Mission</h2>
        <p className="text-sm text-text-3">
          Describe what you want to accomplish. Be specific about your goals and requirements.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Intent Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-2">
            What do you want to accomplish?
            <span className="text-accent-red ml-1">*</span>
          </label>
          <textarea
            ref={textareaRef}
            value={description}
            onChange={handleTextareaChange}
            disabled={disabled}
            placeholder="Example: Add user authentication with JWT tokens. Users should be able to register, login, and logout. Store user credentials securely in PostgreSQL."
            className="w-full px-4 py-3 bg-bg-1 border border-border-1 rounded-lg text-text-1 placeholder-text-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={5}
            style={{ minHeight: '120px', maxHeight: '300px' }}
          />
          <div className="text-xs text-text-3">
            {description.length} characters
          </div>
        </div>

        {/* Context Section */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-text-2">Context (Optional)</div>

          {/* Repositories */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-text-3">
              <FolderGit2 className="w-4 h-4" />
              <span>Repositories</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowRepoDropdown(!showRepoDropdown)}
                disabled={disabled}
                className="w-full px-4 py-2 bg-bg-1 border border-border-1 rounded-lg text-left text-text-2 hover:bg-bg-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedRepos.length === 0
                  ? 'Select repositories...'
                  : `${selectedRepos.length} selected`}
              </button>
              {showRepoDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-bg-1 border border-border-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {repositories.map(repo => (
                    <label
                      key={repo.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-bg-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRepos.includes(repo.id)}
                        onChange={() => toggleRepo(repo.id)}
                        className="w-4 h-4 text-accent-blue rounded border-border-1 focus:ring-accent-blue/50"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-1 font-medium">{repo.name}</div>
                        <div className="text-xs text-text-3 truncate">{repo.path}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {selectedRepos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedRepos.map(repoId => {
                  const repo = repositories.find(r => r.id === repoId);
                  return repo ? (
                    <div
                      key={repoId}
                      className="flex items-center gap-2 px-3 py-1 bg-accent-purple/10 border border-accent-purple/30 rounded text-sm text-text-1"
                    >
                      <span>{repo.name}</span>
                      <button
                        onClick={() => toggleRepo(repoId)}
                        className="text-text-3 hover:text-accent-red transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Files */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-text-3">
              <FileCode className="w-4 h-4" />
              <span>Relevant Files</span>
            </div>
            <div className="text-xs text-text-3 italic">
              File attachment coming soon
            </div>
          </div>

          {/* Dependencies */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-text-3">
              <Package className="w-4 h-4" />
              <span>Dependencies</span>
            </div>
            <div className="text-xs text-text-3 italic">
              Dependency specification coming soon
            </div>
          </div>
        </div>

        {/* Specification Toolkit Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-text-3">
            <Sparkles className="w-4 h-4" />
            <span>Specification Toolkit</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowToolkitDropdown(!showToolkitDropdown)}
              disabled={disabled}
              className="w-full px-4 py-2 bg-bg-1 border border-border-1 rounded-lg text-left text-text-2 hover:bg-bg-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedToolkit ? `${selectedToolkit.name} - ${selectedToolkit.description}` : 'Select toolkit...'}
            </button>
            {showToolkitDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-bg-1 border border-border-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {SPEC_TOOLKITS.map(toolkit => (
                  <button
                    key={toolkit.id}
                    onClick={() => {
                      setSelectedToolkitId(toolkit.id);
                      setShowToolkitDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-bg-2 transition-colors"
                  >
                    <div className="text-sm text-text-1 font-medium">{toolkit.name}</div>
                    <div className="text-xs text-text-3">{toolkit.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedToolkit && (
            <div className="p-3 bg-bg-1 border border-border-1 rounded-lg">
              <div className="flex items-start gap-2 text-xs">
                <span className="px-2 py-1 bg-accent-purple/10 border border-accent-purple/30 rounded text-accent-purple font-medium">
                  {selectedToolkit.provider}
                </span>
                <span className="text-text-3 flex-1">
                  {selectedToolkit.description}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Constraints */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-text-2">Constraints (Optional)</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newConstraint}
              onChange={(e) => setNewConstraint(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addConstraint()}
              disabled={disabled}
              placeholder="e.g., Must use Spring Security framework"
              className="flex-1 px-4 py-2 bg-bg-1 border border-border-1 rounded-lg text-text-1 placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 disabled:opacity-50"
            />
            <button
              onClick={addConstraint}
              disabled={disabled || !newConstraint.trim()}
              className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {constraints.length > 0 && (
            <div className="space-y-2">
              {constraints.map((constraint, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 px-4 py-2 bg-bg-1 border border-border-1 rounded-lg"
                >
                  <div className="flex-1 text-sm text-text-1">{constraint}</div>
                  <button
                    onClick={() => removeConstraint(index)}
                    className="flex-shrink-0 text-text-3 hover:text-accent-red transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-6 border-t border-border-1 bg-bg-0">
        <button
          onClick={handleStartMission}
          disabled={disabled || !description.trim()}
          className="w-full px-6 py-3 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          <span>Start Conversation</span>
        </button>
        <p className="mt-3 text-xs text-text-3 text-center">
          {selectedToolkit && selectedToolkit.id !== 'manual'
            ? `The ${selectedToolkit.name} toolkit will refine your intent into a detailed specification.`
            : 'Create a specification through conversation, then submit to a team for execution.'}
        </p>
      </div>
    </div>
  );
}
