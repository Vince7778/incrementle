
import { checkGuess } from "./checkGuess";
import { getRandomAnswer, getRandomWord, isValidWord } from "./wordFuncs";
import { GuessColor } from "./GuessColor";

const defaultGuessCount = 6;
const defaultGuessLength = 5;

const isLetter = (s: string) => /[a-zA-Z]/.test(s);

interface WordleOptions {
    parentElem?: HTMLElement;
    guessLength?: number;
    maxGuessCount?: number;
}

export class Wordle {
    parentElem?: HTMLElement;

    correctWord: string;
    guesses: string[];
    guessColors: GuessColor[][];

    tentativeGuess: string;

    maxGuessCount: number;
    guessLength: number;

    constructor({parentElem, guessLength, maxGuessCount}: WordleOptions = {}) {
        this.correctWord = getRandomAnswer();
        this.guesses = [];
        this.guessColors = [];

        this.tentativeGuess = "";

        this.maxGuessCount = maxGuessCount || defaultGuessCount;
        this.guessLength = guessLength || defaultGuessLength;

        this.parentElem = parentElem;
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

        this.parentElem.replaceChildren(board);
    }

    submitWord() {
        if (this.tentativeGuess.length < this.guessLength) return;
        if (!isValidWord(this.tentativeGuess)) return;
        this.guesses.push(this.tentativeGuess);
        this.guessColors.push(checkGuess(this.tentativeGuess, this.correctWord));
        this.tentativeGuess = "";
        this.display();
    }

    type(key: string) {
        if (this.guesses.length >= this.maxGuessCount) return;

        switch(key) {
            case "Enter":
                this.submitWord();
                break;
            case "Backspace":
                if (this.tentativeGuess.length > 0) {
                    this.tentativeGuess = this.tentativeGuess.slice(0, -1);
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
}
