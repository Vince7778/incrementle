import { curPlayer, Player, PlayerSave } from "../Player"
import { UpgradeManager } from "../upgrades/UpgradeManager"
import { Currency, PlayerWallet } from "../Wallet"

const AUTOSAVE_INTERVAL = 5000; // 5 seconds

interface SaveType {
    player: PlayerSave;
    wallet: {[cur in Currency]: number};
    upgrades: string[];
}

export const Save = {
    save() {
        const ret = {
            player: curPlayer.save(),
            wallet: PlayerWallet.save(),
            upgrades: UpgradeManager.save(),
            // TODO: add wordle saving
        }
        localStorage.setItem("save", JSON.stringify(ret));
    },
    load() {
        const val = localStorage.getItem("save");
        if (!val) return;
        const casted = JSON.parse(val) as SaveType;
        if (!casted) return;

        curPlayer.load(casted.player);
        PlayerWallet.load(casted.wallet);
        UpgradeManager.load(casted.upgrades);
    },
    display() {
        
    }
}

setInterval(Save.save, AUTOSAVE_INTERVAL);
