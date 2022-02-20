
export class Wallet { 
    points = 0;
    constructor(opt?: Partial<Wallet>) {
        if (!opt) return;
        this.points = opt.points || 0;
    }
}

export type Currency = keyof Wallet;
