import { LeftPanel } from "../LeftPanel";
import { PlayerWallet } from "../Wallet";
import { upgradeList } from "./upgradeList";

let upgrades: string[] = []; // ids of all bought ugprades

function getUpgrade(id: string) {
    return upgradeList.find(u => u.id === id);
}

export const UpgradeManager = {
    bought: (str: string) => {
        return upgrades.indexOf(str) >= 0;
    },
    display: () => {
        const upgradeDiv = document.createElement("div");
        upgradeDiv.innerHTML = "<h3>Upgrades</h3>";
        upgradeDiv.className = "upg-container";
        upgradeList.forEach(u => {
            if (UpgradeManager.bought(u.id)) return;
            u.display(upgradeDiv);
        });
        LeftPanel.setBody("upgrades", upgradeDiv);
    },
    buy: (id: string) => {
        if (UpgradeManager.bought(id)) return;
        const upg = getUpgrade(id);
        if (!upg) return;
        if (!upg.canBuy(PlayerWallet)) return;
        upg.spend(PlayerWallet);
        upgrades.push(id);
        UpgradeManager.display();
    }
}

PlayerWallet.addListener(e => {
    UpgradeManager.display();
})
