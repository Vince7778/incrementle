
// Gets fibonacci number n, with f0 = 0 and f1 = 1
export function fibonacci(n: number) {
    if (n <= 0) return 0;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        let temp = b;
        b += a;
        a = temp;
    }
    return b;
}

// Shuffles in place on arr
export function shuffle(arr: any[]) {
    let cur = arr.length, rand = -1;

    while (cur != 0) {
        rand = Math.floor(Math.random() * cur);
        cur--;
        [arr[cur], arr[rand]] = [arr[rand], arr[cur]];
    }
}

// Generates array of integers in [x, x+n) with step s
export function iota(n: number, x = 0, s = 1) {
    let arr = [];
    for (let i = 0; i < n; i++) arr.push(x+i*s);
    return arr;
}
