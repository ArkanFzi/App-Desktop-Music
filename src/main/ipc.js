const { ipcMain, dialog } = require('electron');
const db = require('./db');
const fs = require('fs');
const mm = require('music-metadata');

const setupIpcHandlers = () => {
  ipcMain.handle('dialog:open-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'flac'] }]
    });
    if (canceled) {
      return { success: false };
    } else {
      return { success: true, filePath: filePaths[0] };
    }
  });

  ipcMain.handle('db:get-playlists', async () => {
    try {
      const res = await db.query('SELECT * FROM playlists ORDER BY name ASC');
      return { success: true, data: res.rows };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('db:create-playlist', async (event, name) => {
    try {
      const res = await db.query('INSERT INTO playlists(name) VALUES($1) RETURNING *', [name]);
      return { success: true, data: res.rows[0] };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('db:add-song', async (event, filePath) => {
    try {
      // Parse metadata
      let title = filePath.split(/[\\/]/).pop();
      let artist = 'Unknown Artist';
      let album = 'Unknown Album';
      let duration = 0;

      try {
          const metadata = await mm.parseFile(filePath);
          if (metadata.common.title) title = metadata.common.title;
          if (metadata.common.artist) artist = metadata.common.artist;
          if (metadata.common.album) album = metadata.common.album;
          if (metadata.format.duration) duration = metadata.format.duration;
      } catch (parseErr) {
          console.warn('Failed to parse metadata:', parseErr);
      }

      const res = await db.query(
        'INSERT INTO songs(title, artist, album, file_path, duration) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [title, artist, album, filePath, duration]
      );
      return { success: true, data: res.rows[0] };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  });
  
  ipcMain.handle('db:get-songs', async () => {
      try {
          const res = await db.query('SELECT * FROM songs ORDER BY created_at DESC');
          return { success: true, data: res.rows };
      } catch (err) {
          console.error(err);
          return { success: false, error: err.message };
      }
  });
};

module.exports = setupIpcHandlers;
