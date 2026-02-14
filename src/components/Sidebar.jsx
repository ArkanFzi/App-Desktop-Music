import React from 'react';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';

const Sidebar = ({ playlists, onCreatePlaylist, onNavigate, currentView }) => {
  return (
    <div className="sidebar">
      <div className="logo">
        <span className="logo-icon">🎵</span> Music App
      </div>
      
      <div className="nav-links">
        <div className={`nav-item ${currentView === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
          <Home size={24} />
          <span>Home</span>
        </div>
        <div className={`nav-item ${currentView === 'search' ? 'active' : ''}`} onClick={() => onNavigate('search')}>
          <Search size={24} />
          <span>Search</span>
        </div>
        <div className={`nav-item ${currentView === 'library' ? 'active' : ''}`} onClick={() => onNavigate('library')}>
          <Library size={24} />
          <span>Your Library</span>
        </div>
      </div>
      
      <div className="divider"></div>
      
      <div className="nav-actions">
        <div className="nav-item" onClick={onCreatePlaylist}>
          <PlusSquare size={24} />
          <span>Create Playlist</span>
        </div>
        <div className="nav-item">
          <Heart size={24} />
          <span>Liked Songs</span>
        </div>
      </div>
      
      <div className="divider"></div>
      
      <div className="playlists-list">
        {playlists.map(playlist => (
          <div key={playlist.id} className="playlist-item">
            {playlist.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
