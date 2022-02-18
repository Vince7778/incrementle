import { GuessColor } from "./wordle/GuessColor";
import { Wordle } from "./wordle/Wordle";
import { LeftPanel } from "./LeftPanel";
import { colorText, colorVarText } from "./colorText";

export class Player {
    gamesWon: number = 0;
    gamesPlayed: number = 0;
    currency = {
        green: 0,
        yellow: 0,
        gray: 0
    }

    constructor() {}

    displayCurrency() {
        const div = document.createElement("div");
        div.className = "spaced-text";

        const spans = [
            colorText(`Wins: ${this.gamesWon}`, "white"),
            colorVarText(`Green: ${this.currency.green}`, "--letter-green-light"),
            colorVarText(`Yellow: ${this.currency.yellow}`, "--letter-yellow-light"),
            colorVarText(`Gray: ${this.currency.gray}`, "--letter-gray-light")
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
            this.currency.green += wrd.countColor(GuessColor.Green);
            this.currency.yellow += wrd.countColor(GuessColor.Yellow);
            this.currency.gray += wrd.countColor(GuessColor.Gray);
            
            this.displayCurrency();
        }

        console.log(this);
    }
}
