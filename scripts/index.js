const canvasTriangulation = document.getElementById("canvas-triangulation");


const size = Math.min(window.innerWidth, window.innerHeight) - 80;
resizeCanvas(canvasTriangulation, size, size);
window.addEventListener("resize", () => resizeCanvas(canvasTriangulation, Math.min(window.innerWidth, window.innerHeight) - 80, Math.min(window.innerWidth, window.innerHeight) - 80));

const triangulation = new Canvas(nodeData, NaiveBowyerWatson, canvasTriangulation);
triangulation.start();
