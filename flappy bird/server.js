const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const leaderboardFile = path.join(__dirname, 'leaderboard.json');

app.use(express.static(__dirname));
app.use(express.json());

let totalGamesPlayed = 0;

// Serve the game and leaderboard pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'leaderboard.html'));
});

// API to get leaderboard data
app.get('/api/leaderboard', (req, res) => {
    fs.readFile(leaderboardFile, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading leaderboard data');
        }
        const leaderboard = JSON.parse(data);
        res.json({ leaderboard, totalGamesPlayed });
    });
});

// API to save a new score
app.post('/api/leaderboard', (req, res) => {
    const newScore = req.body;
    totalGamesPlayed++;

    fs.readFile(leaderboardFile, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading leaderboard data');
        }

        let leaderboard = JSON.parse(data);

        const existingPlayer = leaderboard.find(entry => entry.name === newScore.name);
        if (existingPlayer) {
            existingPlayer.score = Math.max(existingPlayer.score, newScore.score);
            existingPlayer.plays = (existingPlayer.plays || 0) + 1;
        } else {
            newScore.plays = 1;
            leaderboard.push(newScore);
        }

        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);

        fs.writeFile(leaderboardFile, JSON.stringify(leaderboard, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving leaderboard data');
            }
            res.json({ message: 'Score saved' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
