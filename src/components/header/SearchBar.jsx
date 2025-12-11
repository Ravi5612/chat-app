import { useState, useEffect } from 'react';

export default function SearchBar({ 
  onSearch, 
  onClear, 
  placeholder = "Search by name, email or phone...",
  className = ""
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const delaySearch = setTimeout(() => {
        if (onSearch) {
          setSearching(true);
          onSearch(searchQuery);
          setSearching(false);
        }
      }, 500);
      return () => clearTimeout(delaySearch);
    } else {
      if (onClear) {
        onClear();
      }
    }
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      setSearching(true);
      onSearch(searchQuery);
      setSearching(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center bg-white rounded-full px-4 py-1.5 ${className}`}>
      <input 
        type="text" 
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 outline-none text-gray-800 text-sm" 
      />
      {searchQuery && (
        <button 
          type="button"
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 mr-2"
        >
          ✕
        </button>
      )}
      <button 
        type="submit"
        disabled={searching}
        className="text-[#F68537] hover:text-[#EAD8A4] transition-colors"
      >
        {searching ? '⏳' : '🔍'}
      </button>
    </form>
  );
}