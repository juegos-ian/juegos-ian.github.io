// Variables globales
let currentPlayer = 'X'; // Jugador actual
let gameMode = 'AI'; // Modo actual: 'AI' o '1vs1'
let gameActive = true; // Indica si el juego está activo

// Elementos del DOM
const board = document.getElementById('game');
const cells = board.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
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
const winningCombination = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
    [0, 4, 8], [2, 4, 6] // diagonales
];

// Función para comprobar si hay un ganador
function checkWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        const cellA = cells[a].textContent;
        const cellB = cells[b].textContent;
        const cellC = cells[c].textContent;

        console.log(`Checking combination: ${combination} -> ${cellA}, ${cellB}, ${cellC}`);

        if (cellA && cellA === cellB && cellA === cellC) {
            console.log(`Winner found: ${cellA}`);
            showWinLine(combination);
            gameActive = false;


            if (cellA === 'X') {
                winSound.play();
                resultImg.src = winImageSrc;
                resultImage.classList.remove('hidden');
                resultImage.style.display = 'block';
            }
             else if (cellA === 'O') {
                loseSound.play();
                loseImg.src = loseImageSrc;
                loseImage.classList.remove('hidden');
                loseImage.style.display = 'block';
            }
            return cellA;
        }
    }
    return null;
}


// Función para mostrar la línea de victoria
function showWinLine(combo) {
    const winLine = document.getElementById('win-line');
    winLine.classList.remove('hidden');
    winLine.className = 'line';

    const [a, b, c] = combo;

    if (a === b && a === c) {
        winLine.classList.add('horizontal');
        winLine.style.top = `${Math.floor(a / 3) * 100}px`;
        winLine.style.left = '0';
        winLine.style.width = '300px';
        winLine.style.height = '5px';
        winLine.style.transform = '';
    } else if ((a % 3) === (b % 3) && (b % 3) === (c % 3)) {
        winLine.classList.add('vertical');
        winLine.style.left = `${(a % 3) * 100}px`;
        winLine.style.top = '0';
        winLine.style.width = '5px';
        winLine.style.height = '300px';
        winLine.style.transform = '';
    } else if (a === 0 && b === 4 && c === 8) {
        winLine.classList.add('diagonal-1');
        winLine.style.left = '0';
        winLine.style.top = '0';
        winLine.style.width = '425px';
        winLine.style.height = '5px';
        winLine.style.transform = 'rotate(45deg)';
    } else if (a === 2 && b === 4 && c === 6) {
        winLine.classList.add('diagonal-2');
        winLine.style.left = '0';
        winLine.style.top = '0';
        winLine.style.width = '425px';
        winLine.style.height = '5px';
        winLine.style.transform = 'rotate(-45deg)';
    }
}

// Función para manejar clics en las celdas
// Función para manejar clics en las celdas
function handleClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    if (cell.textContent) return;

    cell.textContent = currentPlayer;
    clickSound.play();

    console.log(`Player ${currentPlayer} moved to cell ${[...cells].indexOf(cell)}`);

    const winner = checkWin(); // Verificar si hay un ganador después del movimiento
    if (!winner && [...cells].every(cell => cell.textContent)) {
        gameActive = false; // Empate
    } else if (!winner && gameMode === 'AI' && currentPlayer === 'X') {
        currentPlayer = 'O';
        setTimeout(aiMove, 500); // Esperar 500ms antes de que la IA se mueva
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// Función para que la IA realice su movimiento
function aiMove() {
    if (!gameActive) return;

    const bestMove = findBestMove();

    if (bestMove !== null) {
        cells[bestMove].textContent = 'O';
        console.log(`AI moved to cell ${bestMove}`);

        const winner = checkWin(); // Verificar si hay un ganador después del movimiento de la IA
        if (!winner && [...cells].every(cell => cell.textContent)) {
            gameActive = false; // Empate
        } else {
            currentPlayer = 'X'; // Cambiar de turno al jugador humano
        }
    }
}


// Función para encontrar el mejor movimiento para la IA
function findBestMove() {
    const emptyCells = [...cells].map((cell, index) => cell.textContent === '' ? index : null).filter(index => index !== null);

    for (const index of emptyCells) {
        cells[index].textContent = 'O';
        if (checkWin() === 'O') {
            cells[index].textContent = '';
            return index;
        }
        cells[index].textContent = '';
    }

    for (const index of emptyCells) {
        cells[index].textContent = 'X';
        if (checkWin() === 'X') {
            cells[index].textContent = '';
            return index;
        }
        cells[index].textContent = '';
    }

    const center = 4;
    if (emptyCells.includes(center)) {
        return center;
    }

    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
        if (emptyCells.includes(corner)) {
            return corner;
        }
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
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

// Función para reiniciar el juego
function resetGame() {
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    document.getElementById('win-line').classList.add('hidden');
    resultImage.classList.add('hidden');
    resultImage.style.display = 'none';
    loseImage.classList.add('hidden');
    loseImage.style.display = 'none'; // Asegura que la imagen de perder esté oculta

    // Reiniciar sonidos
    clickSound.pause();
    clickSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    loseSound.pause();
    loseSound.currentTime = 0;

    gameActive = true;
}

// Espera a que el DOM esté cargado antes de añadir los eventos
document.addEventListener('DOMContentLoaded', () => {
    cells.forEach(cell => cell.addEventListener('click', handleClick));
    resetButton.addEventListener('click', resetGame);
    toggleAIButton.addEventListener('click', setAI);
    oneVsOneButton.addEventListener('click', setOneVsOne);
});
