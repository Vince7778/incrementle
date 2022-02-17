
import { checkGuess } from "./checkGuess";
import { getRandomAnswer, getRandomWord } from "./getRandomWord";
import { GuessColor } from "./GuessColor";

const defaultGuessCount = 6;
const defaultGuessLength = 5;

interface WordleOptions {
    guessLength?: number;
    maxGuessCount?: number;
}

export class Wordle {
    correctWord: string;
    guesses: string[];
    guessColors: GuessColor[][];

    tentativeGuess: string;

    maxGuessCount: number;
    guessLength: number;

    constructor({guessLength, maxGuessCount}: WordleOptions = {}) {
        this.correctWord = getRandomAnswer();
        this.guesses = [getRandomWord()];
        this.guessColors = [checkGuess(this.guesses[0], this.correctWord)];

        this.tentativeGuess = "abc";

        this.maxGuessCount = maxGuessCount || defaultGuessCount;
        this.guessLength = guessLength || defaultGuessLength;
    }

    display(el: HTMLElement) {
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

        el.appendChild(board);
    }
}
