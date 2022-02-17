
import { Wordle } from "./wordle/Wordle";

const curWordle = new Wordle();

curWordle.display(document.getElementById("main-board")!);
