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
    <div className="flex-shrink-0 bg-white border-t border-gray-200 shadow-lg">
      {/* File Preview */}
      {selectedFile && (
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
            {selectedFile.type?.startsWith('image/') ? (
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded" 
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={onClearFile}
              className="text-red-500 hover:text-red-700 p-1"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-3 md:p-4">
        {/* File Upload Button */}
        <FileUploadButton 
          onFileSelect={onFileSelect}
          disabled={disabled}
        />

        {/* Emoji Picker */}
        <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />

        {/* Text Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedFile ? "Add a caption..." : "Type a message..."}
          disabled={disabled}
          className="flex-1 px-4 py-2.5 md:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F68537] focus:border-transparent text-sm md:text-base disabled:bg-gray-100"
        />
        
        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || (!message.trim() && !selectedFile)}
          className="bg-[#F68537] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-full font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex-shrink-0"
        >
          {disabled ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
}