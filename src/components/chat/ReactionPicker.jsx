// components/ReactionPicker.jsx
import { useState } from 'react';
import { Smile, ThumbsUp, Heart, Laugh, Sad, Angry } from 'lucide-react'; // या react-icons

const EMOJI_LIST = [
  { emoji: '👍', label: 'Thumbs Up' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' }
];

export default function ReactionPicker({ messageId, onReact }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleReaction = (emoji) => {
    onReact(messageId, emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowPicker(!showPicker)}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <Smile size={16} />
      </button>

      {showPicker && (
        <div className="absolute bottom-full left-0 bg-white border rounded-lg shadow-lg p-2 flex gap-2 z-10">
          {EMOJI_LIST.map(({ emoji, label }) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="text-xl hover:scale-125 transition-transform p-1"
              title={label}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}