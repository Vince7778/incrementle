
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
