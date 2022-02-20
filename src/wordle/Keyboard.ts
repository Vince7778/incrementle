import { GuessColor } from "./GuessColor";
import { Wordle } from "./Wordle";

const alphaSize = 26;
const asciiA = 97;

const layout = [
    "qwertyuiop",
    " asdfghjkl ",
    "<zxcvbnm>"
];

const toNumber = (s: string) => s.toLowerCase().charCodeAt(0) - asciiA;
const toLetter = (n: number) => String.fromCharCode(n + asciiA);

export class Keyboard {
    colors: GuessColor[] = [];
    wordle: Wordle;

    constructor(wordle: Wordle) {
        this.wordle = wordle;
        this.reset();
    }

    setKey(letter: string, color: GuessColor) {
        if (letter.length !== 1) return;

        const val = toNumber(letter);
        this.colors[val] = color;
    }

    reset() {
        this.colors = [];
        for (let i = 0; i < alphaSize; i++) this.colors.push(GuessColor.Blank);
    }

    display(parentElem: HTMLElement) {
        parentElem.textContent = ""; // remove all children

        for (let r = 0; r < layout.length; r++) {
            const divRow = document.createElement("div");
            divRow.className = "kb-row";

            for (let c = 0; c < layout[r].length; c++) {

                const letter = layout[r][c];
                if (letter === " ") {
                    const elem = document.createElement("div");
                    elem.className = `kb-letter kb-spacer`;
                    divRow.appendChild(elem);
                } else {
                    const elem = document.createElement("button");
                    
                    if (letter === "<") { // backspace
                        elem.innerText = "Back";
                        elem.className = `kb-letter letter-${GuessColor.Blank}`;
                        elem.addEventListener("click", this.wordle.type.bind(this.wordle, "Backspace"));
                    } else if (letter === ">") { // enter
                        elem.innerText = "Enter";
                        elem.className = `kb-letter letter-${GuessColor.Blank}`;
                        elem.addEventListener("click", this.wordle.type.bind(this.wordle, "Enter"));
                    } else {
                        const val = toNumber(letter);
                        const color = this.colors[val];
        
                        elem.innerText = letter.toUpperCase();
                        elem.className = `kb-letter letter-${color}`;
                        elem.addEventListener("click", this.wordle.type.bind(this.wordle, letter));
                    }
                    
                    divRow.appendChild(elem);
                }

            }

            parentElem.appendChild(divRow);
        }
    }
}