let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 9;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let gameRunning = true;

const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const hiscoreBox = document.getElementById('hiscoreBox');
const speedBox = document.getElementById('speedBox');
const themeSelector = document.getElementById('themeSelector');
const difficultySelector = document.getElementById('difficultySelector');
const muteBtn = document.getElementById('muteBtn');
const gameOverMsg = document.getElementById('gameOverMsg');
const lastScoreEl = document.getElementById('lastScore');
const restartBtn = document.getElementById('restartBtn');

let hiscore = localStorage.getItem("hiscore") || 0;
let hiscoreval = JSON.parse(hiscore);
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    if (gameRunning) gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        endGame();
        return;
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score++;
        scoreBox.innerHTML = "Score: " + score;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = { x: Math.floor(2 + 14 * Math.random()), y: Math.floor(2 + 14 * Math.random()) };
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) snakeArr[i + 1] = { ...snakeArr[i] };
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, i) => {
        const el = document.createElement('div');
        el.style.gridRowStart = e.y;
        el.style.gridColumnStart = e.x;
        el.classList.add(i === 0 ? 'head' : 'snake');
        board.appendChild(el);
    });

    const foodEl = document.createElement('div');
    foodEl.style.gridRowStart = food.y;
    foodEl.style.gridColumnStart = food.x;
    foodEl.classList.add('food');
    board.appendChild(foodEl);
}

function endGame() {
    gameOverSound.play();
    musicSound.pause();
    gameRunning = false;
    lastScoreEl.innerText = `Your Score: ${score}`;
    gameOverMsg.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
    score = 0;
    snakeArr = [{ x: 13, y: 15 }];
    inputDir = { x: 0, y: 0 };
    scoreBox.innerHTML = "Score: 0";
    gameOverMsg.classList.add('hidden');
    gameRunning = true;
    musicSound.play();
});

window.addEventListener('keydown', e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp": inputDir = { x: 0, y: -1 }; break;
        case "ArrowDown": inputDir = { x: 0, y: 1 }; break;
        case "ArrowLeft": inputDir = { x: -1, y: 0 }; break;
        case "ArrowRight": inputDir = { x: 1, y: 0 }; break;
    }
});

let isMuted = false;
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    [musicSound, moveSound, foodSound, gameOverSound].forEach(s => s.muted = isMuted);
    muteBtn.textContent = isMuted ? "🔇 Unmute" : "🔊 Mute";
});

themeSelector.addEventListener('change', e => {
    document.body.className = e.target.value;
});

difficultySelector.addEventListener('change', e => {
    switch (e.target.value) {
        case "easy": speed = 3; break;
        case "medium": speed = 6; break;
        case "hard": speed = 9; break;
    }
    speedBox.innerHTML = `Speed: ${speed}`;
});

musicSound.play();
window.requestAnimationFrame(main);
