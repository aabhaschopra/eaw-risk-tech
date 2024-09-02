const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let playerName = "";
let score = 0;

document.getElementById("playerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    playerName = document.getElementById("playerName").value;
    startGame();
});

const snake = [{x: 200, y: 200}];
let dx = 10;
let dy = 0;
let foodX;
let foodY;

function startGame() {
    document.getElementById("playerForm").style.display = "none";
    main();
    generateFood();
    document.addEventListener("keydown", changeDirection);
}

function main() {
    if (gameOver()) {
        saveScore();
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        drawGrid();  // Call the function to draw the grid
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
    ctx.strokeStyle = "#e0e0e0";  // Light grey color for gridlines
    for (let x = 0.5; x < canvas.width; x += 10) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0.5; y < canvas.height; y += 10) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}

function generateFood() {
    foodX = Math.round((Math.random() * (canvas.width - 10)) / 10) * 10;
    foodY = Math.round((Math.random() * (canvas.height - 10)) / 10) * 10;
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, 10, 10);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;

    if (didEatFood) {
        score += 10;
        document.getElementById("score").textContent = "Score: " + score;
        generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach(snakePart => {
        ctx.fillStyle = "lightgreen";
        ctx.strokeStyle = "darkgreen";
        ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
        ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    });
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function gameOver() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function saveScore() {
    fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playerName, score }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "leaderboard.html";
        } else {
            alert('Error saving score');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
