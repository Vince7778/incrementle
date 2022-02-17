import { wordList, answerList } from "./wordList";

export function getRandomWord() {
    // Needs to choose between the lists randomly, so they need to be weighted correctly.
    const wordListProportion = wordList.length / (wordList.length + answerList.length);
    const randomVal = Math.random();

    if (randomVal < wordListProportion) {
        const index = Math.floor(Math.random()*wordList.length);
        return wordList[index];
    } else {
        return getRandomAnswer();
    }
}

export function getRandomAnswer() {
    const index = Math.floor(Math.random()*answerList.length);
    return answerList[index];
}

export function isValidWord(w: string) {
    return answerList.indexOf(w) >= 0 || wordList.indexOf(w) >= 0;
}
