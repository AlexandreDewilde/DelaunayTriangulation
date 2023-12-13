class Fortune {
    constructor(nodes, drawingMethods) {
        this.nodes = nodes;
        this.drawingMethods = drawingMethods;
        this.delaunay = null;
        this.voronoi = null;
    }


    draw() {
        if (!this.delaunay) {
            this.triangulate();
        }
    }

    async triangulate() {
        this.delaunay = [];
    }
}