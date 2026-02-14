import React, { useEffect, useState } from 'react';
import AudioPlayer from './components/AudioPlayer';
import Sidebar from './components/Sidebar';
import SongList from './components/SongList';
import SearchView from './components/SearchView';
import Modal from './components/Modal';
import { Plus } from 'lucide-react';
const { ipcRenderer } = window.require('electron');

function App() {
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // home, search, library

  // Modal State
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
        const [playlistRes, songsRes] = await Promise.all([
            ipcRenderer.invoke('db:get-playlists'),
            ipcRenderer.invoke('db:get-songs')
        ]);
        
        if (playlistRes.success) setPlaylists(playlistRes.data);
        if (songsRes.success) setSongs(songsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
  };

  const handleAddSong = async () => {
    try {
        const result = await ipcRenderer.invoke('dialog:open-file');
        if (result.success && result.filePath) {
            // Note: Now passing just filePath, IPC handles metadata
            const addRes = await ipcRenderer.invoke('db:add-song', result.filePath);
            if (addRes.success) {
                setSongs(prev => [addRes.data, ...prev]);
            }
        }
    } catch (err) {
        console.error('Error adding song:', err);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const result = await ipcRenderer.invoke('db:create-playlist', newPlaylistName);
      if (result.success) {
        setPlaylists(prev => [...prev, result.data]);
        setNewPlaylistName('');
        setIsPlaylistModalOpen(false);
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  const renderMainContent = () => {
      switch(currentView) {
          case 'search':
              return <SearchView songs={songs} onPlay={setCurrentSong} />;
          case 'library':
              // Reuse SongList for now, or create dedicated library view later
              return (
                <>
                    <div className="header-section">
                        <h1>Your Library</h1>
                        <button className="add-btn" onClick={handleAddSong}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Plus size={18} /> Add Music
                            </span>
                        </button>
                    </div>
                    <SongList songs={songs} onPlay={setCurrentSong} />
                </>
              );
          case 'home':
          default:
              return (
                  <>
                    <div className="header-section">
                        <h1>Good Evening</h1>
                    </div>
                    
                    <h2 style={{fontSize: '24px', marginBottom: '16px'}}>Recently Added</h2>
                    <SongList songs={songs.slice(0, 5)} onPlay={setCurrentSong} />
                  </>
              );
      }
  };

  return (
    <div className="app-layout">
        <Sidebar 
            playlists={playlists} 
            onCreatePlaylist={() => setIsPlaylistModalOpen(true)} 
            onNavigate={setCurrentView}
            currentView={currentView}
        />
        
        <div className="main-view">
            {loading ? <p>Loading...</p> : renderMainContent()}
        </div>

        <div className="player-bar-container">
             <AudioPlayer currentSong={currentSong} />
        </div>

        <Modal 
            isOpen={isPlaylistModalOpen} 
            onClose={() => setIsPlaylistModalOpen(false)}
            title="Create Playlist"
        >
            <input 
                type="text" 
                placeholder="My Playlist #1" 
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
            />
            <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setIsPlaylistModalOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleCreatePlaylist}>Create</button>
            </div>
        </Modal>
    </div>
  );
}

export default App;
