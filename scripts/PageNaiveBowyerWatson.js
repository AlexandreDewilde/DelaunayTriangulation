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

    resizeCanvas(canvasTriangulation, window.innerWidth - 100, window.innerHeight - 100);
    window.addEventListener("resize", () => resizeCanvas(canvasTriangulation, window.innerWidth - 100, window.innerHeight - 100));

    triangulation = new Canvas(nodeData, NaiveBowyerWatson, canvasTriangulation);
    sectionCanvas.appendChild(canvasTriangulation);
    demo = triangulation.start(delay);
}
buttonSkipDemo.addEventListener("click", () => recreateCanvas(0));

buttonRestartDemo.addEventListener("click", () => recreateCanvas(1000));

