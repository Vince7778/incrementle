import { UpgradeManager } from "./upgrades/UpgradeManager";
import { fibonacci } from "./Utils";
import { GuessColor } from "./wordle/GuessColor";
import { Wordle } from "./wordle/Wordle";

export function calculatePoints(wordle: Wordle) {
    const guessesLeft = wordle.maxGuessCount - wordle.guesses.length;
    const fibn = fibonacci(guessesLeft+2);
    let ret = fibn;
    
    if (UpgradeManager.bought("greenmult")) {
        const numGreen = wordle.countColor(GuessColor.Green);
        ret *= numGreen/3;
    }

    return ret;
}

export function calculatePointsIfDone(wordle: Wordle) {
    const guessesLeft = wordle.maxGuessCount - wordle.guesses.length - 1;
    const fibn = fibonacci(guessesLeft+2);
    let ret = fibn;
    
    if (UpgradeManager.bought("greenmult")) {
        const numGreen = wordle.countColor(GuessColor.Green) + wordle.guessLength;
        ret *= numGreen/3;
    }

    return ret;
}
