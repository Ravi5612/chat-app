import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiStyle, SkinTones, Theme } from 'emoji-picker-react';

export default function EmojiPickerButton({ 
  onEmojiSelect, 
  buttonClassName = '',
  pickerPosition = 'bottom-left' // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
}) {
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
    // Keep picker open for multiple selections
  };

  // Position classes based on prop
  const getPositionClasses = () => {
    switch (pickerPosition) {
      case 'bottom-left':
        return 'bottom-12 left-0';
      case 'bottom-right':
        return 'bottom-12 right-0';
      case 'top-left':
        return 'top-12 left-0';
      case 'top-right':
        return 'top-12 right-0';
      default:
        return 'bottom-12 left-0';
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className={`
          text-gray-500 hover:text-[#F68537] 
          transition-all duration-200
          p-2 flex-shrink-0 rounded-lg 
          hover:bg-gray-100 active:scale-95
          ${showPicker ? 'bg-gray-100 text-[#F68537]' : ''}
          ${buttonClassName}
        `}
        title="Add emoji"
        aria-label="Open emoji picker"
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
        <div 
          className={`
            absolute ${getPositionClasses()} z-50 
            shadow-2xl rounded-lg 
            animate-fadeIn
          `}
        >
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            
            // ✅ Dimensions
            width={320}
            height={450}
            
            // ✅ Styling
            theme={Theme.LIGHT}
            emojiStyle={EmojiStyle.NATIVE} // Twitter, Apple, Facebook, Google, or Native
            
            // ✅ Search
            searchDisabled={false}
            searchPlaceholder="Search emojis..."
            autoFocusSearch={true}
            
            // ✅ Skin Tones
            skinTonesDisabled={false}
            defaultSkinTone={SkinTones.NEUTRAL}
            
            // ✅ Preview
            previewConfig={{
              showPreview: true,
              defaultEmoji: "1f60a", // 😊
              defaultCaption: "Choose your emoji!"
            }}
            
            // ✅ Categories
            categories={[
              {
                category: 'suggested',
                name: 'Recently Used'
              },
              {
                category: 'smileys_people',
                name: 'Smileys & People'
              },
              {
                category: 'animals_nature',
                name: 'Animals & Nature'
              },
              {
                category: 'food_drink',
                name: 'Food & Drink'
              },
              {
                category: 'travel_places',
                name: 'Travel & Places'
              },
              {
                category: 'activities',
                name: 'Activities'
              },
              {
                category: 'objects',
                name: 'Objects'
              },
              {
                category: 'symbols',
                name: 'Symbols'
              },
              {
                category: 'flags',
                name: 'Flags'
              }
            ]}
            
            // ✅ Suggestions Mode
            suggestedEmojisMode="recent" // 'recent' or 'frequent'
            
            // ✅ Performance
            lazyLoadEmojis={true}
            
            // ✅ Custom styling via CSS variables (optional)
            style={{
              '--epr-bg-color': '#ffffff',
              '--epr-category-label-bg-color': '#EAD8A4',
              '--epr-hover-bg-color': '#FFF5E6',
              '--epr-focus-bg-color': '#F68537',
              '--epr-search-border-color': '#F68537',
            }}
          />
        </div>
      )}
    </div>
  );
}