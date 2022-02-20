import { Currency, Wallet } from "./Wallet";

interface UpgradeOptions {
    name: string;
    description: string;
    cost?: Wallet;
}

export class Upgrade {
    name: string;
    description: string;
    cost: Wallet;

    constructor({name, description, cost}: UpgradeOptions) {
        this.name = name;
        this.description = description;
        this.cost = cost || new Wallet();
    }

    canBuy(w: Wallet) {
        for (const ctype in this.cost) {
            const cur = <Currency>ctype;
            if (w[cur] < this.cost[cur]) return false;
        }
        return true;
    }

    // Doesn't check if it can be purchased.
    buy(w: Wallet) {
        for (const ctype in this.cost) {
            const cur = <Currency>ctype;
            w[cur] -= this.cost[cur];
        }
    }
}