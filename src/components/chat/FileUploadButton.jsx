import { useRef } from 'react';

export default function FileUploadButton({ onFileSelect, disabled = false }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Reset input
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="text-gray-500 hover:text-[#F68537] transition-all duration-200 p-2 flex-shrink-0 rounded-lg hover:bg-gray-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Attach file"
        aria-label="Attach file or image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
          />
        </svg>
      </button>
    </>
  );
}