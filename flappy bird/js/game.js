document.getElementById('nameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let playerName = document.getElementById('playerName').value;
    if (playerName) {
        document.getElementById('nameForm').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        startGame(playerName);
    }
});

function startGame(playerName) {
    const canvas = document.getElementById("flappyBirdCanvas");
    const ctx = canvas.getContext("2d");
    const canvasWidth = window.innerWidth > 480 ? 480 : window.innerWidth - 20;
    const canvasHeight = window.innerHeight > 640 ? 640 : window.innerHeight - 20;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    let score = 0;

    // Bird properties
    const bird = {
        x: 100,  // Position adjusted for larger canvas
        y: 200,
        width: 20,
        height: 20,
        gravity: 0.2,  // Further slowed down gravity
        lift: -4,  // Adjusted lift for easier play
        velocity: 0
    };

    // Pipe properties
    const pipes = [];
    const pipeWidth = 20;
    const pipeGap = 300;  // Significantly increased gap for easier play
    let frame = 0;
    const speed = 0.8;  // Further slowed down pipe movement

    function drawBird() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    function drawPipes() {
        pipes.forEach(pipe => {
            ctx.fillStyle = "green";
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
            ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
        });
    }

    function updatePipes() {
        if (frame % 140 === 0) {  // Slower pipe creation rate
            const pipeHeight = Math.random() * (canvas.height - pipeGap);
            pipes.push({
                x: canvas.width,
                top: pipeHeight,
                bottom: canvas.height - pipeHeight - pipeGap
            });
        }
        pipes.forEach(pipe => {
            pipe.x -= speed;
        });

        if (pipes.length && pipes[0].x < -pipeWidth) {
            pipes.shift();
            score++;
            document.getElementById('score').innerText = score;
        }
    }

    function checkCollision() {
        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            return true;
        }
        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            if (bird.x < pipe.x + pipeWidth &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
                return true;
            }
        }
        return false;
    }

    function gameOver() {
        alert(playerName + ', your score is: ' + score);
        saveScore(playerName, score);
        location.reload();
    }

    function saveScore(name, score) {
        fetch('/api/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, score: score })
        }).then(response => response.json()).then(data => {
            console.log('Score saved:', data);
        });
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBird();
        drawPipes();
        updatePipes();

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (checkCollision()) {
            gameOver();
        } else {
            requestAnimationFrame(gameLoop);
        }

        frame++;
    }

    // Prevent default spacebar scrolling
    window.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            event.preventDefault();
            bird.velocity = bird.lift;
        }
    });

    // Handle mouse clicks for bird movement
    canvas.addEventListener("click", function() {
        bird.velocity = bird.lift;
    });

    gameLoop();
}
