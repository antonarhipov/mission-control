import { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Code, Shield, Database, Server, FileText, MessageSquare, Package } from 'lucide-react';
import type { AgentSkill } from '@/types';

interface SkillsCatalogueProps {
  skills: Array<AgentSkill & { id: string }>;
  onAdd: (skill: AgentSkill & { id: string }) => void;
  onUpdate: (id: string, skill: AgentSkill & { id: string }) => void;
  onDelete: (id: string) => void;
}

const categoryIcons: Record<string, typeof Code> = {
  coding: Code,
  analysis: BookOpen,
  testing: Shield,
  documentation: FileText,
  deployment: Server,
  communication: MessageSquare,
  security: Shield,
  database: Database,
  api: Package,
  other: Code,
};

const categoryColors: Record<string, string> = {
  coding: 'text-accent-blue',
  analysis: 'text-accent-purple',
  testing: 'text-accent-green',
  documentation: 'text-accent-amber',
  deployment: 'text-accent-cyan',
  communication: 'text-accent-blue',
  security: 'text-accent-red',
  database: 'text-accent-green',
  api: 'text-accent-purple',
  other: 'text-text-3',
};

export function SkillsCatalogue({ skills, onAdd, onUpdate, onDelete }: SkillsCatalogueProps) {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<AgentSkill & { id: string }>>({
    name: '',
    description: '',
    category: 'coding',
    isActive: true,
  });

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Array<AgentSkill & { id: string }>>);

  const categories = Object.keys(skillsByCategory).sort();
  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    const skill = {
      id: editingSkillId || `skill-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category || 'coding',
      isActive: formData.isActive ?? true,
      tags: formData.tags,
      instructions: formData.instructions,
      useCases: formData.useCases,
      examples: formData.examples,
      documentation: formData.documentation,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as AgentSkill & { id: string };

    if (editingSkillId) {
      onUpdate(editingSkillId, skill);
      setEditingSkillId(null);
    } else {
      onAdd(skill);
    }

    setFormData({
      name: '',
      description: '',
      category: 'coding',
      isActive: true,
    });
    setIsAddingSkill(false);
  };

  const handleEdit = (skill: AgentSkill & { id: string }) => {
    setFormData(skill);
    setEditingSkillId(skill.id);
    setIsAddingSkill(true);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      category: 'coding',
      isActive: true,
    });
    setEditingSkillId(null);
    setIsAddingSkill(false);
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Category Filter */}
      <div className="w-64 flex-shrink-0 border-r border-border-1 bg-bg-0 overflow-y-auto">
        <div className="p-4 border-b border-border-1">
          <h2 className="text-sm font-semibold text-text-1 mb-1">Filter by Category</h2>
          <p className="text-xs text-text-3">Browse skills by type</p>
        </div>

        <div className="p-3 space-y-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-accent-blue/10 text-accent-blue'
                : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">All Skills</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-bg-2 text-text-3">
                {skills.length}
              </span>
            </div>
          </button>

          {categories.map(category => {
            const Icon = categoryIcons[category] || Code;
            const count = skillsByCategory[category]?.length || 0;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${categoryColors[category]}`} />
                    <span className="text-sm font-medium capitalize">{category}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-bg-2 text-text-3">
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-text-1 mb-1">Skills Catalogue</h1>
              <p className="text-sm text-text-3">
                Manage agent capabilities and assign them in Agent configuration
              </p>
            </div>
            <button
              onClick={() => setIsAddingSkill(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Add/Edit Form */}
          {isAddingSkill && (
            <div className="mb-6 p-6 bg-bg-1 rounded-lg border border-border-1">
              <h3 className="text-lg font-semibold text-text-1 mb-4">
                {editingSkillId ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-2 mb-1">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded-lg text-text-1 placeholder-text-3"
                      placeholder="e.g., TypeScript Development"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-2 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category || 'coding'}
                      onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded-lg text-text-1"
                    >
                      <option value="coding">Coding</option>
                      <option value="analysis">Analysis</option>
                      <option value="testing">Testing</option>
                      <option value="documentation">Documentation</option>
                      <option value="deployment">Deployment</option>
                      <option value="communication">Communication</option>
                      <option value="security">Security</option>
                      <option value="database">Database</option>
                      <option value="api">API</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded-lg text-text-1 placeholder-text-3"
                    placeholder="Describe what this skill enables the agent to do..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1">
                    Instructions (Optional)
                  </label>
                  <textarea
                    value={formData.instructions || ''}
                    onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded-lg text-text-1 placeholder-text-3"
                    placeholder="Core instructions for using this skill capability..."
                    rows={3}
                  />
                  <p className="text-xs text-text-3 mt-1">Instructions that guide the agent when using this skill</p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive ?? true}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-border-1 text-accent-blue focus:ring-accent-blue focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-text-2">Active</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors"
                  >
                    {editingSkillId ? 'Update Skill' : 'Add Skill'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-bg-2 hover:bg-bg-3 text-text-1 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Skills Grid */}
          {filteredSkills.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Code className="w-12 h-12 text-text-3 opacity-50 mb-3" />
              <h3 className="text-lg font-semibold text-text-2 mb-2">No skills found</h3>
              <p className="text-sm text-text-3 max-w-md">
                {selectedCategory === 'all'
                  ? 'Add your first skill to get started with agent capabilities'
                  : `No skills in the ${selectedCategory} category yet`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSkills.map(skill => {
                const Icon = categoryIcons[skill.category] || Code;
                return (
                  <div
                    key={skill.id}
                    className="p-4 bg-bg-1 rounded-lg border border-border-1 hover:border-border-2 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className={`w-5 h-5 ${categoryColors[skill.category]}`} />
                          <h3 className="text-base font-semibold text-text-1">{skill.name}</h3>
                          {skill.version && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-bg-2 text-text-3">
                              v{skill.version}
                            </span>
                          )}
                          {!skill.isActive && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-bg-3 text-text-3">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-2 mb-3">{skill.description}</p>
                        <div className="flex items-center gap-4 text-xs text-text-3">
                          <span className="capitalize">{skill.category}</span>
                          {skill.tags && skill.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{skill.tags.join(', ')}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-2 hover:bg-bg-2 rounded-lg transition-colors"
                          title="Edit skill"
                        >
                          <Edit2 className="w-4 h-4 text-text-2" />
                        </button>
                        <button
                          onClick={() => onDelete(skill.id)}
                          className="p-2 hover:bg-bg-2 rounded-lg transition-colors"
                          title="Delete skill"
                        >
                          <Trash2 className="w-4 h-4 text-accent-red" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
