// based on https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
// https://codeforces.com/blog/entry/85638

// O(n^2)
class BowyerWatson {

    static Point = class {
        constructor(idx, x, y) {
            this.idx = idx;
            this.x = x;
            this.y = y;
        }

        getPointCoord() {
            return [this.x, this.y];
        }
    }

    static Triangle = class {
        constructor(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.circum = computeCircum(this.getPointsCoords());
            this.radius = computeDst(a.getPointCoord(), this.circum);
        }


        isCircum(point) {
            return computeDst(this.circum, point.getPointCoord()) < this.radius;
        }

        getPoints() {
            return [this.a, this.b, this.c];
        }

        getPointsCoords() {
            const coords = [];
            for (const point of this.getPoints()) {
                coords.push([point.x, point.y]);
            }
            return coords;
        }

        getEdges() {
            return [[this.a, this.b], [this.b, this.c], [this.c, this.a]];
        }

        static getEdgeString(edge) {
            return Math.min(edge[0].idx, edge[1].idx) + "_" + Math.max(edge[1].idx, edge[0].idx);
        }

        getEdgesString() {
            const edges = this.getEdges();
            const res = [];
            for (const edge of edges) {
                res.push(this.constructor.getEdgeString(edge));
            }
            return res;
        }
    }

    constructor(nodes, drawNode, drawEdge) {
        this.nodes = nodes;
        this.drawNode = drawNode;
        this.drawEdge = drawEdge;
        this.delaunay = null;
        this.voronoi = null;
        this.extendedNodes = null;
    }

    draw() {
        for (const node of this.nodes) {
            this.drawNode(node, 5, "black", this.canvas);
        }
        if (!this.delaunay) {
            this.triangulate();
        }
        if (!this.voronoi) {
            this.computeVoronoi();
        }

        for (const triangle of this.delaunay) {
            this.drawEdge(triangle.a.getPointCoord(), triangle.b.getPointCoord(), true);
            this.drawEdge(triangle.c.getPointCoord(), triangle.b.getPointCoord(), true);
            this.drawEdge(triangle.a.getPointCoord(), triangle.c.getPointCoord(), true);
        }
        for (const edge of this.voronoi) {
            this.drawEdge(edge[0], edge[1]);
        }
    }

    triangulate() {
        const n = this.nodes.length;
        const supA = new this.constructor.Point(n, -10, -10);
        const supB = new this.constructor.Point(n+1, 20 + 10, -10);
        const supC = new this.constructor.Point(n+2, -10, 20 + 10);

        const supTriangle = new this.constructor.Triangle(supA, supB, supC);
        this.delaunay = [supTriangle];

        for (let i = 0; i < this.nodes.length; i++) {
            this.addPoint(new this.constructor.Point(i, ...this.nodes[i]));
        }

        for (let idx = this.delaunay.length - 1; idx >= 0; idx--) {
            const triangle = this.delaunay[idx];
            for (const point of triangle.getPoints()) {
                if (point.idx >= this.nodes.length) {
                    // we should find an other datastructure to avoid expensive operation
                    this.delaunay.splice(idx, 1);
                    break;
                }
            }
        }
    }

    addPoint(point) {
        const badTriangles = [];
        const sharedEdges = {};
        for (const triangle of this.delaunay) {
            if (triangle.isCircum(point)) {
                badTriangles.push(triangle);
                for (const edgeString of triangle.getEdgesString()) {
                    if (!(edgeString in sharedEdges)) {
                        sharedEdges[edgeString] = 0;
                    }
                    sharedEdges[edgeString]++;
                }
            }
        }

        const polygon = [];
        for (const triangle of badTriangles) {
            for (const edge of triangle.getEdges()) {
                const sharedEdge = sharedEdges[this.constructor.Triangle.getEdgeString(edge)];
                if (sharedEdge == 1) {
                    polygon.push(edge);
                }
            }
        }

        for (const triangle of badTriangles) {
            this.delaunay.splice(this.delaunay.indexOf(triangle), 1);
        }

        for (const edge of polygon) {
            const newTriangle = new this.constructor.Triangle(edge[0], edge[1], point);
            this.delaunay.push(newTriangle);
        }
    }

    computeVoronoi() {
        const edgeTriangle = {};
        for (const triangle of this.delaunay) {
            for (const edge of triangle.getEdges()) {
                const edgeString = this.constructor.Triangle.getEdgeString(edge);
                if (!(edgeString in edgeTriangle)) {
                    edgeTriangle[edgeString] = [];
                }
                edgeTriangle[edgeString].push(triangle);
            }
        }
        this.voronoi = [];
        for (const triangle of this.delaunay) {
            for (const edgeString of triangle.getEdgesString(triangle)) {
                for (const triangle2 of edgeTriangle[edgeString]) {
                    if (triangle2 == triangle) {
                        continue;
                    }
                    this.voronoi.push([triangle.circum, triangle2.circum]);
                }
            }
        }
    }
}