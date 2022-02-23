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
        cost: new WalletInstance({ points: 24 }),
        prereqs: ["threegrays"]
    })
].sort((a, b) => a.cost.get("points") - b.cost.get("points"));
