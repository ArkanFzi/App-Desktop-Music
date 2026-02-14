import React, { useState, useEffect } from 'react';
import SongList from './SongList';
import { Search as SearchIcon } from 'lucide-react';

const SearchView = ({ songs, onPlay }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSongs([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const results = songs.filter(song => 
      song.title.toLowerCase().includes(lower) || 
      song.artist?.toLowerCase().includes(lower) ||
      song.album?.toLowerCase().includes(lower)
    );
    setFilteredSongs(results);
  }, [searchTerm, songs]);

  return (
    <div className="search-view">
      <div className="search-header">
        <div className="search-input-container">
          <SearchIcon className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="What do you want to listen to?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {searchTerm && (
        <div className="search-results">
            {filteredSongs.length > 0 ? (
                <SongList songs={filteredSongs} onPlay={onPlay} />
            ) : (
                <div className="no-results">
                    <h3>No results found for "{searchTerm}"</h3>
                    <p>Please make sure your words are spelled correctly, or use less or different keywords.</p>
                </div>
            )}
        </div>
      )}
      {!searchTerm && (
          <div className="browse-all">
              <h2>Browse All</h2>
              <p style={{color: '#b3b3b3'}}>Start typing to search your library...</p>
          </div>
      )}
    </div>
  );
};

export default SearchView;
