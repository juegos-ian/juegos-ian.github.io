// Selecciona todas las celdas y el botón de reinicio
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const winLine = document.getElementById('win-line');

// Inicializa el jugador actual y el estado del juego
let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

// Condiciones de victoria
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Maneja el clic en una celda
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Evita que se juegue en una celda ya ocupada o si el juego ha terminado
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    // Actualiza el estado del juego y la celda clickeada
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    // Verifica si hay un ganador
    const winInfo = checkWin();
    if (winInfo) {
        drawWinLine(winInfo);
        gameActive = false;
        return;
    }

    // Verifica si hay un empate
    if (!gameState.includes("")) {
        alert("¡Es un empate!");
        gameActive = false;
        return;
    }

    // Cambia el turno al siguiente jugador
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Verifica si alguien ha ganado
function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return { condition: winningConditions[i], index: i };
        }
    }
    return null;
}

// Dibuja la línea ganadora
function drawWinLine({ condition, index }) {
    const [a, b, c] = condition;

    if (index < 3) { // Línea horizontal
        winLine.className = 'line horizontal';
        winLine.style.top = `${(a < 3 ? 50 : (a < 6 ? 155 : 260))}px`;
        winLine.style.left = '0px';
    } else if (index < 6) { // Línea vertical
        winLine.className = 'line vertical';
        winLine.style.left = `${(a === 0 || a === 3 || a === 6 ? 50 : (a === 1 || a === 4 || a === 7 ? 155 : 260))}px`;
        winLine.style.top = '0px';
    } else if (index === 6) { // Línea diagonal de arriba-izquierda a abajo-derecha
        winLine.className = 'line diagonal-1';
        winLine.style.left = '50px';
        winLine.style.top = '0px';
    } else if (index === 7) { // Línea diagonal de abajo-izquierda a arriba-derecha
        winLine.className = 'line diagonal-2';
        winLine.style.right = '50px';
        winLine.style.top = '0px';
    }
}

// Reinicia el juego
function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    winLine.className = 'line'; // Oculta la línea ganadora
    winLine.style.top = '';
    winLine.style.left = '';
    winLine.style.right = '';
}

// Añade los event listeners para las celdas y el botón de reinicio
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
