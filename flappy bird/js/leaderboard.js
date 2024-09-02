window.onload = function() {
    fetch('/api/leaderboard')
    .then(response => response.json())
    .then(data => {
        const leaderboard = data.leaderboard;
        const totalGamesPlayed = data.totalGamesPlayed;
        const tableBody = document.querySelector("#leaderboardTable tbody");

        leaderboard.forEach((entry, index) => {
            let row = tableBody.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            cell1.innerText = index + 1;
            cell2.innerText = entry.name;
            cell3.innerText = entry.score;
            cell4.innerText = entry.plays || 1;
        });

        const totalGamesPlayedText = document.getElementById('totalGamesPlayed');
        totalGamesPlayedText.innerText = `Total games played: ${totalGamesPlayed}`;
    });
}
