
import { getRandomAnswer } from "./getRandomWord";

export class Wordle {
    correctWord: string;

    constructor() {
        this.correctWord = getRandomAnswer();
    }
}
