import { GuessColor } from "./wordle/GuessColor";
import { Wordle } from "./wordle/Wordle";
import { LeftPanel } from "./LeftPanel";
import { colorText, colorVarText } from "./colorText";

const pointValues = [0, 13, 8, 5, 3, 2, 1]; // based off fibonacci sequence

export class Player {
    gamesWon: number = 0;
    gamesPlayed: number = 0;
    currency = {
        points: 0
    }

    constructor() {}

    displayCurrency() {
        const div = document.createElement("div");
        div.className = "spaced-text";

        const spans = [
            colorText(`Wins: ${this.gamesWon}`, "white"),
            colorVarText(`Points: ${this.currency.points}`, "--letter-green-light")
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
            }

            this.gamesWon++;
            this.currency.points += pointValues[wrd.guesses.length];
            
            this.displayCurrency();
        }

        console.log(this);
    }
}
