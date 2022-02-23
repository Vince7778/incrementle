
import { curPlayer } from "./Player";
import { Wordle } from "./wordle/Wordle";

const curWordle = new Wordle({
    parentElem: document.getElementById("main-board")!,
    finishCallback: curPlayer.endGame.bind(curPlayer)
});

document.addEventListener("keydown", e => {
    curWordle.type(e.key);
});
