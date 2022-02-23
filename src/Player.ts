import { GuessColor } from "./wordle/GuessColor";
import { Wordle } from "./wordle/Wordle";
import { LeftPanel } from "./LeftPanel";
import { colorText, colorVarText } from "./colorText";
import { PlayerWallet } from "./Wallet";
import { UpgradeManager } from "./upgrades/UpgradeManager";
import { fibonacci } from "./Utils";

function calculatePoints(wordle: Wordle) {
    const guessesLeft = wordle.maxGuessCount - wordle.guesses.length;
    const fibn = fibonacci(guessesLeft+2);
    let ret = fibn;
    
    if (UpgradeManager.bought("greenmult")) {
        const numGreen = wordle.countColor(GuessColor.Green);
        ret *= numGreen/3;
    }

    return ret;
}

export interface PlayerSave {
    gamesWon: number;
    gamesPlayed: number;
}

export class Player {
    gamesWon = 0;
    gamesPlayed = 0;

    constructor() {
        PlayerWallet.addListener(this.displayCurrency.bind(this));
    }

    displayCurrency() {
        const div = document.createElement("div");
        div.className = "spaced-text";

        const spans = [
            colorText(`Wins: ${this.gamesWon}`, "white"),
            colorVarText(`Points: ${parseFloat(PlayerWallet.get("points").toFixed(2))}`, "--letter-green-light")
        ];
        div.replaceChildren(...spans);

        LeftPanel.setHeader(div);
    }

    endGame(wrd: Wordle) {
        if (!wrd.gameOutcome) return;

        this.gamesPlayed++;
        
        if (wrd.gameOutcome === "win") {
            if (this.gamesWon === 0) {
                LeftPanel.show();
                UpgradeManager.display();
            }

            this.gamesWon++;
            PlayerWallet.add("points", calculatePoints(wrd));
            
            this.displayCurrency();
        }
    }

    save() {
        return {
            gamesWon: this.gamesWon,
            gamesPlayed: this.gamesPlayed
        };
    }

    load(v: PlayerSave) {
        this.gamesWon = v.gamesWon;
        this.gamesPlayed = v.gamesPlayed;
        this.displayCurrency();
    }
}

export const curPlayer = new Player();
