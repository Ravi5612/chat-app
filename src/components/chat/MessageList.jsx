import { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';

export default function MessageList({ messages, loading, currentUserId, onLoadMore }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 border-l border-r border-[#F68537]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F68537] mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 border-l border-r border-[#F68537]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">👋</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">No messages yet</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Start the conversation by sending a message below!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 border-l border-r border-[#F68537]">
      <div className="space-y-3">
        {messages.map((msg) => (
          <MessageItem 
            key={msg.id} 
            message={msg} 
            isCurrentUser={msg.sender_id === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}