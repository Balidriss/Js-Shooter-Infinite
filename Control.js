import {GAMEENV} from "./GAMEENV.js";

export class Control {
    getTargetPosition(currentX, gameAreaWidth, elementWidth) {
        return new Error("to implement");
    }
}

export class KeyboardControl extends Control {
    constructor() {
        super();
        this.direction = 0;
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.addEventListener('keyup', (e) => this.handleKeyup(e));
    }

    handleKeydown(event) {
        if (event.key === 'ArrowLeft') this.direction = -1;
        if (event.key === 'ArrowRight') this.direction = 1;
    }

    handleKeyup(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') this.direction = 0;
    }

    getTargetPosition(currentX, elementWidth) {
        const step = 10;
        return Math.max(0, Math.min(GAMEENV.GAMEAREA.clientWidth - elementWidth, currentX + this.direction * step));
    }
}

export class TouchControl extends Control {
    constructor() {
        super();
        this.targetX = 0;
        GAMEENV.GAMEAREA.addEventListener('touchstart', (e) => this.updateTouchPosition(e));
        GAMEENV.GAMEAREA.addEventListener('touchmove', (e) => this.updateTouchPosition(e));
    }


    getTargetPosition(currentX, elementWidth) {
        return Math.max(0, Math.min(GAMEENV.GAMEAREA.clientWidth - elementWidth, this.targetX));
    }

    updateTouchPosition(event) {
        this.targetX = event.touches[0].clientX;
    }
}