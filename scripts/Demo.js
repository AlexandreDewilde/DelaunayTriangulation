function createDemo(algorithm) {
    const sectionCanvas = document.getElementById("section-demo");
    const canvasTriangulation = document.getElementById("canvas-triangulation");


    const buttonSkipDemo = document.getElementById("button-skip-demo");
    const buttonRestartDemo = document.getElementById("button-restart-demo");
    const buttonDownloadGif = document.getElementById("button-download-gif");
    const rangeDemoSpeed = document.getElementById("range-demo-speed");
    const fileNodes = document.getElementById("file-nodes");

    const rangeGenerateRandom = document.getElementById("range-generate-random");
    const buttonGenerateRandom = document.getElementById("button-generate-random");
    const checkBoxShowNodes = document.getElementById("checkbox-show-nodes");
    const checkboxShowNodesNumbers = document.getElementById("checkbox-show-nodes-numbers");
    const checkboxShowTriangulation = document.getElementById("checkbox-show-triangulation");

    const rangeNodeSize = document.getElementById("range-node-size");
    const rangeFontSize = document.getElementById("range-font-size");
    resizeCanvas(canvasTriangulation, Math.min(window.innerWidth, window.innerHeight) - 120, Math.min(window.innerWidth, window.innerHeight) - 120);
    window.addEventListener("resize", () => resizeCanvas(canvasTriangulation, Math.min(window.innerWidth, window.innerHeight) - 120, Math.min(window.innerWidth, window.innerHeight) - 120));

    const triangulation = new Canvas(nodeData, algorithm, canvasTriangulation, {
        showNodes: checkBoxShowNodes.checked,
        showTextNodes: checkboxShowNodesNumbers.checked,
        showTriangulation: checkboxShowTriangulation.checked,
        nodeSize: rangeNodeSize.value,
        fontSize: rangeFontSize.value,
    });

    triangulation.updateDemoDelay(rangeDemoSpeed.value);
    triangulation.start();

    rangeFontSize.addEventListener("change", () => triangulation.updateOption("fontSize", rangeFontSize.value));

    rangeNodeSize.addEventListener("change", () => triangulation.updateOption("nodeSize", rangeNodeSize.value));

    buttonSkipDemo.addEventListener("click", () => triangulation.updateDemoDelay(0));

    buttonRestartDemo.addEventListener("click", () => triangulation.restart(rangeDemoSpeed.value));

    buttonDownloadGif.addEventListener("click", () => triangulation.restart(rangeDemoSpeed.value, true));

    rangeDemoSpeed.addEventListener("change", () => triangulation.updateDemoDelay(rangeDemoSpeed.value));

    fileNodes.addEventListener("change", () => readFile(fileNodes.files[0]));

    checkBoxShowNodes.addEventListener("change", () => triangulation.updateOption("showNodes", checkBoxShowNodes.checked));

    checkboxShowNodesNumbers.addEventListener("change", () => triangulation.updateOption("showNodesNumbers", checkboxShowNodesNumbers.checked));

    checkboxShowTriangulation.addEventListener("change", () => triangulation.updateOption("showTriangulation", checkboxShowTriangulation.checked))

    buttonGenerateRandom.addEventListener("click", () => {
        nodeData = [];
        for (let i = 0; i < rangeGenerateRandom.value; i++) {
            nodeData.push([Math.random(), Math.random()]);
        }
        triangulation.updateDemoDelay(rangeDemoSpeed.value);
        triangulation.resetNodes(nodeData);
    });

    sectionCanvas.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    sectionCanvas.addEventListener("drop", event => {
        event.preventDefault();
        readFile(event.dataTransfer.files[0]);
    });

    function readFile(file) {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
            const regex = /\[([\d.,\s]+)\]/g;
            const matches = event.target.result.match(regex);
            nodeData = JSON.parse("[" + matches.join(",") + "]");
            triangulation.resetNodes(nodeData);
        })
        reader.readAsText(file);
    };
}