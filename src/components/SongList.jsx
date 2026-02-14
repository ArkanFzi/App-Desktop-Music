import React from 'react';
import { Clock, Play } from 'lucide-react';

const SongList = ({ songs, onPlay }) => {
  return (
    <div className="song-list-container">
      <div className="song-list-header">
        <div className="col-index">#</div>
        <div className="col-title">Title</div>
        <div className="col-album">Album</div>
        <div className="col-date">Date Added</div>
        <div className="col-duration"><Clock size={16} /></div>
      </div>
      
      <div className="song-list-body">
        {songs.map((song, index) => (
          <div key={song.id} className="song-row" onClick={() => onPlay(song)}>
            <div className="col-index">
              <span className="index-num">{index + 1}</span>
              <span className="play-icon"><Play size={16} fill="white" /></span>
            </div>
            <div className="col-title">
              <div className="song-name">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
            <div className="col-album">{song.album || 'Unknown Album'}</div>
            <div className="col-date">2 days ago</div>
            <div className="col-duration">3:45</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;
