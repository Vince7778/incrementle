
import { GuessColor } from "./GuessColor";

// Doesn't check if guess is a valid word
export function checkGuess(guess: string, target: string) {
    let output: GuessColor[] = [];
    for (let i = 0; i < guess.length; i++) output.push(GuessColor.Gray);

    // In case the words have different lengths
    const limitLength = Math.min(guess.length, target.length);

    // Assign greens
    for (let i = 0; i < limitLength; i++) {
        if (guess[i] === target[i]) output[i] = GuessColor.Green;
    }

    // Assign yellows
    // Loop through every ascii printable character and count the number of appearances
    for (let c = 32; c < 127; c++) {
        const curChar = String.fromCharCode(c);
        let charCount = 0;

        for (let i = 0; i < target.length; i++) {
            if (target[i] === curChar) {
                // don't count already green characters
                if (i < guess.length && output[i] === GuessColor.Green) continue;
                charCount++;
            }
        }

        for (let i = 0; charCount > 0 && i < guess.length; i++) {
            if (output[i] === GuessColor.Green) continue;
            if (guess[i] === curChar) {
                output[i] = GuessColor.Yellow;
                charCount--;
            }
        }
    }

    return output;
}
