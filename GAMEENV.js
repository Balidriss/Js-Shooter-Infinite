import { KeyboardControl, TouchControl } from "./Control.js";

export class GAMEENV {
    // HTML elements (initially null)
    static GAMEAREA = null;
    static PLAYER = null;
    static SCORE = null;

    // Game constants and state
    static GAMEWIDTH = null;
    static GAMEHEIGHT = null;
    static PLAYERWIDTH = null;
    static PLAYERHEIGHT = null;

    static PLAYER_FIRERATE = 500;

    // Obstacles shot param
    static FIRST_SHOT_TIMER =  1000;
    static SHOT_INTERVAL = 2000;

    // Player position and movement
    static playerPosition = null;

    // Game state variables
    static score = 0;
    static gameOver = false;
    static obstacles = [];
    static lasers = [];

    // Shooting and intervals
    static autoShootInterval = null;


    // Initialize controls (moved to the setup method)
    static keyboardControl = null;
    static touchControl = null;

    // Initialize the game environment
    static initialize() {
        this.GAMEAREA = document.getElementById('gameArea');
        this.PLAYER = document.getElementById('player');
        this.SCORE = document.getElementById('score');

        // Game constants
        this.GAMEWIDTH = this.GAMEAREA.clientWidth;
        this.GAMEHEIGHT = this.GAMEAREA.clientHeight;
        this.PLAYERWIDTH = this.PLAYER.clientWidth;
        this.PLAYERHEIGHT = this.PLAYER.clientHeight;

        // Player position and movement
        this.playerPosition = this.GAMEWIDTH / 2 - this.PLAYERWIDTH / 2;

        // Initialize controls
        this.keyboardControl = new KeyboardControl();
        this.touchControl = new TouchControl();
    }

    // Update score on the display
    static updateScore() {
        this.SCORE.innerHTML = `Score: ${this.score}`;
    }

    // Helper to detect collision
    static detectCollision(col1, col2) {
        const col1Rect = col1.getBoundingClientRect();
        const col2Rect = col2.getBoundingClientRect();

        return !(
            col1Rect.top >= col2Rect.bottom || // No overlap from top
            col1Rect.bottom <= col2Rect.top || // No overlap from bottom
            col1Rect.right <= col2Rect.left || // No overlap from right
            col1Rect.left >= col2Rect.right    // No overlap from left
        );
    }
}
