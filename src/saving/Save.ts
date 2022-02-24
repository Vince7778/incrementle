import { LeftPanel } from "../LeftPanel";
import { curPlayer, PlayerSave } from "../Player"
import { UpgradeManager } from "../upgrades/UpgradeManager"
import { Currency, PlayerWallet } from "../Wallet"
import { curWordle } from "../wordle/Wordle";

const AUTOSAVE_INTERVAL = 15000; // 15 seconds
const STATUS_TIME = 1500; // time status is displayed
let displayed = false; // need to know if div has been created
let status = "";
let statusClearTimeout: number;

interface SaveType {
    player: PlayerSave;
    wallet: {[cur in Currency]: number};
    upgrades: string[];
}

export const Save = {
    save(isAutosave=false) {
        const ret = {
            player: curPlayer.save(),
            wallet: PlayerWallet.save(),
            upgrades: UpgradeManager.save(),
            // TODO: add wordle saving
        }
        localStorage.setItem("save", JSON.stringify(ret));

        if (!isAutosave) {
            Save.setStatus("Saved");
            if (statusClearTimeout) clearTimeout(statusClearTimeout);
            statusClearTimeout = setTimeout(() => Save.setStatus(""), STATUS_TIME);
        }
    },
    load() {
        const val = localStorage.getItem("save");
        if (!val) return;
        const casted = JSON.parse(val) as SaveType;
        if (!casted) return;

        PlayerWallet.load(casted.wallet); // load wallet before player
        curPlayer.load(casted.player);
        UpgradeManager.load(casted.upgrades);

        curWordle.resetGame();

        Save.setStatus("Loaded");
        if (statusClearTimeout) clearTimeout(statusClearTimeout);
        statusClearTimeout = setTimeout(() => Save.setStatus(""), STATUS_TIME);
    },
    display() {
        const div = document.createElement("div");
        div.className = "panel-container";

        div.innerHTML = "<h3>Save / Load</h3>"

        const buttonSave = document.createElement("button");
        buttonSave.className = "panel-button";
        buttonSave.addEventListener("click", e => {
            Save.save();
        });
        buttonSave.innerText = "Save";

        const buttonLoad = document.createElement("button");
        buttonLoad.className = "panel-button";
        buttonLoad.addEventListener("click", e => {
            Save.load();
        });
        buttonLoad.innerText = "Load";

        const statusArea = document.createElement("p");
        statusArea.id = "save-status";
        statusArea.innerText = status;

        div.append(buttonSave, buttonLoad, statusArea);
        LeftPanel.setBody("save", div);

        displayed = true;
    },
    setStatus(str: string) {
        if (!displayed) Save.display();
        status = str;
        document.getElementById("save-status")!.innerText = str;
    }
}

setInterval(Save.save, AUTOSAVE_INTERVAL, true);
Save.display();
Save.load();
