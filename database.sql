-- ============================================
-- PIXEL OPS: Gun FPS Commando Survival
-- MySQL Database Schema
-- @techwithburhan
-- ============================================

CREATE DATABASE IF NOT EXISTS pixelops_db;
USE pixelops_db;

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  best_score INT DEFAULT 0,
  total_kills INT DEFAULT 0,
  highest_wave INT DEFAULT 0,
  games_played INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Score history table
CREATE TABLE IF NOT EXISTS score_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  score INT NOT NULL,
  kills INT NOT NULL,
  wave_reached INT NOT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_best_score ON players(best_score DESC);
CREATE INDEX idx_score_history_player ON score_history(player_id);

-- Sample data (optional)
INSERT INTO players (name, best_score, total_kills, highest_wave, games_played)
VALUES
  ('BurhanPro', 1500, 80, 6, 10),
  ('CommadoX', 1200, 65, 5, 8),
  ('PixelSniper', 900, 45, 4, 5);
