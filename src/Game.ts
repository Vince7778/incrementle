
import { Player } from "./Player";
import { Wordle } from "./wordle/Wordle";

const curPlayer = new Player();

const curWordle = new Wordle({
    parentElem: document.getElementById("main-board")!,
    finishCallback: curPlayer.endGame.bind(curPlayer)
});

document.addEventListener("keydown", e => {
    curWordle.type(e.key);
});
