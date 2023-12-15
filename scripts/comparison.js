const nodes = [];

for (let i = 0; i < 10_000; i++) {
    nodes.push([Math.random(), Math.random()]);
}

async function testSpeed(algorithm) {
    const start = performance.now();
    await algorithm.triangulate();
    console.log(performance.now() - start);
}

async function main() {
    const eff = new EfficientBowyerWatson(nodes, null);
    const naive = new NaiveBowyerWatson(nodes, null);
    await testSpeed(eff);
    await testSpeed(naive);
}

main();