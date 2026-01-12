import { ReactNode } from 'react';

interface WorkspaceShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * WorkspaceShell - Common wrapper for all workspaces
 * Provides consistent padding, background, and layout
 */
export function WorkspaceShell({ children, className = '' }: WorkspaceShellProps) {
  return (
    <div className={`h-full overflow-hidden bg-bg-0 ${className}`}>
      {children}
    </div>
  );
}
