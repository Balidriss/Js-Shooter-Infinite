import { GAMEENV } from "./GAMEENV.js";

// Load env
GAMEENV.initialize();

// Main game variables
const player = GAMEENV.PLAYER;
const gameArea = GAMEENV.GAMEAREA;
const scoreDisplay = GAMEENV.SCORE;
const playerWidth = GAMEENV.PLAYERWIDTH;
let lastTime = 0;

// Initialize controls
const keyboardControl = GAMEENV.keyboardControl;
const touchControl = GAMEENV.touchControl;

// Configur player movment
function movePlayer(deltaTime) {
  const currentPosition = GAMEENV.playerPosition;

  // Use active control inputs
  const keyboardTarget = keyboardControl.direction !== 0
      ? keyboardControl.getTargetPosition(currentPosition, playerWidth)
      : currentPosition;

  const touchTarget = touchControl.targetX > 0
      ? touchControl.getTargetPosition(currentPosition, playerWidth)
      : currentPosition;

  // Combine inputs
  GAMEENV.playerPosition = touchControl.targetX > 0 && keyboardControl.direction !== 0
      ? (keyboardTarget + touchTarget) / 2
      : touchControl.targetX > 0
          ? touchTarget
          : keyboardTarget;

  // Keep player in game bounds
  GAMEENV.playerPosition = Math.max(0, Math.min(GAMEENV.GAMEWIDTH - playerWidth, GAMEENV.playerPosition));
  player.style.left = `${GAMEENV.playerPosition}px`;
}

// Create a laser
function shootLaser() {
  const laser = document.createElement("div");
  laser.classList.add("laser");

  // Position the laser at the center-top of the player
  laser.style.left = `${GAMEENV.playerPosition + playerWidth / 2 - 2}px`;
  laser.style.top = `${player.offsetTop - 10}px`;

  gameArea.appendChild(laser);
  GAMEENV.lasers.push(laser);
}

// Start automatic shooting
function startAutoShooting(rateOfFire = 500) {
  if (GAMEENV.autoShootInterval) clearInterval(GAMEENV.autoShootInterval);
  GAMEENV.autoShootInterval = setInterval(() => {
    if (!GAMEENV.gameOver) shootLaser();
  }, rateOfFire);
}

// Create obstacle
function createObstacle(type = "normal") {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.dataset.type = type;

  const obstacleLeft = Math.random() * (GAMEENV.GAMEWIDTH - GAMEENV.GAMEWIDTH * 0.1);
  obstacle.style.left = `${obstacleLeft}px`;
  obstacle.style.top = "-50px"; // Spawn well above the game area

  if (type === "fast") {
    obstacle.dataset.speed = 4;
    obstacle.classList.add("fast");

  } else if (type === "shooter") {
    obstacle.dataset.speed = 2;
    obstacle.classList.add("shooter");
    obstacle.dataset.shootTimer = GAMEENV.FIRST_SHOT_TIMER + (Math.random() * 1000); // first shoot timer ~ 1s
    obstacle.dataset.shootInterval = GAMEENV.SHOT_INTERVAL; // Set a default shoot interval of 2 seconds
  } else {
    obstacle.dataset.speed = 2;

  }

  // Ensure no collision with the player on spawn
  if (!GAMEENV.detectCollision(player, obstacle)) {
    gameArea.appendChild(obstacle);
    GAMEENV.obstacles.push(obstacle);
  }
}

// Shoot a laser from an obstacle that can shoot
function shootObstacleLaser(obstacle) {
  const laser = document.createElement("div");
  laser.classList.add("laser", "enemy"); // Enemy laser class for differentiation
  laser.dataset.source = "enemy"; // Mark it as an enemy laser

  // Position the laser at the center-bottom of the obstacle
  laser.style.left = `${parseInt(obstacle.style.left) + obstacle.clientWidth / 2 - 2}px`;
  laser.style.top = `${parseInt(obstacle.style.top) + obstacle.clientHeight}px`;

  // Add the laser to the game area and lasers array
  gameArea.appendChild(laser);
  GAMEENV.lasers.push(laser);
}

