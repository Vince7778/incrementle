import { Currency, PlayerWallet, WalletInstance } from "../Wallet";
import { UpgradeManager } from "./UpgradeManager";

interface UpgradeOptions {
    name: string;
    id: string;
    description: string;
    cost?: WalletInstance;
}

export class Upgrade {
    name: string;
    id: string;
    description: string;
    cost: WalletInstance;

    constructor({name, id, description, cost}: UpgradeOptions) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.cost = cost || new WalletInstance();
    }

    canBuy(w: WalletInstance) {
        for (const ctype in this.cost) {
            const cur = <Currency>ctype;
            if (w.get(cur) < this.cost.get(cur)) return false;
        }
        return true;
    }

    spend(w: WalletInstance) {
        if (!this.canBuy(w)) return;
        for (const ctype in this.cost) {
            const cur = <Currency>ctype;
            w.add(cur, -this.cost.get(cur));
        }
    }

    // Appends to the parent
    display(parentElem: HTMLElement) {
        const div = document.createElement("div");
        div.innerHTML = `${this.name}<br>${this.description}<br>Cost: ${this.cost.get("points")} points`;
        div.className = "upg-box";

        if (this.canBuy(PlayerWallet)) {
            div.className += " upg-buyable";
            div.addEventListener("click", () => UpgradeManager.buy(this.id));
        } else {
            div.className += " upg-unbuyable";
        }

        parentElem.appendChild(div);
    }
}
