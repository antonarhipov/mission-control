import { Play, Moon, Clock } from 'lucide-react';

type WorkflowMode = 'interactive' | 'background' | 'scheduled';

interface ModeSwitcherProps {
  currentMode: WorkflowMode;
  onModeChange: (mode: WorkflowMode) => void;
  disabled?: boolean;
}

export function ModeSwitcher({ currentMode, onModeChange, disabled = false }: ModeSwitcherProps) {
  const modes: { id: WorkflowMode; label: string; icon: typeof Play; description: string }[] = [
    {
      id: 'interactive',
      label: 'Interactive',
      icon: Play,
      description: 'Real-time collaboration with agents',
    },
    {
      id: 'background',
      label: 'Background',
      icon: Moon,
      description: 'Work continues without your attention',
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      icon: Clock,
      description: 'Set a time for agents to start',
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold text-text-2 uppercase tracking-wide">
        Workflow Mode
      </div>
      <div className="flex gap-2">
        {modes.map(mode => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => !disabled && onModeChange(mode.id)}
              disabled={disabled}
              className={`
                flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-lg border transition-all
                ${isActive
                  ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                  : 'bg-bg-1 border-border-1 text-text-2 hover:border-border-2 hover:text-text-1'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={mode.description}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-accent-blue' : 'text-text-3'}`} />
              <div className="text-sm font-medium">{mode.label}</div>
              {isActive && (
                <div className="text-xs text-center leading-tight opacity-80">
                  {mode.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
