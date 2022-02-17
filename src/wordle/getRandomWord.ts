import { answerList } from "./wordList";

export function getRandomAnswer() {
    const index = Math.floor(Math.random()*answerList.length);
    return answerList[index];
}
