import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';

export default function EmojiPickerButton({ onEmojiSelect }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  const handleEmojiClick = (emojiObject) => {
    if (onEmojiSelect) {
      onEmojiSelect(emojiObject.emoji);
    }
    // Keep picker open for multiple emoji selection
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="text-gray-500 hover:text-[#F68537] transition-colors p-2 flex-shrink-0 rounded-lg hover:bg-gray-100"
        title="Add emoji"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </button>

      {/* Emoji Picker Popup */}
      {showPicker && (
        <div className="absolute bottom-12 left-0 z-50 shadow-2xl rounded-lg">
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            width={300}
            height={400}
            theme="light"
            searchDisabled={false}
            skinTonesDisabled={false}
            previewConfig={{
              showPreview: false
            }}
          />
        </div>
      )}
    </div>
  );
}