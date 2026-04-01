# 🎮 PIXEL OPS: Gun FPS Commando Survival
### Full Stack Setup Guide — @techwithburhan

---
<img width="1920" height="991" alt="image" src="https://github.com/user-attachments/assets/1884bd79-6eff-409d-ba45-37c84070473e" />

<img width="1920" height="851" alt="image" src="https://github.com/user-attachments/assets/8415df20-3bbf-4bd6-8acc-83441f30404e" />
---

## 📁 PROJECT STRUCTURE

```
pixelops/
├── index.html       ← Game frontend (open in browser)
├── server.js        ← Node.js backend API
├── package.json     ← Node.js dependencies
├── database.sql     ← MySQL schema & tables
└── README.md        ← This file
```

---

## ⚙️ STEP 1 — Setup MySQL Database

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal)
2. Run the database.sql file:

```bash
mysql -u root -p < database.sql
```

Or paste contents of database.sql directly into MySQL Workbench.

This creates:
- Database: `pixelops_db`
- Table: `players` (stores player name, best score, kills, wave)
- Table: `score_history` (stores each game result)

---

## ⚙️ STEP 2 — Configure Backend

Open `server.js` and update your MySQL credentials:

```javascript
const dbConfig = {
  host: 'localhost',        // Your MySQL host
  user: 'root',             // Your MySQL username
  password: 'yourpassword', // ← CHANGE THIS
  database: 'pixelops_db',
};
```

---

## ⚙️ STEP 3 — Install & Run Backend

Make sure Node.js is installed (https://nodejs.org)

```bash
cd pixelops
npm install
node server.js
```

You should see:
```
✅ MySQL connected successfully!
🚀 Pixel Ops API running at http://localhost:3001
```

---

## ⚙️ STEP 4 — Open the Game

Open `index.html` in your browser.

> If you're hosting on a server, update this line in index.html:
```javascript
const API_BASE = 'http://localhost:3001/api';
// Change to:
const API_BASE = 'https://yourdomain.com/api';
```

---

## 🌐 API ENDPOINTS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/player/:name | Get or create player |
| POST | /api/score | Save game score |
| DELETE | /api/score/reset/:id | Reset player scores |
| GET | /api/leaderboard | Top 10 players |
| GET | /api/history/:id | Player game history |

---

## 🎮 GAME FEATURES

- ✅ Player name login (stored in MySQL)
- ✅ Best score, kills, wave, games played stored in DB
- ✅ Score auto-saved after every game
- ✅ Reset Score button with confirmation
- ✅ Live Leaderboard (Top 10)
- ✅ Sound ON/OFF toggle
- ✅ Fullscreen mode
- ✅ 3 weapons: AK-47, Shotgun, Sniper
- ✅ 3 enemy types: Normal, Fast, Heavy
- ✅ Wave-based survival gameplay
- ✅ @techwithburhan thumbnail branding

---

## 🚀 DEPLOY TO PRODUCTION

1. Upload all files to your VPS/server
2. Install Node.js + MySQL on server
3. Use PM2 to keep server running:
```bash
npm install -g pm2
pm2 start server.js --name pixelops
pm2 save
```
4. Use Nginx to serve index.html and proxy /api to Node

---

Built with ❤️ by @techwithburhan
