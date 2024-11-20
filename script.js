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
function createObstacle(type = "normal") {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.dataset.type = type;

  obstacle.style.left = `${Math.random() * (gameArea.clientWidth - gameArea.clientWidth * 0.1)}px`;
  obstacle.style.top = '0px';

  //vitesse : 1 = trés lent, 10 = trés rapide
  if (type === "fast") {
    obstacle.dataset.speed = 4; //
    obstacle.style.backgroundColor = "red";
  } else if (type === "shooter") {
    obstacle.dataset.speed = 2; //
    obstacle.style.backgroundColor = "purple";
    obstacle.dataset.shootTimer = Math.random() * 2000 + 1000;
  } else {
    obstacle.dataset.speed = 2; //
    obstacle.style.backgroundColor = "green";
  }

  gameArea.appendChild(obstacle);
  obstacles.push(obstacle);
}

// Crée un laser
function shootLaser() {
  const laser = document.createElement('div');
  laser.classList.add('laser');
  laser.style.left = `${playerPosition + player.clientWidth / 2 - 2}px`;
  laser.style.top = `${player.offsetTop}px`;
  gameArea.appendChild(laser);
  lasers.push(laser);
}
// enemies peuvent tirer des lasers
function shootObstacleLaser(obstacle) {
  const laser = document.createElement('div');
  laser.classList.add('laser');
  laser.style.left = `${parseInt(obstacle.style.left) + obstacle.offsetWidth / 2 - 2}px`;
  laser.style.top = `${parseInt(obstacle.style.top) + obstacle.offsetHeight}px`;
  laser.dataset.type = "enemy";
  gameArea.appendChild(laser);
  lasers.push(laser);
}

// Déplace les obstacles et gère les collisions
function moveObstacles() {
  obstacles.forEach((obstacle) => {
    const speed = parseInt(obstacle.dataset.speed);
    let obstacleTop = parseInt(obstacle.style.top);
    obstacle.style.top = `${obstacleTop + speed}px`;

    // Supprimer les obstacles hors écran
    if (obstacleTop > gameArea.clientHeight) {
      obstacle.remove();
      obstacles = obstacles.filter((obs) => obs !== obstacle);
      return;
    }

    // La condition de perdre la partie : se prendre un obstacle
    if (detectCollision(player, obstacle)) {
      endGame();
      return;
    }

    // obstacle enemy ayant la capacité de tirer des lasers
    if (obstacle.dataset.type === "shooter") {
      obstacle.dataset.shootTimer -= 15;
      if (obstacle.dataset.shootTimer <= 0) {
        shootObstacleLaser(obstacle);
        obstacle.dataset.shootTimer = Math.random() * 2000 + 1000;
      }
    }
  });
}

// laser enemie et joueur
function moveLasers() {
  lasers.forEach((laser) => {
    let laserTop = parseInt(laser.style.top);

    // interaction laser ennemie
    if (laser.dataset.type === "enemy") {
      laser.style.top = `${laserTop + 5}px`;
      if (laserTop > gameArea.clientHeight) {
        laser.remove();
        lasers = lasers.filter((lz) => lz !== laser);
        return;
      }

      // Collision avec le joueur = gameover
      if (detectCollision(laser, player)) {
        endGame();
        return;
      }
    } else {
      // laser detruit au bout de l'ecran
      laser.style.top = `${laserTop - 10}px`;
      if (laserTop < 0) {
        laser.remove();
        lasers = lasers.filter((lz) => lz !== laser);
        return;
      }

      // interactions avec laser joueur avec obstacles
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
    }
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

    // choisir le type d'obstacle
    const rand = Math.random();
    if (rand < 0.005) {
      createObstacle("fast");
    } else if (rand < 0.01) {
      createObstacle("shooter");
    } else if (rand < 0.05) {
      createObstacle("normal");
    }

    requestAnimationFrame(gameLoop);
  }
}

// Démarrage du programme
gameLoop();
