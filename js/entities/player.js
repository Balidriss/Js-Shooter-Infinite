import { gameState } from "../gameState.js";

export class Player {
    constructor() {
        this.element = document.getElementById("player");
        this.speed = 5;
    }

    update(deltaTime, input) {
        let currentPosition = gameState.playerPosition;
        let target = input.getTargetPosition(currentPosition, gameState.PLAYERWIDTH, gameState.GAMEWIDTH);

        target = Math.max(0, Math.min(gameState.GAMEWIDTH - gameState.PLAYERWIDTH, target));

        gameState.playerPosition = target;
        this.element.style.left = `${target}px`;
    }

    render() {
        // todo
    }

    specialShoot() {
        // todo
    }
}
