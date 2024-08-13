document.addEventListener("DOMContentLoaded", () => {
    const puzzles = [
        { id: 'puzzle1', image: 'imagenes/3e0ba4e9fb2422418ca52cb1b4661ff8.jpg' },
        { id: 'puzzle2', image: 'imagenes/5ec3c917ab57ec6a94399d6f44a51fd2.jpg' },
        { id: 'puzzle3', image: 'imagenes/6a5762e46e1096b656fcda3ee394bfdf.jpg' },
        { id: 'puzzle4', image: 'imagenes/6dedbc8b786ddfdc5de60aab16b55d22.jpg' },
        { id: 'puzzle5', image: 'imagenes/6e323d0a59df45b3708cd3c37079aab7.jpg' },
        { id: 'puzzle6', image: 'imagenes/13d4d5f32de95ae6cd6d90df7dd148b6.jpg' },
        { id: 'puzzle7', image: 'imagenes/96d825e2ddb7c0fd743d9fba0f7882ed.jpg' },
        { id: 'puzzle8', image: 'imagenes/0153efc7df6a8db2ec0c0dd11c73e41a.jpg' },
        { id: 'puzzle9', image: 'imagenes/859f6f6e8914c3ac0aa7ab3c818bffeb.jpg' },
        { id: 'puzzle10', image: 'imagenes/554189095713a450dc20c043a11b6c6e.jpg' },
        { id: 'puzzle11', image: 'imagenes/badabfcc19852cfe5324cc575b16c68a.jpg' },
        { id: 'puzzle12', image: 'imagenes/f1b02b7739b6cb9dff95e99e5c72a0f2.jpg' },
        { id: 'puzzle13', image: 'imagenes/f60db2af7b192c2cf38de2278468a28a.jpg' },
        { id: 'puzzle14', image: 'imagenes/fb80a1b7d90d82bfb5a06428e7477200.jpg' },
        { id: 'puzzle15', image: 'imagenes/fondo.jpg' },
      

    ];
    
    let currentPuzzleIndex = 0;

    puzzles.forEach(puzzle => {
        createPuzzle(puzzle.id, puzzle.image, false);
    });

    window.resetPuzzle = function resetPuzzle(puzzleId) {
        const puzzleContainer = document.getElementById(puzzleId);
        const pieces = Array.from(puzzleContainer.children);

        pieces.forEach(piece => {
            piece.remove(); // Eliminar todas las piezas del rompecabezas
        });

        createPuzzle(puzzleId, puzzles.find(puzzle => puzzle.id === puzzleId).image, true); // Volver a crear el rompecabezas desordenado
        removeCompletionIndicator(puzzleContainer); // Eliminar el indicador de completado si existe
    };

    function createPuzzle(puzzleId, image, shuffle) {
        const puzzleContainer = document.getElementById(puzzleId);
        let pieces = [];

        for (let i = 0; i < 20; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.id = `${puzzleId}-piece${i + 1}`;
            piece.style.backgroundImage = `url(${image})`;
            piece.style.backgroundPosition = `${(i % 4) * -100}px ${Math.floor(i / 4) * -100}px`;
            piece.draggable = true;
            pieces.push(piece);
        }

        if (shuffle) shuffleArray(pieces); // Mezclar las piezas si se especifica
        pieces.forEach(piece => puzzleContainer.appendChild(piece)); // Agregar las piezas al contenedor

        pieces.forEach(piece => {
            piece.addEventListener("dragstart", dragStart);
            piece.addEventListener("dragover", dragOver);
            piece.addEventListener("drop", drop);
            piece.addEventListener("dragend", dragEnd);

            // Agregar eventos táctiles
            piece.addEventListener("touchstart", touchStart);
            piece.addEventListener("touchmove", touchMove);
            piece.addEventListener("touchend", touchEnd);
        });
    }

    // ... (El resto de tu código permanece igual


    // ... (resto del código, incluyendo funciones de arrastrar y soltar, y navegación


    function dragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.id);
        setTimeout(() => {
            e.target.classList.add("hide");
        }, 0);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const draggableElement = document.getElementById(id);
        const dropzone = e.target;

        if (dropzone !== draggableElement && dropzone.classList.contains("puzzle-piece")) {
            const parent = dropzone.parentNode;
            const temp = document.createElement('div');
            parent.replaceChild(temp, dropzone);
            parent.replaceChild(dropzone, draggableElement);
            parent.replaceChild(draggableElement, temp);
        }

        draggableElement.classList.remove("hide");

        checkCompletion(dropzone.parentNode);
    }

    function dragEnd(e) {
        e.target.classList.remove("hide");
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function checkCompletion(puzzleContainer) {
        const pieces = Array.from(puzzleContainer.children);
        let isComplete = true;

        pieces.forEach((piece, index) => {
            const pieceIndex = parseInt(piece.id.split('-piece')[1]) - 1;
            if (pieceIndex !== index) {
                isComplete = false;
            }
        });

        if (isComplete) {
            showCompletionIndicator(puzzleContainer);
            playCompletionSound(); // Llamar a la función para reproducir el sonido de completado
        } else {
            removeCompletionIndicator(puzzleContainer);
        }
    }

    function showCompletionIndicator(puzzleContainer) {
        let completionIndicator = puzzleContainer.querySelector('.completion-indicator');
        if (!completionIndicator) {
            completionIndicator = document.createElement('div');
            completionIndicator.classList.add('completion-indicator');
            const img = document.createElement('img');
            img.src = 'imagenes/completado.png'; // Ruta relativa a la imagen de completado
            completionIndicator.appendChild(img);
            puzzleContainer.appendChild(completionIndicator);
        }
    }

    function removeCompletionIndicator(puzzleContainer) {
        const existingIndicator = puzzleContainer.querySelector('.completion-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
    }

    function playCompletionSound() {
        const audio = document.getElementById('completion-sound');
        audio.play();
    }

    // Funciones para manejar eventos táctiles
    function touchStart(e) {
        const touch = e.touches[0];
        this.initialX = touch.clientX - this.offsetLeft;
        this.initialY = touch.clientY - this.offsetTop;
    }

    function touchMove(e) {
        const touch = e.touches[0];
        this.style.left = `${touch.clientX - this.initialX}px`;
        this.style.top = `${touch.clientY - this.initialY}px`;
    }

    function touchEnd(e) {
        const dropzone = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

        if (dropzone !== this && dropzone.classList.contains("puzzle-piece")) {
            const parent = dropzone.parentNode;
            const temp = document.createElement('div');
            parent.replaceChild(temp, dropzone);
            parent.replaceChild(dropzone, this);
            parent.replaceChild(this, temp);
        }

        this.style.left = '';
        this.style.top = '';

        checkCompletion(this.parentNode);
    }

    // Funciones para navegación entre rompecabezas
    window.nextPuzzle = function() {
        const totalPuzzles = puzzles.length;
        document.getElementById(`puzzle-page${currentPuzzleIndex + 1}`).style.display = 'none';
        currentPuzzleIndex = (currentPuzzleIndex + 1) % totalPuzzles;
        document.getElementById(`puzzle-page${currentPuzzleIndex + 1}`).style.display = 'block';
    };

    window.prevPuzzle = function() {
        const totalPuzzles = puzzles.length;
        document.getElementById(`puzzle-page${currentPuzzleIndex + 1}`).style.display = 'none';
        currentPuzzleIndex = (currentPuzzleIndex - 1 + totalPuzzles) % totalPuzzles;
        document.getElementById(`puzzle-page${currentPuzzleIndex + 1}`).style.display = 'block';
    };

    window.resetCurrentPuzzle = function() {
        resetPuzzle(puzzles[currentPuzzleIndex].id);
    };
});
