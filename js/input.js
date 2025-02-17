export class Input {
    constructor() {
        this.keys = {};
        this.targetX = 0;
        this.direction = 0;

        window.addEventListener("keydown", (e) => {
            if (e.code === "ArrowLeft") {
                this.direction = -1;
                this.keys[e.code] = true;
            } else if (e.code === "ArrowRight") {
                this.direction = 1;
                this.keys[e.code] = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
                this.direction = 0;
                this.keys[e.code] = false;
            }
        });

        window.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.targetX = e.touches[0].clientX;
        });

        window.addEventListener("touchmove", (e) => {
            e.preventDefault();
            this.targetX = e.touches[0].clientX;
        });

        window.addEventListener("touchend", (e) => {
            this.targetX = 0;
        });
    }


    getTargetPosition(currentPosition, playerWidth, gameWidth) {

        if (this.targetX > 0) {
            return this.targetX - playerWidth / 2;
        } else if (this.direction !== 0) {
            return currentPosition + this.direction * 5;
        }
        return currentPosition;
    }
}
