export const gameState = {
    GAMEAREA: document.getElementById("gameArea"),
    SCORE: document.getElementById("score"),
    GAMEWIDTH: document.getElementById("gameArea").clientWidth,
    GAMEHEIGHT: document.getElementById("gameArea").clientHeight,
    PLAYERWIDTH: document.getElementById("player").offsetWidth,
    lasers: [],
    enemies: [],
    gameOver: false,
    score: 0,
    PLAYER_FIRERATE: 500,
    FIRST_SHOT_TIMER: 1000,
    SHOT_INTERVAL: 2000,

    updateScore() {
        this.SCORE.innerHTML = `Score: ${this.score}`;
    },

    detectCollision(el1, el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }
};

gameState.playerPosition = gameState.GAMEWIDTH / 2;
