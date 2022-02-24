import { WalletInstance } from "../Wallet";
import { Upgrade } from "./Upgrade";

// List of upgrades (sorted by point cost ascending)
export const upgradeList = [
    new Upgrade({
        name: "Another Guess",
        id: "anotherguess",
        description: "You get one more guess. This scales point gain too.",
        cost: new WalletInstance({ points: 2 })
    }),
    new Upgrade({
        name: "Letter Hint",
        id: "letterhint",
        description: "A single letter is hinted in yellow on the keyboard.",
        cost: new WalletInstance({ points: 5 }),
        prereqs: ["anotherguess"]
    }),
    new Upgrade({
        name: "Another Another Guess",
        id: "anotherguess2",
        description: "Another additional guess. Back to normal Wordle!",
        cost: new WalletInstance({ points: 8 }),
        prereqs: ["anotherguess"]
    }),
    new Upgrade({
        name: "Three Grays",
        id: "threegrays",
        description: "Grays out three random letters that aren't in the word.",
        cost: new WalletInstance({ points: 10 }),
        prereqs: ["letterhint"]
    }),
    new Upgrade({
        name: "Green Multiplier",
        id: "greenmult",
        description: "Point gain is multiplied by (# green letters)/3.",
        cost: new WalletInstance({ points: 12 }),
        prereqs: ["threegrays"]
    }),
    new Upgrade({
        name: "Three More Grays",
        id: "threegrays2",
        description: "Grays out three more letters.",
        cost: new WalletInstance({ points: 20 }),
        prereqs: ["threegrays"]
    }),
    new Upgrade({
        name: "Similar Word Killer",
        id: "ignoreword",
        description: "The second to last guess can be anything, not just English words.",
        cost: new WalletInstance({ points: 20 }),
        prereqs: ["threegrays"]
    }),
    new Upgrade({
        name: "Yet Another Guess",
        id: "anotherguess3",
        description: "I wonder what this does?",
        cost: new WalletInstance({ points: 20 }),
        prereqs: ["threegrays2", "ignoreword"]
    }),
    new Upgrade({
        name: "Double Letter Warner",
        id: "doublewarn",
        description: "Warns you if there are two (or more) of the same letter in the word.",
        cost: new WalletInstance({ points: 30 }),
        prereqs: ["threegrays2"]
    }),
    new Upgrade({
        name: "First Word Allower",
        id: "ignorefirst",
        description: "The first guess can be anything, not just English words.",
        cost: new WalletInstance({ points: 40 }),
        prereqs: ["ignoreword"]
    })
].sort((a, b) => a.cost.get("points") - b.cost.get("points"));
