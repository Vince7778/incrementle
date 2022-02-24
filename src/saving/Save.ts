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

function createPanelButton(text: string, callback: (e: MouseEvent) => void) {
    const button = document.createElement("button");
    button.className = "panel-button";
    button.addEventListener("click", callback);
    button.innerText = text;
    return button;
}

export const Save = {
    save(isAutosave=false) {
        const ret = Save.getSaveJSON();
        localStorage.setItem("save", JSON.stringify(ret));

        if (!isAutosave) {
            Save.setStatus("Saved");
            if (statusClearTimeout) clearTimeout(statusClearTimeout);
            statusClearTimeout = setTimeout(() => Save.setStatus(""), STATUS_TIME);
        }
    },
    getSaveJSON() {
        return {
            player: curPlayer.save(),
            wallet: PlayerWallet.save(),
            upgrades: UpgradeManager.save(),
            // TODO: add wordle saving
        }
    },
    load(isAutoload=false) {
        const val = localStorage.getItem("save");
        if (!val) return;
        const casted = JSON.parse(val) as SaveType;
        if (!casted) return;
        Save.loadFromJSON(casted, isAutoload);
    },
    loadFromJSON(json: SaveType, isAutoload=false) {
        PlayerWallet.load(json.wallet); // load wallet before player
        curPlayer.load(json.player);
        UpgradeManager.load(json.upgrades);

        if (json.player.gamesWon > 0) LeftPanel.show();

        curWordle.resetGame();

        if (!isAutoload) {
            Save.setStatus("Loaded");
            if (statusClearTimeout) clearTimeout(statusClearTimeout);
            statusClearTimeout = setTimeout(() => Save.setStatus(""), STATUS_TIME);
        }
    },
    display() {
        const div = document.createElement("div");
        div.className = "panel-container";

        div.innerHTML = "<h3>Save / Load</h3>"

        const buttonSave = createPanelButton("Save", e => {
            Save.save();
        });

        const buttonLoad = createPanelButton("Load", e => {
            Save.load();
        });

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
Save.load(true);
