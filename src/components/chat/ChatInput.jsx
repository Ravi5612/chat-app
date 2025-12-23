import { useState } from 'react';
import EmojiPickerButton from './EmojiPickerButton';
import FileUploadButton from './FileUploadButton';

export default function ChatInput({ 
  onSendMessage, 
  disabled = false,
  selectedFile,
  onFileSelect,
  onClearFile
}) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex-shrink-0 bg-white border-t border-[#F68537] w-full">
      {/* File Preview */}
      {selectedFile && (
        <div className="p-2 sm:p-3 bg-gray-50 border-b border-[#F68537]">
          <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg p-2 sm:p-3 border border-[#F68537]">
            {selectedFile.type?.startsWith('image/') ? (
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded border border-[#F68537] flex-shrink-0" 
              />
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded flex items-center justify-center border border-[#F68537] flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#F68537]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={onClearFile}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 sm:p-2 rounded-full transition-colors flex-shrink-0"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input Form - FIXED FOR MOBILE */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 w-full">
        {/* File Upload Button */}
        <div className="flex-shrink-0">
          <FileUploadButton 
            onFileSelect={onFileSelect}
            disabled={disabled}
          />
        </div>

        {/* Emoji Picker */}
        <div className="flex-shrink-0">
          <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
        </div>

        {/* Text Input - FLEXIBLE WIDTH */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={selectedFile ? "Add a caption..." : "Type a message..."}
            disabled={disabled}
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-[#F68537] rounded-full focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-[#F68537] focus:border-transparent text-sm sm:text-base disabled:bg-gray-100"
          />
        </div>
        
        {/* Send Button - ALWAYS VISIBLE */}
        <div className="flex-shrink-0">
          <button
            type="submit"
            disabled={disabled || (!message.trim() && !selectedFile)}
            className="bg-[#F68537] text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full font-medium sm:font-semibold border border-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 hover:border-[#F68537] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap min-w-[60px] sm:min-w-[80px] flex items-center justify-center"
            aria-label="Send message"
          >
            <span className="hidden sm:inline">Send</span>
            <span className="sm:hidden">📤</span>
          </button>
        </div>
      </form>
    </div>
  );
}