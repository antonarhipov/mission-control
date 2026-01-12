import { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

interface Attachment {
  name: string;
  size: number;
  type: string;
}

interface ConversationInputProps {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ConversationInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
}: ConversationInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-border-1 bg-bg-0 p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-bg-1 border border-border-1 rounded-lg text-sm"
            >
              <Paperclip className="w-4 h-4 text-text-3" />
              <span className="text-text-2 font-mono text-xs">{attachment.name}</span>
              <span className="text-text-3 text-xs">
                ({(attachment.size / 1024).toFixed(1)}KB)
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-text-3 hover:text-accent-red transition-colors"
                aria-label="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Attach Button */}
        <button
          onClick={handleAttachClick}
          disabled={disabled}
          className="flex-shrink-0 p-2.5 rounded-lg border border-border-1 bg-bg-1 hover:bg-bg-2 text-text-2 hover:text-accent-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Attach files"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 bg-bg-1 border border-border-1 rounded-lg text-text-1 placeholder-text-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
          style={{ minHeight: '44px', maxHeight: '200px' }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="flex-shrink-0 p-2.5 rounded-lg bg-accent-blue hover:bg-accent-blue/80 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent-blue"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Hint */}
      <div className="mt-2 text-xs text-text-3">
        Press <kbd className="px-1.5 py-0.5 bg-bg-2 border border-border-1 rounded text-text-2">Enter</kbd> to send,
        <kbd className="px-1.5 py-0.5 bg-bg-2 border border-border-1 rounded text-text-2 ml-1">Shift+Enter</kbd> for new line
      </div>
    </div>
  );
}
