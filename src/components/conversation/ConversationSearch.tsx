import { useState, useMemo } from 'react';
import { Search, X, MessageSquare, AlertCircle, HelpCircle, Filter } from 'lucide-react';
import type { Conversation } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface SearchResult {
  type: 'message' | 'decision' | 'question';
  id: string;
  content: string;
  timestamp: string;
  agentName?: string;
  matchText: string;
}

interface ConversationSearchProps {
  conversation: Conversation;
  onSelectResult?: (resultId: string, resultType: 'message' | 'decision' | 'question') => void;
  className?: string;
}

export function ConversationSearch({
  conversation,
  onSelectResult,
  className = '',
}: ConversationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'message' | 'decision' | 'question'>('all');
  const { agents } = useV3DataModel();

  // Search through conversation
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search messages
    if (filterType === 'all' || filterType === 'message') {
      conversation.messages.forEach(msg => {
        if (msg.content.toLowerCase().includes(query)) {
          const agent = msg.sender.type === 'agent' && msg.sender.id
            ? agents.find(a => a.id === msg.sender.id)
            : null;

          results.push({
            type: 'message',
            id: msg.id,
            content: msg.content,
            timestamp: msg.timestamp,
            agentName: agent?.name || (msg.sender.type === 'operator' ? 'You' : 'System'),
            matchText: getMatchContext(msg.content, query),
          });
        }
      });
    }

    // Search decisions
    if (filterType === 'all' || filterType === 'decision') {
      conversation.decisions.forEach(decision => {
        const searchableText = [
          decision.title,
          decision.rationale,
          ...decision.options.map(opt => opt.title),
        ].join(' ').toLowerCase();

        if (searchableText.includes(query)) {
          const agent = decision.agentId
            ? agents.find(a => a.id === decision.agentId)
            : null;

          results.push({
            type: 'decision',
            id: decision.id,
            content: decision.title,
            timestamp: decision.timestamp,
            agentName: agent?.name,
            matchText: getMatchContext(searchableText, query),
          });
        }
      });
    }

    // Search questions
    if (filterType === 'all' || filterType === 'question') {
      conversation.openQuestions.forEach(question => {
        const searchableText = [question.question, question.answer || ''].join(' ').toLowerCase();

        if (searchableText.includes(query)) {
          const agent = question.askedBy
            ? agents.find(a => a.id === question.askedBy)
            : null;

          results.push({
            type: 'question',
            id: question.id,
            content: question.question,
            timestamp: '', // Questions don't have timestamps
            agentName: agent?.name,
            matchText: getMatchContext(searchableText, query),
          });
        }
      });
    }

    // Sort by timestamp (newest first)
    return results.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [searchQuery, filterType, conversation, agents]);

  // Get context around match (±50 chars)
  function getMatchContext(text: string, query: string): string {
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(query.toLowerCase());
    if (index === -1) return text.substring(0, 100) + '...';

    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    const excerpt = text.substring(start, end);

    return (start > 0 ? '...' : '') + excerpt + (end < text.length ? '...' : '');
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get icon for result type
  const getResultIcon = (type: 'message' | 'decision' | 'question') => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-accent-blue" />;
      case 'decision':
        return <AlertCircle className="w-4 h-4 text-accent-amber" />;
      case 'question':
        return <HelpCircle className="w-4 h-4 text-accent-purple" />;
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Search Input */}
      <div className="p-4 border-b border-border-1 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversation..."
            className="w-full pl-10 pr-10 py-2 bg-bg-1 border border-border-1 rounded-lg text-text-1 placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-1 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-3" />
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-accent-blue text-white'
                : 'bg-bg-1 text-text-2 hover:bg-bg-2'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('message')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'message'
                ? 'bg-accent-blue text-white'
                : 'bg-bg-1 text-text-2 hover:bg-bg-2'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setFilterType('decision')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'decision'
                ? 'bg-accent-blue text-white'
                : 'bg-bg-1 text-text-2 hover:bg-bg-2'
            }`}
          >
            Decisions
          </button>
          <button
            onClick={() => setFilterType('question')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'question'
                ? 'bg-accent-blue text-white'
                : 'bg-bg-1 text-text-2 hover:bg-bg-2'
            }`}
          >
            Questions
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {!searchQuery.trim() ? (
          <div className="flex items-center justify-center h-full text-text-3">
            <div className="text-center space-y-2 p-8">
              <Search className="w-12 h-12 mx-auto opacity-50" />
              <p>Enter a search query to find messages, decisions, or questions</p>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-3">
            <div className="text-center space-y-2 p-8">
              <p>No results found for &quot;{searchQuery}&quot;</p>
              <p className="text-sm">Try a different search term or filter</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            <div className="text-xs text-text-3 mb-3">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </div>
            {searchResults.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => onSelectResult?.(result.id, result.type)}
                className="w-full text-left p-3 bg-bg-1 hover:bg-bg-2 border border-border-1 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-text-3">
                      <span className="capitalize">{result.type}</span>
                      {result.agentName && (
                        <>
                          <span>•</span>
                          <span>{result.agentName}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{formatTime(result.timestamp)}</span>
                    </div>
                    <div className="text-sm text-text-1 font-medium line-clamp-2">
                      {result.content}
                    </div>
                    <div className="text-xs text-text-2 line-clamp-2">
                      {result.matchText}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
