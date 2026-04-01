// ============================================
// PIXEL OPS - Node.js Backend Server
// @techwithburhan
// ============================================

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from your game frontend

// ---- MySQL Connection Config ----
// CHANGE THESE TO YOUR MySQL CREDENTIALS
const dbConfig = {
  host: 'localhost',       // Your MySQL host
  user: 'root',            // Your MySQL username
  password: 'yourpassword', // Your MySQL password
  database: 'pixelops_db',
  waitForConnections: true,
  connectionLimit: 10,
};

let pool;
(async () => {
  pool = mysql.createPool(dbConfig);
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully!');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();

// ============================================
// ROUTES
// ============================================

// GET /api/player/:name — Get or create player
app.get('/api/player/:name', async (req, res) => {
  const name = req.params.name.trim();
  if (!name || name.length < 2 || name.length > 50) {
    return res.status(400).json({ error: 'Name must be 2–50 characters.' });
  }
  try {
    // Check if player exists
    const [rows] = await pool.query(
      'SELECT * FROM players WHERE name = ?', [name]
    );
    if (rows.length > 0) {
      // Return existing player
      return res.json({ player: rows[0], isNew: false });
    }
    // Create new player
    const [result] = await pool.query(
      'INSERT INTO players (name) VALUES (?)', [name]
    );
    const [newPlayer] = await pool.query(
      'SELECT * FROM players WHERE id = ?', [result.insertId]
    );
    return res.json({ player: newPlayer[0], isNew: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/score — Save score after game ends
app.post('/api/score', async (req, res) => {
  const { player_id, score, kills, wave_reached } = req.body;
  if (!player_id || score === undefined || kills === undefined || wave_reached === undefined) {
    return res.status(400).json({ error: 'Missing fields.' });
  }
  try {
    // Save to history
    await pool.query(
      'INSERT INTO score_history (player_id, score, kills, wave_reached) VALUES (?, ?, ?, ?)',
      [player_id, score, kills, wave_reached]
    );
    // Update player best stats
    await pool.query(`
      UPDATE players SET
        best_score = GREATEST(best_score, ?),
        total_kills = total_kills + ?,
        highest_wave = GREATEST(highest_wave, ?),
        games_played = games_played + 1
      WHERE id = ?
    `, [score, kills, wave_reached, player_id]);
    // Return updated player
    const [updated] = await pool.query('SELECT * FROM players WHERE id = ?', [player_id]);
    return res.json({ success: true, player: updated[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/score/reset/:player_id — Reset player score
app.delete('/api/score/reset/:player_id', async (req, res) => {
  const { player_id } = req.params;
  try {
    await pool.query('DELETE FROM score_history WHERE player_id = ?', [player_id]);
    await pool.query(`
      UPDATE players SET
        best_score = 0,
        total_kills = 0,
        highest_wave = 0,
        games_played = 0
      WHERE id = ?
    `, [player_id]);
    const [updated] = await pool.query('SELECT * FROM players WHERE id = ?', [player_id]);
    return res.json({ success: true, player: updated[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/leaderboard — Top 10 players
app.get('/api/leaderboard', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT name, best_score, total_kills, highest_wave, games_played
      FROM players
      ORDER BY best_score DESC
      LIMIT 10
    `);
    return res.json({ leaderboard: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/history/:player_id — Last 5 games history
app.get('/api/history/:player_id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT score, kills, wave_reached, played_at
      FROM score_history
      WHERE player_id = ?
      ORDER BY played_at DESC
      LIMIT 5
    `, [req.params.player_id]);
    return res.json({ history: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Pixel Ops API running at http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   GET  /api/player/:name`);
  console.log(`   POST /api/score`);
  console.log(`   DELETE /api/score/reset/:player_id`);
  console.log(`   GET  /api/leaderboard`);
  console.log(`   GET  /api/history/:player_id`);
});
