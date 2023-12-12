const canvasTriangulation = document.getElementById("canvas-triangulation");

resizeCanvas(canvasTriangulation, window.innerWidth - 100, window.innerHeight - 100);
window.addEventListener("resize", () => resizeCanvas(canvasTriangulation, window.innerWidth - 100, window.innerHeight - 100))

const triangulation = new Canvas(nodeData, NaiveBowyerWatson, canvasTriangulation);
triangulation.start();
