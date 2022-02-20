
import { checkGuess } from "./checkGuess";
import { getRandomAnswer, getRandomWord, isValidWord } from "./wordFuncs";
import { GuessColor } from "./GuessColor";
import { Keyboard } from "./Keyboard";

const defaultGuessCount = 4;
const defaultGuessLength = 5;

const isLetter = (s: string) => /^[a-zA-Z]$/.test(s);

interface WordleOptions {
    parentElem?: HTMLElement;
    guessLength?: number;
    maxGuessCount?: number;
    finishCallback?: (wrd: Wordle) => void;
}

type GameOutcome = null | "win" | "loss";

export class Wordle {
    parentElem?: HTMLElement;
    statusBar = document.createElement("p");
    keyboard: Keyboard;

    correctWord = ""; // will get set when constructed
    guesses: string[] = [];
    guessColors: GuessColor[][] = [];
    gameOutcome: GameOutcome = null;

    tentativeGuess: string = "";

    maxGuessCount: number;
    guessLength: number;

    finishCallback?: (wrd: Wordle) => void;

    constructor({parentElem, guessLength, maxGuessCount, finishCallback}: WordleOptions = {}) {
        this.maxGuessCount = maxGuessCount || defaultGuessCount;
        this.guessLength = guessLength || defaultGuessLength;
        this.parentElem = parentElem;
        this.finishCallback = finishCallback;
        this.statusBar.className = "board-status";
        this.keyboard = new Keyboard(this);
        this.resetGame();
    }

    resetGame() {
        this.correctWord = getRandomAnswer();
        console.log(this.correctWord);
        this.guesses = [];
        this.guessColors = [];
        this.gameOutcome = null;

        this.tentativeGuess = "";

        this.setStatus("");
        this.keyboard.reset();
        this.display();
    }

    display() {
        if (!this.parentElem) return;
        const board = document.createElement("div");
        board.className = "board";

        for (let i = 0; i < this.maxGuessCount; i++) {
            const row = document.createElement("div");
            row.className = "board-row";

            if (i < this.guesses.length) {
                const curGuess = this.guesses[i];

                for (let j = 0; j < this.guessLength; j++) {
                    const letter = document.createElement("div");
                    letter.innerText = curGuess[j];
                    letter.className = `board-letter letter-${this.guessColors[i][j]}`;

                    row.appendChild(letter);
                }
            } else if (i === this.guesses.length && this.tentativeGuess.length > 0) {
                for (let j = 0; j < this.guessLength; j++) {
                    const letter = document.createElement("div");

                    if (j < this.tentativeGuess.length) {
                        letter.innerText = this.tentativeGuess[j];
                        letter.className = `board-letter letter-${GuessColor.Blank}`;
                    } else {
                        letter.className = `board-letter letter-${GuessColor.Empty}`
                    }

                    row.appendChild(letter);
                }
            } else {
                // not yet guessed
                for (let j = 0; j < this.guessLength; j++) {
                    const letter = document.createElement("div");
                    letter.className = `board-letter letter-${GuessColor.Empty}`;
                    row.appendChild(letter);
                }
            }

            board.appendChild(row);
        }

        board.appendChild(this.statusBar);

        const kbDisplay = document.createElement("div");
        kbDisplay.className = "kb-container"
        this.keyboard.display(kbDisplay);
        board.appendChild(kbDisplay);

        this.parentElem.replaceChildren(board);
    }

    setStatus(str: string) {
        if (!str) {
            this.statusBar.style.display = "none";
        } else {
            this.statusBar.style.display = "block";
        }
        this.statusBar.innerText = str;
    }

    checkEndGame() {
        if (this.tentativeGuess === this.correctWord) {
            this.gameOutcome = "win";
            this.setStatus("You won!");
            if (this.finishCallback) this.finishCallback(this);
        } else if (this.guesses.length === this.maxGuessCount) {
            this.gameOutcome = "loss";
            this.setStatus(`You lost! Answer: ${this.correctWord}`);
            if (this.finishCallback) this.finishCallback(this);
        }
    }

    submitWord() {
        if (this.gameOutcome) {
            this.resetGame();
        }

        if (this.tentativeGuess.length < this.guessLength) return;
        if (!isValidWord(this.tentativeGuess)) {
            this.setStatus("Invalid word");
            return;
        }
        this.guesses.push(this.tentativeGuess);

        const newColors = checkGuess(this.tentativeGuess, this.correctWord);
        this.guessColors.push(newColors);
        for (let i = 0; i < this.tentativeGuess.length; i++) {
            this.keyboard.setKey(this.tentativeGuess[i], newColors[i]);
        }

        this.checkEndGame();

        this.tentativeGuess = "";

        this.display();
    }

    type(key: string) {
        if (this.gameOutcome && key !== "Enter") return;

        switch(key) {
            case "Enter":
                this.submitWord();
                break;
            case "Backspace":
                if (this.tentativeGuess.length > 0) {
                    this.tentativeGuess = this.tentativeGuess.slice(0, -1);
                    this.setStatus(""); // remove 'Invalid word' message
                    this.display();
                }
                break;
            default:
                if (isLetter(key) && this.tentativeGuess.length < this.guessLength) {
                    this.tentativeGuess += key.toLowerCase();
                    this.display();
                }
                break;
        }
    }

    // Returns the number of letters that are colored color
    countColor(color: GuessColor) {
        return this.guessColors.reduce((v: number, cur: GuessColor[]) => {
            return v+cur.filter(c => c === color).length;
        }, 0);
    }
}
