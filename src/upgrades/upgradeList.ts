import { Wallet } from "../Wallet";
import { Upgrade } from "./Upgrade";

export const upgradeList = [
    new Upgrade({
        name: "Another Guess",
        id: "anotherguess",
        description: "You get one more guess. This scales point gain too.",
        cost: new Wallet({ points: 3 })
    })
];
