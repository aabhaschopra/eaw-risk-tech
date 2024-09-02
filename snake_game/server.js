const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const leaderboardFile = path.join(__dirname, 'leaderboard.json');

// Initialize leaderboard file if not exists
if (!fs.existsSync(leaderboardFile)) {
    fs.writeFileSync(leaderboardFile, JSON.stringify({ plays: 0, leaderboard: [] }));
}

// Get leaderboard data
app.get('/api/leaderboard', (req, res) => {
    fs.readFile(leaderboardFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading leaderboard data.");
        }
        res.json(JSON.parse(data));
    });
});

// Update leaderboard
app.post('/api/leaderboard', (req, res) => {
    const { name, score } = req.body;

    fs.readFile(leaderboardFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading leaderboard data.");
        }

        const leaderboardData = JSON.parse(data);
        leaderboardData.plays += 1;  // Increment the total plays

        const playerIndex = leaderboardData.leaderboard.findIndex(player => player.name === name);

        if (playerIndex !== -1) {
            leaderboardData.leaderboard[playerIndex].score = Math.max(leaderboardData.leaderboard[playerIndex].score, score);
            leaderboardData.leaderboard[playerIndex].plays += 1;
        } else {
            leaderboardData.leaderboard.push({ name, score, plays: 1 });
        }

        leaderboardData.leaderboard.sort((a, b) => b.score - a.score);
        if (leaderboardData.leaderboard.length > 10) leaderboardData.leaderboard.pop();

        fs.writeFile(leaderboardFile, JSON.stringify(leaderboardData), (err) => {
            if (err) {
                return res.status(500).send("Error saving leaderboard data.");
            }
            res.json({ success: true });
        });
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
