const { initDb, query, pool } = require('./db');

async function testDb() {
  console.log('Starting DB Test...');
  try {
    await initDb();
    console.log('Schema initialized.');
    
    // Test Insert
    const testPlaylist = 'Test Playlist ' + Date.now();
    const res = await query('INSERT INTO playlists(name) VALUES($1) RETURNING *', [testPlaylist]);
    console.log('Inserted Playlist:', res.rows[0]);
    
    // Test Select
    const selectRes = await query('SELECT * FROM playlists');
    console.log('Total Playlists:', selectRes.rows.length);
    
  } catch (err) {
    console.error('DB Test Failed:', err);
  } finally {
    await pool.end();
    console.log('DB Connection Closed.');
  }
}

testDb();
