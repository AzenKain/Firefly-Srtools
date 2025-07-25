export function randomPartition(sum: number, parts: number): number[] {
    const raw = Array.from({ length: parts }, () => Math.random());
    const total = raw.reduce((a, b) => a + b, 0);
    const result = raw.map(r => Math.floor((r / total) * (sum - parts)) + 1);
    let diff = sum - result.reduce((a, b) => a + b, 0);
    while (diff !== 0) {
        for (let i = 0; i < result.length && diff !== 0; i++) {
            if (diff > 0) {
                result[i]++;
                diff--;
            } else if (result[i] > 1) {
                result[i]--;
                diff++;
            }
        }
    }

    return result;
}

export function randomStep(x: number): number {
    let total = 0;
    for (let i = 0; i < x; i++) {
        total += Math.floor(Math.random() * 3);
    }
    return total;
}