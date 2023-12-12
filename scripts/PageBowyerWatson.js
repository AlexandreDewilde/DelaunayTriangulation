const canvasTriangulation = document.getElementById("canvas-triangulation");

function resizeCanvas(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
}

resizeCanvas(canvasTriangulation, window.innerWidth - 100, window.innerHeight - 100);
window.addEventListener("resize", () => resizeCanvas(canvasTriangulation, window.innerWidth - 100, window.innerHeight - 100))

const triangulation = new Canvas(nodeData, BowyerWatson, canvasTriangulation);
triangulation.startDemo();
