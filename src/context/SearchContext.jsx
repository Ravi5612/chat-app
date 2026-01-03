import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = (results, currentUserId) => {
        console.log('🔍 Search results update:', results);
        setSearchResults({ results, currentUserId });
    };

    const handleClearSearch = () => {
        console.log('🧹 Clearing search in Context');
        setSearchResults(null);
    };

    return (
        <SearchContext.Provider value={{ searchResults, handleSearch, handleClearSearch }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    return useContext(SearchContext);
}
