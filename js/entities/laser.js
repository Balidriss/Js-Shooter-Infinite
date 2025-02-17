import { gameState } from "../gameState.js";

export class Laser {
    constructor(sourceEntity, source = "player") {
        this.source = source;
        this.element = document.createElement("div");
        this.element.classList.add("laser");
        if (source === "enemy") {
            this.element.classList.add("enemy");
        }

        if (source === "player") {

            const playerEl = document.getElementById("player");
            const playerLeft = gameState.playerPosition;
            const playerWidth = gameState.PLAYERWIDTH;

            this.element.style.left = `${playerLeft + (playerWidth / 2) - 2}px`;

            this.element.style.top = `${playerEl.offsetTop - 10}px`;

        } else {
            const srcRect = sourceEntity.element.getBoundingClientRect();
            this.element.style.left = `${parseInt(sourceEntity.element.style.left) + sourceEntity.element.clientWidth / 2 - 2}px`;
            this.element.style.top = `${parseInt(sourceEntity.element.style.top) + sourceEntity.element.clientHeight}px`;
        }
    }

    update() {
        let top = parseInt(this.element.style.top);
        if (this.source === "enemy") {
            top += 5;
            this.element.style.top = `${top}px`;
            if (top > gameState.GAMEHEIGHT) return false;
            const playerEl = document.getElementById("player");
            if (gameState.detectCollision(this.element, playerEl)) {
                return "hitPlayer";
            }
        } else {
            top -= 20;
            this.element.style.top = `${top}px`;
            if (top < 0) return false;

            for (let obs of gameState.enemies) {
                if (gameState.detectCollision(this.element, obs.element)) {
                    obs.element.remove();
                    gameState.enemies = gameState.enemies.filter(o => o !== obs);
                    return "hitenemy";
                }
            }
        }
        return true; 
    }

    render() {
       //todo
    }
}
