import MatrixUtility from "./animasi.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20; // Ukuran setiap sel grid
const canvasSize = canvas.width / gridSize; // Jumlah sel di satu sisi

let snake = [{ x: 5, y: 5 }]; // Posisi awal ular
let direction = { x: 1, y: 0 }; // Gerakan awal ke kanan
let gameRunning = false; // Status permainan
let fruit = { x: 0, y: 0 }; // Posisi buah
let score = 0; // Skor awal

// Fungsi memulai game
function startGame() {
    snake = [{ x: 5, y: 5 }]; // Reset posisi ular
    direction = { x: 1, y: 0 }; // Reset arah
    gameRunning = true; // Status game berjalan
    score = 0; // Reset skor
    document.getElementById("startButton").disabled = true; // Disable tombol start
    placeFruit(); // Tempatkan buah awal
    gameLoop(); // Mulai game loop
}

// Fungsi untuk menggambar grid
function drawGridPrimitive() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < canvasSize; i++) {
        for (let j = 0; j < canvasSize; j++) {
            drawRectanglePrimitive(imageData, i * gridSize, j * gridSize, gridSize, gridSize, 255, 255, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

// Fungsi menggambar buah menggunakan primitive
function drawFruitPrimitive(imageData) {
    drawRectanglePrimitive(imageData, fruit.x * gridSize, fruit.y * gridSize, gridSize, gridSize, 255, 0, 0); // Warna merah untuk buah
}

// Fungsi menempatkan buah di posisi acak
function placeFruit() {
    fruit.x = Math.floor(Math.random() * canvasSize);
    fruit.y = Math.floor(Math.random() * canvasSize);
}

// Variabel untuk elemen skor
const scoreDisplay = document.getElementById("scoreDisplay");

let snakeColor = [0, 0, 0]; // RGB untuk warna awal (hitam)
let segmentSize = gridSize;

// Fungsi memperbarui posisi ular - chat gpt -
function updateSnakePosition() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Cek apakah ular menabrak dinding
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameRunning = false;
        alert("Game Over! Your score: " + score);
        document.getElementById("startButton").disabled = false;
        return;
    }

    // Cek apakah ular menabrak tubuhnya sendiri
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameRunning = false;
            alert("Game Over! You collided with yourself. Your score: " + score);
            document.getElementById("startButton").disabled = false;
            return;
        }
    }

    // Cek apakah ular memakan buah
    if (head.x === fruit.x && head.y === fruit.y) {
        score++;
        scoreDisplay.textContent = "Score: " + score;

        // Ganti warna ular setiap 5 skor
        if (score % 5 === 0) {
            snakeColor = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
        }

        placeFruit();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}
// sampai sini yang pakai chat gpt

// ini untuk looping
function gameLoop() {
    if (!gameRunning) return; // Berhenti jika permainan tidak berjalan

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    drawGridPrimitive();
    updateSnakePosition();
    drawSnakePrimitive(imageData);
    drawFruitPrimitive(imageData);
    ctx.putImageData(imageData, 0, 0);

    setTimeout(gameLoop, 150); // kecepatan looping utk ularnya
}


function drawSnakePrimitive(imageData) {
    snake.forEach(segment => {
        drawRectanglePrimitive(imageData, segment.x * segmentSize, segment.y * segmentSize, segmentSize, segmentSize, ...snakeColor);
    });
}

function setPixel(imageData, x, y, r, g, b, a = 255) {
    const index = (x + y * imageData.width) * 4;
    imageData.data[index] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

// Fungsi menggambar persegi panjang dengan metode primitif
function drawRectanglePrimitive(imageData, x, y, width, height, r, g, b) {
    for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
            setPixel(imageData, i, j, r, g, b);
        }
    }
}

// Event listener untuk kontrol ular
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
        case "s":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
        case "a":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
        case "d":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Event untuk mengontrol ular dengan klik
canvas.addEventListener("click", (event) => {
    if (!gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize);
    const y = Math.floor((event.clientY - rect.top) / gridSize);

    const head = snake[0];
    if (x > head.x) direction = { x: 1, y: 0 };
    else if (x < head.x) direction = { x: -1, y: 0 };
    else if (y > head.y) direction = { x: 0, y: 1 };
    else if (y < head.y) direction = { x: 0, y: -1 };
});

// Menjalankan fungsi startGame ketika tombol diklik
document.getElementById("startButton").addEventListener("click", startGame);

