export default function MessageItem({ message, isCurrentUser }) {
    const isSent = isCurrentUser;
    const isImage = message.file_type?.startsWith('image/');
    const isVideo = message.file_type?.startsWith('video/');
  
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
  
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };
  
    const formatFileSize = (bytes) => {
      if (!bytes) return '';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };
  
    return (
      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
        <div
          className={`max-w-[70%] md:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm ${
            isSent
              ? 'bg-[#F68537] text-white rounded-br-none'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {/* Image Display */}
          {isImage && message.file_url && (
            <a href={message.file_url} target="_blank" rel="noopener noreferrer">
              <img 
                src={message.file_url} 
                alt={message.file_name}
                className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
              />
            </a>
          )}
  
          {/* Video Display */}
          {isVideo && message.file_url && (
            <video 
              src={message.file_url} 
              controls
              className="max-w-full rounded-lg mb-2"
            />
          )}
  
          {/* Other Files */}
          {message.file_url && !isImage && !isVideo && (
            <a 
              href={message.file_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center gap-2 mb-2 p-2 rounded-lg ${
                isSent ? 'bg-white/20' : 'bg-gray-100'
              }`}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{message.file_name}</p>
                <p className="text-xs opacity-75">{formatFileSize(message.file_size)}</p>
              </div>
            </a>
          )}
  
          {/* Message Text */}
          {message.message && (
            <p className="text-sm md:text-base break-words whitespace-pre-wrap">
              {message.message}
            </p>
          )}
  
          <p className={`text-xs mt-1 ${isSent ? 'text-white/80' : 'text-gray-500'}`}>
            {formatTime(message.created_at)}
          </p>
        </div>
      </div>
    );
  }