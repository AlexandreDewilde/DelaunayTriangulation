class FlipAlgorithm {
    constructor(nodes, drawingMethods) {
        this.nodes = nodes;
        this.drawingMethods = drawingMethods;

        this.basicTriangulation = null;
        this.delaunay = null;
        this.voronoi = null;
    }

    computeBasicTriangulation() {
        const sortedNodes = [...this.nodes]; sortedNodes.sort();
        console.log(sortedNodes);
    }

    draw() {

    }

    async triangulate(demo=0) {
        this.basicTriangulation = this.computeBasicTriangulation();
    }
}