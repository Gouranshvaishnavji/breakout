const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const startButton = document.querySelector('#startButton');
const pauseButton = document.querySelector('#pauseButton');
const resetButton = document.querySelector('#resetButton');
const difficultySelect = document.querySelector('#difficulty');

const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;

let xDirection = -2;
let yDirection = 2;
let speed = parseInt(difficultySelect.value);
let gameRunning = false;
let timerId;
let score = 0;

const userStart = [230, 10];
let currentPosition = [...userStart];

const ballStart = [270, 40];
let ballCurrentPosition = [...ballStart];

class Block {
    constructor(x, y) {
        this.bottomLeft = [x, y];
        this.bottomRight = [x + blockWidth, y];
        this.topRight = [x + blockWidth, y + blockHeight];
        this.topLeft = [x, y + blockHeight];
    }
}

let blocks = [];

function createBlocks() {
    blocks = [
        new Block(10, 270), new Block(120, 270), new Block(230, 270),
        new Block(340, 270), new Block(450, 270), new Block(10, 240),
        new Block(120, 240), new Block(230, 240), new Block(340, 240),
        new Block(450, 240), new Block(10, 210), new Block(120, 210),
        new Block(230, 210), new Block(340, 210), new Block(450, 210)
    ];
}

function addBlocks() {
    grid.innerHTML = ''; // Clear previous elements
    blocks.forEach(block => {
        const blockElement = document.createElement('div');
        blockElement.classList.add('block');
        blockElement.style.left = block.bottomLeft[0] + 'px';
        blockElement.style.bottom = block.bottomLeft[1] + 'px';
        grid.appendChild(blockElement);
    });

    grid.appendChild(user);
    grid.appendChild(ball);
    drawUser();
    drawBall();
}

const user = document.createElement('div');
user.classList.add('user');

const ball = document.createElement('div');
ball.classList.add('ball');

function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

function moveUser(e) {
    if (e.key === 'ArrowLeft' && currentPosition[0] > 0) {
        currentPosition[0] -= 10;
    } else if (e.key === 'ArrowRight' && currentPosition[0] < (boardWidth - blockWidth)) {
        currentPosition[0] += 10;
    }
    drawUser();
}

document.addEventListener('keydown', moveUser);

function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}

function checkForCollisions() {
    for (let i = 0; i < blocks.length; i++) {
        if (
            ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
            ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
            ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
            ballCurrentPosition[1] < blocks[i].topLeft[1]
        ) {
            blocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.innerHTML = score;
            addBlocks();

            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'You Win!';
                clearInterval(timerId);
                gameRunning = false;
            }
        }
    }

    if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0) {
        xDirection *= -1;
    }

    if (ballCurrentPosition[1] >= (boardHeight - ballDiameter)) {
        yDirection *= -1;
    }

    if (
        ballCurrentPosition[0] > currentPosition[0] &&
        ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
        ballCurrentPosition[1] > currentPosition[1] &&
        ballCurrentPosition[1] < currentPosition[1] + blockHeight
    ) {
        changeDirection();
    }

    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'Game Over!';
        gameRunning = false;
    }
}

function changeDirection() {
    yDirection *= -1;
}

startButton.addEventListener('click', () => {
    if (!gameRunning) {
        createBlocks();
        addBlocks();
        speed = parseInt(difficultySelect.value);
        timerId = setInterval(moveBall, speed);
        gameRunning = true;
    }
});

pauseButton.addEventListener('click', () => {
    clearInterval(timerId);
    gameRunning = false;
});

resetButton.addEventListener('click', () => {
    clearInterval(timerId);
    gameRunning = false;
    score = 0;
    scoreDisplay.innerHTML = score;
    ballCurrentPosition = [...ballStart];
    currentPosition = [...userStart];
    createBlocks();
    addBlocks();
});
