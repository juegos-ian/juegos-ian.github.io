// Variables globales
let currentPlayer = 'X'; // Jugador actual
let gameMode = 'AI'; // Modo actual: 'AI' o '1vs1'
let gameActive = true; // Indica si el juego está activo

// Elementos del DOM
const board = document.getElementById('game');
const cells = board.querySelectorAll('.cell');
const resetButton = document.getElementById('reset'); // Asegúrate de que este ID sea correcto en tu HTML
const toggleAIButton = document.getElementById('toggleAI');
const oneVsOneButton = document.getElementById('one-vs-one');
const resultImage = document.getElementById('result-image');
const resultImg = document.getElementById('result-img');

// Elementos para la imagen de perder
const loseImage = document.getElementById('lose-image');
const loseImg = document.getElementById('lose-img');

// Sonidos
const clickSound = new Audio('sonidos/mario-coin.mp3');
const winSound = new Audio('sonidos/ringtones-super-mario-bros.mp3');
const loseSound = new Audio('sonidos/mario-bros game over.mp3');

// Imágenes
const winImageSrc = 'imagenes/Diseño sin título (84)-Photoroom.png'; // Imagen de victoria en modo IA o 1vs1
const loseImageSrc = 'imagenes/Diseño sin título (85)-Photoroom.png'; // Imagen de pérdida en modo IA

// Combinaciones ganadoras
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
    [0, 4, 8], [2, 4, 6] // diagonales
];

// Función para comprobar si hay un ganador
function checkWin() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        const cellA = cells[a].textContent;
        const cellB = cells[b].textContent;
        const cellC = cells[c].textContent;

        if (cellA && cellA === cellB && cellA === cellC) {
            return cellA; // Devuelve el ganador 'X' o 'O'
        }
    }
    return null; // No hay ganador
}

// Función para manejar clics en las celdas
function handleClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    if (cell.textContent) return; // La celda ya está ocupada

    cell.textContent = currentPlayer;
    clickSound.play();

    const winner = checkWin();
    if (winner) {
        endGame(winner);
    } else if ([...cells].every(cell => cell.textContent)) {
        gameActive = false; // Empate
    } else if (gameMode === 'AI' && currentPlayer === 'X') {
        currentPlayer = 'O';
        setTimeout(aiMove, 500); // Esperar 500ms antes de que la IA se mueva
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// Función para terminar el juego
function endGame(winner) {
    gameActive = false;

    if (winner === 'X') {
        winSound.play();
        resultImg.src = winImageSrc;
        resultImage.classList.remove('hidden');
        resultImage.style.display = 'block';
    } else if (winner === 'O') {
        loseSound.play();
        loseImg.src = loseImageSrc;
        loseImage.classList.remove('hidden');
        loseImage.style.display = 'block';
    }
}

// Función para que la IA realice su movimiento
function aiMove() {
    if (!gameActive) return; // Si el juego ya ha terminado, no permitir movimientos

    const bestMove = findBestMove();

    if (bestMove !== null) {
        cells[bestMove].textContent = 'O';
        const winner = checkWin();
        if (winner === 'O') { // Solo declaramos derrota si la IA gana
            endGame('O');
        } else if ([...cells].every(cell => cell.textContent)) {
            gameActive = false; // Empate
        } else {
            currentPlayer = 'X';
        }
    }
}

// Función para encontrar el mejor movimiento para la IA
function findBestMove() {
    const emptyCells = [...cells].map((cell, index) => cell.textContent === '' ? index : null).filter(index => index !== null);

    // Intentar ganar primero
    for (const index of emptyCells) {
        cells[index].textContent = 'O';
        if (checkWin() === 'O') {
            cells[index].textContent = '';
            return index; // Gana la IA
        }
        cells[index].textContent = '';
    }

    // Luego bloquear la victoria del jugador
    for (const index of emptyCells) {
        cells[index].textContent = 'X';
        if (checkWin() === 'X') {
            cells[index].textContent = '';
            return index; // Bloquea al jugador
        }
        cells[index].textContent = '';
    }

    // Tomar el centro si está disponible
    const center = 4;
    if (emptyCells.includes(center)) {
        return center;
    }

    // Tomar una esquina si está disponible
    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
        if (emptyCells.includes(corner)) {
            return corner;
        }
    }

    // Elegir un movimiento aleatorio
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Función para reiniciar el juego
function resetGame() {
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = ''); // Limpiar las celdas
    resultImage.classList.add('hidden');
    resultImage.style.display = 'none';
    loseImage.classList.add('hidden');
    loseImage.style.display = 'none';
    gameActive = true; // Reactivar el juego
    document.getElementById('win-line').classList.add('hidden'); // Ocultar la línea de victoria si existía
}

// Función para configurar el modo AI
function setAI() {
    gameMode = 'AI';
    resetGame();
}

// Función para configurar el modo 1vs1
function setOneVsOne() {
    gameMode = '1vs1';
    resetGame();
}

// Espera a que el DOM esté cargado antes de añadir los eventos
document.addEventListener('DOMContentLoaded', () => {
    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetButton.addEventListener('click', resetGame); // Activar el botón de reinicio
    toggleAIButton.addEventListener('click', setAI);
    oneVsOneButton.addEventListener('click', setOneVsOne);
});
