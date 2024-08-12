// Definir las imágenes para las cartas (personaliza estas rutas según tus imágenes)
const images = [
    'imagenes/47ce9e21e14cc02d9b5b84bb176f9f8a.jpg',
    'imagenes/112c34ec6247c330e833f98c3dff1032.jpg',
    'imagenes/818f22f6b79a33668ca8735693c5b9e0.jpg',
    'imagenes/28732ef3548645b92bf7ad7cfb3bf4ad.jpg',
    'imagenes/247506bbf9e4115c3fa998f45efb8713.jpg',
    'imagenes/f21e0fc6019b4a671df347fe68b14054.jpg'
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

        // Añadir la imagen de fondo a la parte frontal de la carta
        const frontImg = document.createElement('img');
        frontImg.src = 'imagenes/trasera de carta.jpg'; // Cambia esta ruta a la de tu imagen
        frontImg.alt = 'Card Cover';
        frontFace.appendChild(frontImg);

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
