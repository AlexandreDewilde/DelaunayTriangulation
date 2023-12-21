const nodes = [];
const sectionRunTests = document.getElementById("section-tests");
async function testSpeed(nodes, algorithm, arg) {
    const triangulation = new algorithm(nodes);
    const start = performance.now();
    await triangulation.triangulate(arg);
    return (performance.now() - start);
}

let x = [...Array(10).keys()].map(x => x *100);
let x2 = [...Array(10).keys()].map(x => x * 1000);
let y1 = [
    0.16000000000931322,
    11.91999999997206,
    15.960000000009313,
    32.5,
    46.97999999998137,
    75.96000000005589,
    109.72000000001863,
    140.51999999997207,
    180.93999999999068,
    220.8600000000093
];

let y2 = [
    0.0400000000372529,
    2.8799999999813735,
    3.5399999999441207,
    4.820000000018626,
    5.98000000002794,
    7.639999999990687,
    9.739999999990687,
    11.920000000018627,
    13.739999999944121,
    16.099999999953432
];

let y3 = [
    1.0199999999254943,
    1.1,
    2.0999999998137353,
    3.580000000074506,
    6.140000000223518,
    7.559999999962747,
    8.819999999925495,
    10.639999999850989,
    11.5,
    15.980000000074506
];

let y4 = [
    0.9200000001117588,
    23.2,
    47.980000000074504,
    78.25999999996274,
    116.11999999973924,
    141.93999999985098,
    173.22000000029803,
    218.30000000018626,
    250.6599999997765,
    296.839999999851
]

let y5 = [
    1.0799999998882412,
    17.460000000149012,
    35.05999999996275,
    60.079999999888244,
    100.48000000007451,
    126.69999999981374,
    170.72000000011175,
    190.87999999988824,
    238.11999999992548,
    280.939999999851
];


async function runTests(algorithm, y, name, arg) {
    const runs = 5;
    for (let i = 0; i < x.length; i++) {
        const size = x[i];
        let avg = 0;
        for (let j = 0; j < runs; j++) {
            const nodes = randomNodes(size);
            avg += await testSpeed(nodes, algorithm, arg);
        }
        avg /= runs;
        y[i] = avg;
    }
    sectionRunTests.appendChild(document.createTextNode(`; Test ${name} ended`));
}

async function runTests2(algorithm, y, name, arg) {
    const runs = 5;
    for (let i = 0; i < x2.length; i++) {
        const size = x2[i];
        let avg = 0;
        for (let j = 0; j < runs; j++) {
            const nodes = randomNodes(size);
            avg += await testSpeed(nodes, algorithm, arg);
        }
        avg /= runs;
        y[i] = avg;
    }
    sectionRunTests.appendChild(document.createTextNode(`; Test ${name} ended`));
}

const chartCanvas = document.getElementById("canvas-chart");
const chartCanvas2 = document.getElementById("canvas-chart-efficient");

const chart = new Chart(chartCanvas, {
    type: "line",
    data: {
        labels: x,
        datasets: [
            {
                label: "Naive Bowyer Watson",
                data: y1,
            },
            {
                label: "Efficient Bowyer Watson",
                data: y2,
            },
            {
                label: "Efficient Bowyer Watson, no hilbert sort",
                data: y3,
            },
        ],
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: "true",
                text: "Comparison of differents algo",
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Time (ms)",
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Number of nodes"
                }
            }
        },
    },
});

const buttonRunSpeedTests = document.getElementById("button-run-speed-tests");

buttonRunSpeedTests.addEventListener("click", async () => {
    sectionRunTests.innerHTML = "";
    const text = document.createTextNode("Start Tests");
    sectionRunTests.appendChild(text);
    let p1 = p2 = p3 = p4 = p5 = null;
    setTimeout(async () => {
        p1 = runTests(NaiveBowyerWatson, y1, "NaiveBowyerWatson");
        chart.update();
    }, 25);
    setTimeout(async () => {
        p2 = runTests(EfficientBowyerWatson, y2, "EfficientBowyerWatson");
        chart.update();
    }, 10);
    setTimeout(async () => {
        p3 = runTests(EfficientBowyerWatson, y3, "EfficientBowyerWatson", false);
        chart.update();
    }, 10);

    setTimeout(async () => {
        p4 = runTests2(EfficientBowyerWatson, y4, "EfficientBowyerWatson");
        chart2.update();
    }, 10);

    setTimeout(async () => {
        p5 = runTests2(EfficientBowyerWatson, y5, "EfficientBowyerWatson", false);
        chart2.update();
    }, 10);
    await Promise.all([p1, p2, p3, p4, p5]);
    chart.update();
    chart2.update();
});


const chart2 = new Chart(chartCanvas2, {
    type: "line",
    data: {
        labels: x2,
        datasets: [
            {
                label: "Efficient Bowyer Watson",
                data: y4,
            },
            {
                label: "Efficient Bowyer Watson, no hilbert sort",
                data: y5,
            },
        ],
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: "true",
                text: "Comparison of differents algo",
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Time (ms)",
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Number of nodes"
                }
            }
        },
    },
});