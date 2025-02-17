import { gameState } from "../gameState.js";
import { Laser } from "./laser.js";

export class Enemy {
    constructor(type = "normal") {
        this.type = type;
        this.element = document.createElement("div");
        this.element.classList.add("enemy");
        this.element.dataset.type = type;

        this.element.style.left = `${Math.random() * (gameState.GAMEWIDTH * 0.9)}px`;
        this.element.style.top = "-50px";

        if (type === "fast") {
            this.speed = 4;
            this.element.classList.add("fast");
        } else {
            this.speed = 2;
        }

        if (type === "shooter") {
            this.speed = 2;
            this.element.classList.add("shooter");
            this.shootTimer = gameState.FIRST_SHOT_TIMER + Math.random() * 1000;
            this.shootInterval = gameState.SHOT_INTERVAL;
        }
    }

    update(deltaTime) {
        let top = parseInt(this.element.style.top);
        top += this.speed;
        this.element.style.top = `${top}px`;

        if (this.type === "shooter") {
            this.shootTimer -= deltaTime;
            if (this.shootTimer <= 0) {
                this.shoot();
                this.shootTimer = this.shootInterval;
            }
        }
    }

    shoot() {
        const laser = new Laser(this, "enemy");
        gameState.GAMEAREA.appendChild(laser.element);
        gameState.lasers.push(laser);
    }

    render() {
        // todo
    }

    executeSpecial()
    {
        //todo
    }

    isOutOfBounds() {
        return parseInt(this.element.style.top) > gameState.GAMEHEIGHT;
    }

    onDeath()
    {
        //todo
    }

}
