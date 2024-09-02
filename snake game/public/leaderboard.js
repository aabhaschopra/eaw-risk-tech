document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboard = data.leaderboard;
            const leaderboardTable = document.getElementById("leaderboard");

            leaderboard.forEach((player, index) => {
                const row = leaderboardTable.insertRow();
                row.insertCell(0).innerText = index + 1;
                row.insertCell(1).innerText = player.name;
                row.insertCell(2).innerText = player.score;
                row.insertCell(3).innerText = player.plays;
            });

            // Add a row for the total number of games played
            const totalPlaysRow = leaderboardTable.insertRow();
            totalPlaysRow.insertCell(0).innerText = '';
            totalPlaysRow.insertCell(1).innerText = 'Total Games Played';
            totalPlaysRow.insertCell(2).innerText = '';
            totalPlaysRow.insertCell(3).innerText = data.plays;  // Display total plays
        });
});
