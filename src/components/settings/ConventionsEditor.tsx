import { useState } from 'react';
import { FileCode, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import type { Convention } from '@/types';

interface ConventionWithId extends Convention {
  id: string;
}

interface ConventionsEditorProps {
  conventions: ConventionWithId[];
  onAdd: (convention: ConventionWithId) => void;
  onUpdate: (id: string, convention: ConventionWithId) => void;
  onDelete: (id: string) => void;
}

export function ConventionsEditor({ conventions, onAdd, onUpdate, onDelete }: ConventionsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ConventionWithId>>({
    category: 'naming',
    description: '',
    example: '',
  });

  const categories: string[] = ['naming', 'formatting', 'architecture', 'testing', 'documentation'];

  const handleStartEdit = (convention: ConventionWithId) => {
    setEditingId(convention.id);
    setFormData(convention);
    setShowAddForm(false);
  };

  const handleStartAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      category: 'naming',
      description: '',
      example: '',
    });
  };

  const handleSave = () => {
    if (!formData.description?.trim()) return;

    if (editingId) {
      onUpdate(editingId, formData as ConventionWithId);
      setEditingId(null);
    } else {
      const newConvention: ConventionWithId = {
        id: `conv-${Date.now()}`,
        category: formData.category || 'naming',
        description: formData.description || '',
        example: formData.example,
      };
      onAdd(newConvention);
      setShowAddForm(false);
    }

    setFormData({
      category: 'naming',
      description: '',
      example: '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      category: 'naming',
      description: '',
      example: '',
    });
  };

  const groupedConventions = conventions.reduce((acc, conv) => {
    if (!acc[conv.category]) acc[conv.category] = [];
    acc[conv.category].push(conv);
    return acc;
  }, {} as Record<string, ConventionWithId[]>);

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileCode className="w-6 h-6 text-accent-cyan" />
            <div>
              <h2 className="text-xl font-semibold text-text-1">Coding Conventions</h2>
              <p className="text-sm text-text-3">Manage project-wide coding standards</p>
            </div>
          </div>
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Convention</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Add/Edit Form */}
          {(showAddForm || editingId) && (
            <div className="bg-bg-1 rounded-lg p-4 border border-accent-blue space-y-4">
              <h3 className="text-sm font-semibold text-text-1">
                {editingId ? 'Edit Convention' : 'New Convention'}
              </h3>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-text-3 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-text-3 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-20 px-3 py-2 bg-bg-0 border border-border-1 rounded text-sm text-text-1 resize-none focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  placeholder="Describe the convention..."
                />
              </div>

              {/* Example */}
              <div>
                <label className="block text-xs font-medium text-text-3 mb-1">
                  Example (optional)
                </label>
                <textarea
                  value={formData.example || ''}
                  onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                  className="w-full h-16 px-3 py-2 bg-bg-0 border border-border-1 rounded text-sm text-text-1 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                  placeholder="// Example code..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!formData.description?.trim()}
                  className="flex items-center gap-1 px-3 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'Update' : 'Add'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-2 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}

          {/* Conventions List */}
          {conventions.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-text-3">
              <div className="text-center">
                <FileCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="mb-4">No conventions defined yet</p>
                <button
                  onClick={handleStartAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Convention</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map(category => {
                const categoryConventions = groupedConventions[category] || [];
                if (categoryConventions.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3 capitalize">
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {categoryConventions.map(convention => (
                        <div
                          key={convention.id}
                          className="bg-bg-1 rounded-lg p-4 border border-border-1"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-sm text-text-1 leading-relaxed">
                                {convention.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 ml-3">
                              <button
                                onClick={() => handleStartEdit(convention)}
                                className="p-1 hover:bg-bg-2 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3 h-3 text-text-3" />
                              </button>
                              <button
                                onClick={() => onDelete(convention.id)}
                                className="p-1 hover:bg-bg-2 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3 text-accent-red" />
                              </button>
                            </div>
                          </div>

                          {convention.example && (
                            <div className="mt-2 p-2 bg-bg-2 rounded">
                              <pre className="text-xs text-text-2 font-mono overflow-x-auto">
                                {convention.example}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
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
