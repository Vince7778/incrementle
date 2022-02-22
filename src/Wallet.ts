
// Please do not set any of those manually... use set() and get() instead!
export class WalletInstance {
    private points = 0;
    constructor(opt?: { [cur in Currency]?: number }) {
        if (!opt) return;
        this.points = opt.points || 0;
    }
    set(cur: Currency, amount: number) {
        this[cur] = amount;
    }
    get(cur: Currency) {
        return this[cur];
    }
    add(cur: Currency, amount: number) {
        this[cur] += amount;
    }
    multiply(cur: Currency, amount: number) {
        this[cur] *= amount;
    }
}

type WalletListener = (wallet: ListenableWallet) => void;

export class ListenableWallet extends WalletInstance {
    listeners: WalletListener[] = [];
    constructor(opt?: { [cur in Currency]?: number }) {
        super(opt);
    }
    addListener(wlist: WalletListener) {
        this.listeners.push(wlist);
    }
    _runListeners() {
        this.listeners.forEach(f => f(this));
    }

    set(cur: Currency, amount: number) {
        super.set(cur, amount);
        this._runListeners();
    }
    add(cur: Currency, amount: number) {
        super.add(cur, amount);
        this._runListeners();
    }
    multiply(cur: Currency, amount: number) {
        super.multiply(cur, amount);
        this._runListeners();
    }
}

export type Currency = "points";

export const PlayerWallet = new ListenableWallet();
