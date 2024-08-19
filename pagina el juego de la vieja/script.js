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

    // Tamaño de cada celda
    const cellSize = cells[0].offsetWidth;

    // Coordenadas del tablero
    const boardRect = document.getElementById('game').getBoundingClientRect();

    winLine.style.position = 'absolute';
    winLine.style.zIndex = '50';

    switch(index) {
        case 0: // Línea horizontal 1
        case 1: // Línea horizontal 2
        case 2: // Línea horizontal 3
            winLine.className = 'line horizontal';
            winLine.style.width = `${cellSize * 3}px`; // Ajusta el ancho para cubrir todas las celdas
            winLine.style.height = '5px'; // Grosor de la línea
            winLine.style.top = `${cells[a].getBoundingClientRect().top - boardRect.top + (cellSize / 2)}px`;
            winLine.style.left = `${cells[0].getBoundingClientRect().left - boardRect.left}px`;
            break;
        case 3: // Línea vertical 1
        case 4: // Línea vertical 2
        case 5: // Línea vertical 3
            winLine.className = 'line vertical';
            winLine.style.width = '5px'; // Grosor de la línea
            winLine.style.height = `${cellSize * 3}px`; // Ajusta la altura para cubrir todas las celdas
            winLine.style.top = `${cells[0].getBoundingClientRect().top - boardRect.top}px`;
            winLine.style.left = `${cells[a].getBoundingClientRect().left - boardRect.left + (cellSize / 2)}px`;
            break;
        case 6: // Línea diagonal de arriba-izquierda a abajo-derecha
            winLine.className = 'line diagonal-1';
            winLine.style.width = `${cellSize * Math.sqrt(2)}px`; // Ajusta el tamaño para cubrir la diagonal
            winLine.style.height = '5px'; // Grosor de la línea
            winLine.style.top = `${cells[0].getBoundingClientRect().top - boardRect.top}px`;
            winLine.style.left = `${cells[0].getBoundingClientRect().left - boardRect.left}px`;
            break;
        case 7: // Línea diagonal de abajo-izquierda a arriba-derecha
            winLine.className = 'line diagonal-2';
            winLine.style.width = `${cellSize * Math.sqrt(2)}px`; // Ajusta el tamaño para cubrir la diagonal
            winLine.style.height = '5px'; // Grosor de la línea
            winLine.style.top = `${cells[2].getBoundingClientRect().top - boardRect.top}px`;
            winLine.style.left = `${cells[2].getBoundingClientRect().left - boardRect.left}px`;
            break;
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
    winLine.style.width = '';
    winLine.style.height = '';
}

// Añade los event listeners para las celdas y el botón de reinicio
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
