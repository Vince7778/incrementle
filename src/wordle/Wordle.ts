
import { checkGuess } from "./checkGuess";
import { getRandomAnswer, getRandomWord, hasDoubleLetter, isValidWord } from "./wordFuncs";
import { GuessColor } from "./GuessColor";
import { Keyboard } from "./Keyboard";
import { UpgradeManager } from "../upgrades/UpgradeManager";
import { fmat, iota, shuffle } from "../Utils";
import { Upgrade } from "../upgrades/Upgrade";
import { curPlayer } from "../Player";
import { calculatePoints, calculatePointsIfDone } from "../calculatePoints";
import { LeftPanel } from "../LeftPanel";

const defaultGuessCount = 4;
const defaultGuessLength = 5;

const DISPLAY_INTERVAL = 100;

const ASCII_A = 97;

function getGuessCount() {
    let ret = defaultGuessCount;

    if (UpgradeManager.bought("anotherguess")) ret++;
    if (UpgradeManager.bought("anotherguess2")) ret++;
    if (UpgradeManager.bought("anotherguess3")) ret++;

    return ret;
}

function getLetterHintCount() {
    let ret = 0;

    if (UpgradeManager.bought("letterhint")) ret++;
    
    return ret;
}

function getGrayHintCount() {
    let ret = 0;

    if (UpgradeManager.bought("threegrays")) ret += 3;
    if (UpgradeManager.bought("threegrays2")) ret += 3;

    return ret;
}

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
    gameInfo = document.createElement("div");
    keyboard: Keyboard;

    correctWord = ""; // will get set when constructed
    guesses: string[] = [];
    guessColors: GuessColor[][] = [];
    gameOutcome: GameOutcome = null;

    tentativeGuess: string = "";

    maxGuessCount: number;
    guessLength: number;

    finishCallback?: (wrd: Wordle) => void;

    startTime: Date | null = null;
    endTime: Date | null = null;

    constructor({parentElem, guessLength, maxGuessCount, finishCallback}: WordleOptions = {}) {
        this.maxGuessCount = maxGuessCount || getGuessCount();
        this.guessLength = guessLength || defaultGuessLength;
        this.parentElem = parentElem;
        this.finishCallback = finishCallback;
        this.statusBar.className = "board-status";
        this.keyboard = new Keyboard(this);
        this.resetGame();
    }

    resetGame() {
        this.maxGuessCount = getGuessCount();
        
        this.correctWord = getRandomAnswer();
        if (window.location.href !== "https://vince7778.github.io/incrementle/") {
            console.log(this.correctWord); // debug print :)
        }

        this.guesses = [];
        this.guessColors = [];
        this.gameOutcome = null;

        this.tentativeGuess = "";

        this.startTime = null;
        this.endTime = null;

        this.setStatus("");

        this.keyboard.reset();
        this.addLetterHints();
        this.addGrayHints();

        this.display();
        setInterval(this.showGameInfo.bind(this), DISPLAY_INTERVAL);
    }

    display() {
        if (!this.parentElem) return;
        const board = document.createElement("div");
        board.className = "board";

        this.showGameInfo();
        board.appendChild(this.gameInfo);

        for (let i = 0; i < this.maxGuessCount; i++) {
            const row = document.createElement("div");
            row.className = "board-row";
            if (this.shouldIgnoreWord(i)) row.className += " board-ignoreword";

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

    showGameInfo() {
        if (!LeftPanel.shown) return;
        this.gameInfo.innerHTML = "";
        if (this.gameOutcome === "win") {
            this.gameInfo.innerHTML = `+${calculatePoints(this).toFixed(2)} points`;
        } else if (!this.gameOutcome) {
            this.gameInfo.innerHTML = `+${calculatePointsIfDone(this).toFixed(2)} points if win`;
        }
        if (UpgradeManager.bought("doublewarn")) {
            if (hasDoubleLetter(this.correctWord)) {
                this.gameInfo.innerHTML += "<br>Contains double letter";
            } else {
                this.gameInfo.innerHTML += "<br>No double letters";
            }
        }
        if (UpgradeManager.bought("timebonus")) {
            if (this.startTime === null) {
                this.gameInfo.innerHTML += `<br>Time elapsed: 0s`;
            } else if (this.endTime !== null) {
                const timeElapsed = this.endTime.getTime() - this.startTime.getTime();
                this.gameInfo.innerHTML += `<br>Time elapsed: ${(timeElapsed/1000).toFixed(2)}s`;
            } else {
                const timeElapsed = new Date().getTime() - this.startTime.getTime();
                this.gameInfo.innerHTML += `<br>Time elapsed: ${(timeElapsed/1000).toFixed(2)}s`;
            }
        }
    }

    checkEndGame() {
        if (this.tentativeGuess === this.correctWord) {
            this.gameOutcome = "win";
            this.setStatus("You won!");
            if (this.finishCallback) this.finishCallback(this);
            this.endTime = new Date();
        } else if (this.guesses.length === this.maxGuessCount) {
            this.gameOutcome = "loss";
            this.setStatus(`You lost! Answer: ${this.correctWord}`);
            if (this.finishCallback) this.finishCallback(this);
            this.endTime = new Date();
        }
    }

    submitWord() {
        if (this.gameOutcome) {
            this.resetGame();
        }

        if (this.tentativeGuess.length < this.guessLength) return;
        if (!isValidWord(this.tentativeGuess) && !this.shouldIgnoreWord()) {
            this.setStatus("Invalid word");
            return;
        }

        this.guesses.push(this.tentativeGuess);
        if (this.guesses.length === 1) {
            this.startTime = new Date();
        }

        const newColors = checkGuess(this.tentativeGuess, this.correctWord);
        this.guessColors.push(newColors);
        for (let i = 0; i < this.tentativeGuess.length; i++) {
            // FIXME: duplicate letters set to the wrong color
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

    // FIXME: This does not take into account duplicate letters correctly.
    addLetterHints() {
        const num = getLetterHintCount();
        let arr = iota(this.guessLength);
        shuffle(arr);
        for (let i = 0; i < num && i < this.guessLength; i++) {
            const hintLetter = this.correctWord[arr[i]];
            this.keyboard.setKey(hintLetter, GuessColor.Yellow);
        }
    }

    addGrayHints() {
        let num = getGrayHintCount();
        let arr = iota(26); // alphabet size
        shuffle(arr);
        for (let i = 0; i < num && i < 26; i++) {
            const curLetter = String.fromCharCode(arr[i]+ASCII_A);
            if (this.correctWord.indexOf(curLetter) >= 0) {
                num++; // skip letter
                continue;
            }
            this.keyboard.setKey(curLetter, GuessColor.Gray);
        }
    }

    shouldIgnoreWord(ind=this.guesses.length) {
        if (ind === this.maxGuessCount-2 && UpgradeManager.bought("ignoreword")) return true;
        if (ind === 0 && UpgradeManager.bought("ignorefirst")) return true;
        return false;
    }
}

export const curWordle = new Wordle({
    parentElem: document.getElementById("main-board")!,
    finishCallback: curPlayer.endGame.bind(curPlayer)
});

document.addEventListener("keydown", e => {
    curWordle.type(e.key);
});
