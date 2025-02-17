import { Engine } from "./engine.js";
import { Input } from "./input.js";

document.addEventListener("DOMContentLoaded", () => {
    const input = new Input();
    const engine = new Engine(input);

    engine.start();
});
