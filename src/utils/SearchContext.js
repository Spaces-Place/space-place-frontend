// utils/SearchContext.js
import React, { createContext, useState } from 'react';

export const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const updateSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      searchResults, 
      updateSearch, 
      setSearchResults 
    }}>
      {children}
    </SearchContext.Provider>
  );
};