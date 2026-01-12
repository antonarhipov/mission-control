import { useState } from 'react';
import { WorkspaceShell } from './WorkspaceShell';
import { IntentInput } from '@/components/command/IntentInput';
import { ActiveConversations } from '@/components/command/ActiveConversations';
import { ConversationView } from '@/components/command/ConversationView';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface CommandCenterProps {
  onNavigateToMission: (missionId: string) => void;
  onNavigateToConversation: (missionId: string) => void;
}

export function CommandCenter({
  onNavigateToMission,
  onNavigateToConversation: _onNavigateToConversation, // Reserved for future use
}: CommandCenterProps) {
  const { missions } = useV3DataModel();
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [view, setView] = useState<'new' | 'conversation'>('new');

  // Get selected mission
  const selectedMission = selectedMissionId
    ? missions.find(m => m.id === selectedMissionId)
    : null;

  // Handle creating a new conversation from intent
  const handleCreateConversation = (intent: {
    description: string;
    toolkitId: string;
    context?: {
      repositories?: string[];
      files?: string[];
      dependencies?: string[];
    };
    constraints?: string[];
  }) => {
    console.log('Creating new conversation with intent:', intent);

    // Generate conversation/mission ID (in real app, this would come from backend)
    const conversationId = `conversation-${Date.now()}`;

    // In a real app, this would:
    // 1. Create a new Conversation with missionId = null and toolkitId
    // 2. Execute the specification toolkit workflow automatically
    // 3. Store the intent and refined spec in the conversation
    // 4. Navigate to the conversation view
    console.log('Created conversation:', {
      id: conversationId,
      description: intent.description,
      toolkitId: intent.toolkitId,
      repositories: intent.context?.repositories || [],
      constraints: intent.constraints || []
    });

    alert(`Conversation created!\n\nToolkit: ${intent.toolkitId}\n\nIn production:\n- Conversation would be created\n- ${intent.toolkitId} workflow would execute\n- You'd see the refined specification in the chat`);

    // For now, just switch back to conversation list
    setSelectedMissionId(null);
    setView('new');
  };

  // Handle selecting a mission from the list
  const handleSelectMission = (missionId: string) => {
    console.log('Selected mission:', missionId);
    setSelectedMissionId(missionId);
    setView('conversation');
  };

  // Handle going back to new mission view
  const handleBackToNew = () => {
    setSelectedMissionId(null);
    setView('new');
  };

  // Handle sending a message in a conversation
  const handleSendMessage = (content: string, attachments: any[]) => {
    console.log('Sending message:', { content, attachments, missionId: selectedMissionId });
    // In a real app, this would send the message to the backend
    // and update the conversation in the mission
  };

  // Handle starting a mission from a conversation
  const handleStartMission = (teamId: string) => {
    console.log('Starting mission:', { conversationId: selectedMissionId, teamId });

    // In a real app, this would:
    // 1. Create a new Mission with the conversationId
    // 2. Update the Conversation's missionId
    // 3. Assign agents from the team to the mission
    // 4. Navigate to the Missions workspace

    // For now, just show confirmation
    alert(`Mission started with team: ${teamId}\n\nIn production, this would:\n- Create mission from conversation\n- Link conversation to mission\n- Assign team agents\n- Navigate to Missions workspace`);

    // Navigate back to conversation list after submitting
    handleBackToNew();
  };

  // Handle re-running the specification toolkit
  const handleRerunToolkit = () => {
    console.log('Re-running specification toolkit for conversation:', selectedMissionId);

    // In a real app, this would:
    // 1. Re-execute the specification toolkit workflow
    // 2. Create a new WorkflowRun record
    // 3. Update the conversation with the refined specification
    // 4. Add a system message showing the new specification

    alert('Specification toolkit re-run!\n\nIn production:\n- Toolkit workflow would execute again\n- Refined specification would update\n- New workflow run would be recorded');
  };

  return (
    <WorkspaceShell>
      <div className="grid grid-cols-[320px_1fr] h-full">
        {/* Left: Conversations List */}
        <div className="border-r border-border-1 overflow-hidden">
          <ActiveConversations
            selectedMissionId={selectedMissionId}
            onSelectMission={handleSelectMission}
            onNewMission={handleBackToNew}
          />
        </div>

        {/* Main: Intent Input or Conversation View */}
        <div className="overflow-hidden">
          {view === 'new' ? (
            <IntentInput onStartMission={handleCreateConversation} />
          ) : selectedMission ? (
            <ConversationView
              mission={selectedMission}
              onBack={handleBackToNew}
              onSendMessage={handleSendMessage}
              onStartMission={handleStartMission}
              onRerunToolkit={handleRerunToolkit}
              onNavigateToMission={onNavigateToMission}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-text-3">
              <p>Mission not found</p>
            </div>
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
