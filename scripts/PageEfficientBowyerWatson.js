const sectionCanvas = document.getElementById("section-demo");
let canvasTriangulation = null;
let triangulation = null;

let demo = null;


const buttonSkipDemo = document.getElementById("button-skip-demo");
const buttonRestartDemo = document.getElementById("button-restart-demo");
const buttonDownloadGif = document.getElementById("button-download-gif");
const rangeDemoSpeed = document.getElementById("range-demo-speed");
const fileNodes = document.getElementById("file-nodes");

function recreateCanvas(delay, gif=false) {
    if (canvasTriangulation) {
        sectionCanvas.removeChild(canvasTriangulation);
    }
    canvasTriangulation = document.createElement("canvas");

    resizeCanvas(canvasTriangulation, Math.min(window.innerWidth, window.innerHeight) - 120, Math.min(window.innerWidth, window.innerHeight) - 120);
    window.addEventListener("resize", () => resizeCanvas(canvasTriangulation, Math.min(window.innerWidth, window.innerHeight) - 120, Math.min(window.innerWidth, window.innerHeight) - 120));

    triangulation = new Canvas(nodeData, EfficientBowyerWatson, canvasTriangulation);
    sectionCanvas.appendChild(canvasTriangulation);
    demo = triangulation.start(delay, gif);
}

recreateCanvas(rangeDemoSpeed.value);
buttonSkipDemo.addEventListener("click", () => recreateCanvas(0));

buttonRestartDemo.addEventListener("click", () => recreateCanvas(rangeDemoSpeed.value));

buttonDownloadGif.addEventListener("click", () => recreateCanvas(rangeDemoSpeed.value, true));

rangeDemoSpeed.addEventListener("change", () => recreateCanvas(rangeDemoSpeed.value));

fileNodes.addEventListener("change", () => {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        const regex = /\[([\d.,\s]+)\]/g;
        const matches = event.target.result.match(regex);
        nodeData = JSON.parse("[" + matches.join(",") + "]");
        recreateCanvas(rangeDemoSpeed.value);
    })
    reader.readAsText(fileNodes.files[0]);
});