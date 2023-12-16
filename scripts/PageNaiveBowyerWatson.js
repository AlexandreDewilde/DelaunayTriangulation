const sectionCanvas = document.getElementById("section-demo");
let canvasTriangulation = null;
let triangulation = null;

let demo = null;

recreateCanvas(1000);

const buttonSkipDemo = document.getElementById("button-skip-demo");
const buttonRestartDemo = document.getElementById("button-restart-demo");

function recreateCanvas(delay) {
    if (canvasTriangulation) {
        sectionCanvas.removeChild(canvasTriangulation);
    }
    canvasTriangulation = document.createElement("canvas");

    resizeCanvas(canvasTriangulation, Math.min(window.innerWidth, window.innerHeight) - 80, Math.min(window.innerWidth, window.innerHeight) - 80);
    window.addEventListener("resize", () => resizeCanvas(canvasTriangulation, Math.min(window.innerWidth, window.innerHeight) - 80, Math.min(window.innerWidth, window.innerHeight) - 80));

    triangulation = new Canvas(nodeData, NaiveBowyerWatson, canvasTriangulation);
    sectionCanvas.appendChild(canvasTriangulation);
    demo = triangulation.start(delay);
}
buttonSkipDemo.addEventListener("click", () => recreateCanvas(1));

buttonRestartDemo.addEventListener("click", () => recreateCanvas(1000));