// Move obstacles and handle collisions
function moveObstacles(deltaTime) {
  GAMEENV.obstacles.forEach((obstacle) => {
    const speed = parseInt(obstacle.dataset.speed);
    let obstacleTop = parseInt(obstacle.style.top);
    obstacle.style.top = `${obstacleTop + speed}px`;



    // Remove obstacles that move out of bounds
    if (obstacleTop > GAMEENV.GAMEHEIGHT) {
      obstacle.remove();
      GAMEENV.obstacles = GAMEENV.obstacles.filter((obs) => obs !== obstacle);
      return;
    }

    // Game over condition: Player collides with an obstacle
    if (GAMEENV.detectCollision(player, obstacle)) {
      endGame();
      return;
    }

    // Shooter obstacle logic: Shoot lasers at regular intervals
    if (obstacle.dataset.type === "shooter") {
      obstacle.dataset.shootTimer -= deltaTime;

      if (obstacle.dataset.shootTimer <= 0) {
        shootObstacleLaser(obstacle); // Fire laser from shooter
        obstacle.dataset.shootTimer = obstacle.dataset.shootInterval; // Reset shoot timer
      }
    }
  });
}

// Move lasers and handle collisions
function moveLasers(deltaTime) {
  GAMEENV.lasers.forEach((laser) => {
    const laserTop = parseInt(laser.style.top);

    if (laser.dataset.source === "enemy") {
      // Enemy laser moves down
      laser.style.top = `${laserTop + 5}px`;
      if (laserTop > GAMEENV.GAMEHEIGHT) {
        laser.remove();
        GAMEENV.lasers = GAMEENV.lasers.filter((lz) => lz !== laser);
        return;
      }

      // If enemy laser collides with the player
      if (GAMEENV.detectCollision(laser, player)) {
        endGame();
        return;
      }
    } else {
      // Player laser moves up
      laser.style.top = `${laserTop - 10}px`;
      if (laserTop < 0) {
        laser.remove();
        GAMEENV.lasers = GAMEENV.lasers.filter((lz) => lz !== laser);
        return;
      }

      // Player lasers should only destroy obstacles
      GAMEENV.obstacles.forEach((obstacle) => {
        if (GAMEENV.detectCollision(laser, obstacle)) {
          obstacle.remove();
          laser.remove();
          GAMEENV.obstacles = GAMEENV.obstacles.filter((obs) => obs !== obstacle);
          GAMEENV.lasers = GAMEENV.lasers.filter((lz) => lz !== laser);

          // Score on destroying obstacles
          GAMEENV.score += 10;
          GAMEENV.updateScore();
        }
      });
    }
  });
}

// Update the score
function updateScore() {
  scoreDisplay.innerHTML = `Score: ${GAMEENV.score}`;
}

// End the game
function endGame() {
  GAMEENV.gameOver = true;
  clearInterval(GAMEENV.autoShootInterval);
  alert(`Game Over! Your final score is: ${GAMEENV.score}`);
  window.location.reload();
}

function gameLoop(timestamp) {
  // Calculate deltaTime (time difference between this frame and the last one)
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp; // Update lastTime to the current timestamp

  console.log(deltaTime);

  if (!GAMEENV.gameOver) {
    movePlayer(deltaTime);
    moveObstacles(deltaTime);
    moveLasers(deltaTime);

    // Spawn obstacles with random probabilities
    const rand = Math.random();
    if (rand < 0.005) {
      createObstacle("fast");
    } else if (rand < 0.01) {
      createObstacle("shooter");
    } else if (rand < 0.05) {
      createObstacle("normal");
    }

    // Request the next frame and continue the game loop
    requestAnimationFrame(gameLoop);
  }
}


// Start the game
startAutoShooting(GAMEENV.PLAYER_FIRERATE); // Start automatic shooting with a rate of fire of 500ms
gameLoop(0);
