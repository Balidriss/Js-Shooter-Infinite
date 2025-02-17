import { gameState } from "./gameState.js";
import { Player } from "./entities/player.js";
import { Enemy } from "./entities/enemy.js";
import { Laser } from "./entities/laser.js";

export class Engine {
    constructor(input) {
        this.input = input;
        this.lastTime = performance.now();
        this.player = new Player();
        this.autoShootTimer = null;
    }

    start() {
        this.startAutoShooting(gameState.PLAYER_FIRERATE);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    startAutoShooting(rate) {
        if (this.autoShootTimer) clearInterval(this.autoShootTimer);
        this.autoShootTimer = setInterval(() => {
            if (!gameState.gameOver) {
                const laser = new Laser(this.player, "player");
                gameState.GAMEAREA.appendChild(laser.element);
                gameState.lasers.push(laser);
            }
        }, rate);
    }

    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (!gameState.gameOver) {
            this.player.update(deltaTime, this.input);
            gameState.enemies.forEach(obs => obs.update(deltaTime));
            gameState.enemies = gameState.enemies.filter(obs => {
                if (obs.isOutOfBounds()) {
                    obs.element.remove();
                    return false;
                }
                const playerEl = document.getElementById("player");
                if (gameState.detectCollision(obs.element, playerEl)) {
                    this.endGame();
                    return false;
                }
                return true;
            });

            gameState.lasers = gameState.lasers.filter(laser => {
                const result = laser.update();
                if (result === "hitPlayer") {
                    this.endGame();
                    return false;
                } else if (result === "hitEnemy") {
                    gameState.score += 10;
                    gameState.updateScore();
                    laser.element.remove();
                    return false;
                } else if (!result) {
                    laser.element.remove();
                    return false;
                }
                return true;
            });

            const rand = Math.random();
            if (rand < 0.005) {
                const obs = new Enemy("fast");
                gameState.GAMEAREA.appendChild(obs.element);
                gameState.enemies.push(obs);
            } else if (rand < 0.01) {
                const obs = new Enemy("shooter");
                gameState.GAMEAREA.appendChild(obs.element);
                gameState.enemies.push(obs);
            } else if (rand < 0.05) {
                const obs = new Enemy("normal");
                const playerEl = document.getElementById("player");
                if (!gameState.detectCollision(playerEl, obs.element)) {
                    gameState.GAMEAREA.appendChild(obs.element);
                    gameState.enemies.push(obs);
                }
            }

            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    endGame() {
        gameState.gameOver = true;
        clearInterval(this.autoShootTimer);
        alert(`Game Over! Your final score is: ${gameState.score}`);
        window.location.reload();
    }
}
