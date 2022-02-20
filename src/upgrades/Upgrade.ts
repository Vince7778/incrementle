import { Currency, Wallet } from "../Wallet";

interface UpgradeOptions {
    name: string;
    id: string;
    description: string;
    cost?: Wallet;
}

export class Upgrade {
    name: string;
    id: string;
    description: string;
    cost: Wallet;

    constructor({name, id, description, cost}: UpgradeOptions) {
        this.name = name;
        this.id = id;
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
    spend(w: Wallet) {
        for (const ctype in this.cost) {
            const cur = <Currency>ctype;
            w[cur] -= this.cost[cur];
        }
    }

    // Appends to the parent
    display(parentElem: HTMLElement) {
        const div = document.createElement("div");
        div.innerHTML = `${this.name}<br>${this.description}<br>Cost: ${this.cost.points} points`;
        div.className = "upg-box";
        parentElem.appendChild(div);
    }
}