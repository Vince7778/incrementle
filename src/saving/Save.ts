import { LeftPanel } from "../LeftPanel";
import { curPlayer, PlayerSave } from "../Player"
import { UpgradeManager } from "../upgrades/UpgradeManager"
import { Currency, PlayerWallet } from "../Wallet"
import { curWordle } from "../wordle/Wordle";

const AUTOSAVE_INTERVAL = 15000; // 15 seconds
const STATUS_TIME = 1500; // time status is displayed
let displayed = false; // need to know if div has been created
let status = "";
let statusClearTimeout: number | null;

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
            Save.setStatus("Saved", true);
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
            Save.setStatus("Loaded", true);
        }
    },

    import() {
        const resp = prompt("Paste your import code here:", "");
        if (!resp) {
            Save.setStatus("Cancelled import", true);
            return;
        }

        let json: SaveType;
        try {
            const conv = atob(resp);
            json = JSON.parse(conv);
        } catch (err) {
            Save.setStatus("Invalid import", true);
            return;
        }

        Save.loadFromJSON(json);
    },

    export() {
        const json = Save.getSaveJSON();
        const base64 = btoa(JSON.stringify(json));
        navigator.clipboard.writeText(base64);
        Save.setStatus("Copied to clipboard", true, 3*STATUS_TIME); // longer duration to make sure they see
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

        const buttonImport = createPanelButton("Import", e => {
            Save.import();
        });

        const buttonExport = createPanelButton("Export", e => {
            Save.export();
        });

        const statusArea = document.createElement("p");
        statusArea.id = "save-status";
        statusArea.innerText = status;

        div.append(buttonSave, buttonLoad, buttonImport, buttonExport, statusArea);
        LeftPanel.setBody("save", div);

        displayed = true;
    },
    setStatus(str: string, doClear=false, clearDuration=STATUS_TIME) {
        if (!displayed) Save.display();
        status = str;
        document.getElementById("save-status")!.innerText = str;

        if (doClear) {
            if (statusClearTimeout) clearTimeout(statusClearTimeout);
            statusClearTimeout = setTimeout(() => {
                Save.setStatus("");
                statusClearTimeout = null;
            }, STATUS_TIME);
        }
    }
}

setInterval(Save.save, AUTOSAVE_INTERVAL, true);
Save.display();
Save.load(true);
