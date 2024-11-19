// Récupère les éléments principaux dans le DOM
const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');

// Initialise les propriétés principales du jeu
let playerPosition = gameArea.clientWidth / 2 - player.clientWidth / 2;
let score = 0;
let gameOver = false;
let obstacles = [];
let lasers = [];

let startX = 0;

// Detecte debut swipe
gameArea.addEventListener('touchstart', function (event) {
  startX = event.touches[0].clientX;
});

// Detect swipe fin et determine la direction
gameArea.addEventListener('touchend', function (event) {
  const endX = event.changedTouches[0].clientX;
  const diffX = endX - startX;

  if (diffX > 30) {
    // Swipe right
    movePlayer(20);
  } else if (diffX < -30) {
    // Swipe left
    movePlayer(-20);
  }
});
// mouvements
document.getElementById('moveLeft').addEventListener('click', function () {
  movePlayer(-20);
});
document.getElementById('moveRight').addEventListener('click', function () {
  movePlayer(20);
});

// Tire laser
document.getElementById('shoot').addEventListener('click', function () {
  shootLaser();
});


// Écoute les touches gauche et droite pour appeler les fonctions de mouvement respectives
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    movePlayer(-20);
  } else if (event.key === 'ArrowRight') {
    movePlayer(20);
  } else if (event.key === ' ') {
    shootLaser();
  }
});

// Déplace le joueur
function movePlayer(direction) {
  playerPosition += direction;
  // S'assure que la position du joueur ne sort pas de l'écran
  if (playerPosition < 0) {
    playerPosition = 0;
  } else if (playerPosition + player.clientWidth > gameArea.clientWidth) {
    playerPosition = gameArea.clientWidth - player.clientWidth;
  }
  player.style.left = `${playerPosition}px`;
}

// Crée un obstacle et l'ajoute à la liste
function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = `${Math.random() * (gameArea.clientWidth - gameArea.clientWidth * 0.1)}px`; // Adjust width dynamically
  obstacle.style.top = '0px';
  gameArea.appendChild(obstacle);
  obstacles.push(obstacle);
}

// Crée un laser
function shootLaser() {
  const laser = document.createElement('div');
  laser.classList.add('laser');
  laser.style.left = `${playerPosition + player.clientWidth / 2 - 2}px`; // Dynamically center laser
  laser.style.top = `${player.offsetTop}px`;
  gameArea.appendChild(laser);
  lasers.push(laser);
}

// Déplace les obstacles et gère les collisions
function moveObstacles() {
  obstacles.forEach((obstacle) => {
    let obstacleTop = parseInt(obstacle.style.top);
    obstacle.style.top = `${obstacleTop + 2}px`;


    if (obstacleTop > gameArea.clientHeight) {
      obstacle.remove();
      obstacles = obstacles.filter((obs) => obs !== obstacle);
    }

    // La condition de perdre la partie : se prendre un obstacle
    if (detectCollision(player, obstacle)) {
      endGame();
    }
  });
}
function moveLasers() {
  lasers.forEach((laser) => {
    let laserTop = parseInt(laser.style.top);
    laser.style.top = `${laserTop - 10}px`;

    // detect et enleve laser en haut de l'écran
    if (laserTop < 0) {
      laser.remove();
      lasers = lasers.filter((lz) => lz !== laser);
    }

    // Detecte la collision des lasers
    obstacles.forEach((obstacle) => {
      if (detectCollision(laser, obstacle)) {
        obstacle.remove();
        laser.remove();


        obstacles = obstacles.filter((obs) => obs !== obstacle);
        lasers = lasers.filter((lz) => lz !== laser);


        score += 10;
        updateScore();
      }
    });
  });
}
// Détecte les collisions
function detectCollision(col1, col2) {
  const col1Rect = col1.getBoundingClientRect();
  const col2Rect = col2.getBoundingClientRect();

  return !(
      col1Rect.top > col2Rect.bottom ||
      col1Rect.bottom < col2Rect.top ||
      col1Rect.right < col2Rect.left ||
      col1Rect.left > col2Rect.right
  );
}

// Met à jour le score
function updateScore() {
  scoreDisplay.innerHTML = `Score : ${score}`;
}

// Fin de la partie
function endGame() {
  gameOver = true;
  alert(`Game Over! Votre score final est de : ${score}`);
  window.location.reload();
}

// Boucle principale du jeu
function gameLoop() {
  if (!gameOver) {
    moveObstacles();
    moveLasers();
    if (Math.random() < 0.02) {
      createObstacle();
    }
    requestAnimationFrame(gameLoop);
  }
}

// Démarrage du programme
gameLoop();
