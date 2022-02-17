
import { Wordle } from "./wordle/Wordle";

const curWordle = new Wordle({
    parentElem: document.getElementById("main-board")!
});

document.addEventListener("keydown", e => {
    curWordle.type(e.key);
});
