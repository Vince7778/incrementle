import { LeftPanel } from "../LeftPanel";
import { upgradeList } from "./upgradeList";

let upgrades: string[] = []; // ids of all bought ugprades

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
    }
}
