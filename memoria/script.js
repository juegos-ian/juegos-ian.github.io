// Definir las imágenes para las cartas (personaliza estas rutas según tus imágenes)
const images = [
    'imagenes/3822ccbeae7626f6897ca14858343e6d.jpg',
    'imagenes/405e6062ebfce27f964a5caa7a63f9a7.jpg',
    'imagenes/5eac2bc862181121ef041e1b7f73f8f5.jpg',
    'imagenes/e87a809fc3b890684912d22f772ddce1.jpg',
    'imagenes/ec15882116e46d7243cd3603d3a28f34.jpg',
    'imagenes/f7ca98f183470ff52c2c9fc013409170.jpg'
];

// Duplicar las imágenes para formar parejas
const cards = images.concat(images);

let flippedCards = [];
let boardLocked = false;

// Función para barajar las cartas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Crear el tablero del juego
function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    shuffle(cards);
    cards.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;

        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.textContent = '🌟'; // Símbolo de cubierta de carta

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'Card Image'; // Añadir un texto alternativo para accesibilidad

        backFace.appendChild(img);
        card.appendChild(frontFace);
        card.appendChild(backFace);
        gameBoard.appendChild(card);
        card.addEventListener('click', handleCardClick);
    });
}

// Definir las rutas de los archivos de audio
const flipCardSound = new Audio('sonido/mario-bros-jump.mp3');
const matchFoundSound = new Audio('sonido/woohoo-text-sms.mp3');
const gameCompleteSound = new Audio('sonido/victory-sonic.mp3'); // Asegúrate de que la ruta sea correcta

// Función para manejar el clic en una carta
function handleCardClick() {
    if (boardLocked || this.classList.contains('flip')) return;

    this.classList.add('flip');
    flippedCards.push(this);
    flipCardSound.play();

    if (flippedCards.length === 2) {
        boardLocked = true;
        setTimeout(checkForMatch, 1000);
    }
}

// Función para verificar si las cartas coinciden
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        card1.removeEventListener('click', handleCardClick);
        card2.removeEventListener('click', handleCardClick);
        matchFoundSound.play();
        boardLocked = false; // Desbloquear el tablero aquí
        checkGameComplete();
    } else {
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            boardLocked = false; // Desbloquear el tablero aquí
        }, 1000);
    }
    flippedCards = [];
}

// Función para verificar si se completó el juego
function checkGameComplete() {
    const allCards = document.querySelectorAll('.card');
    if ([...allCards].every(card => card.classList.contains('flip'))) {
        gameCompleteSound.play();
    }
}

// Iniciar el juego al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    createGameBoard(); // Cargar el tablero del juego al iniciar
});
