// based on https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
// https://codeforces.com/blog/entry/85638

class NaiveBowyerWatson {

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

        toString() {
            const idxs = [this.a.idx, this.b.idx, this.c.idx];
            idxs.sort();
            return `${idxs[0]}_${idxs[1]}_${idxs[2]}`;
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

    constructor(nodes, drawingMethods) {

        this.nodes = nodes;
        this.drawingMethods = drawingMethods;
        this.delaunay = null;
        this.voronoi = null;
    }

    draw() {
        for (const node of this.nodes) {
            this.drawingMethods.drawPoint(node, 5, "black", this.canvas);
        }
        for (const triangle of Object.values(this.delaunay)) {
            this.drawingMethods.drawEdge(triangle.a.getPointCoord(), triangle.b.getPointCoord(), true);
            this.drawingMethods.drawEdge(triangle.c.getPointCoord(), triangle.b.getPointCoord(), true);
            this.drawingMethods.drawEdge(triangle.a.getPointCoord(), triangle.c.getPointCoord(), true);
        }
        for (const edge of this.voronoi) {
            this.drawingMethods.drawEdge(edge[0], edge[1]);
        }
    }

    async triangulate(demo=0, random=true) {
        const n = this.nodes.length;

        const firstColumn = nodeData.map(function (row) {
            return row[0];
        });

        const secondColumn = nodeData.map(function (row) {
            return row[1];
        });
        const xmin = Math.min(...firstColumn);
        const xmax = Math.max(...firstColumn);
        const ymin = Math.min(...secondColumn);
        const ymax = Math.max(...secondColumn);
        const epsilon = 0.1 * Math.max(xmax - xmin, ymax - ymin); //10% de la plage maximale (max - min) dans l'une ou l'autre direction.

        const supA = new this.constructor.Point(n, xmin-epsilon, ymin-epsilon);
        const supB = new this.constructor.Point(n+1, xmin+2*(xmax-xmin)+3*epsilon,ymin-epsilon );
        const supC = new this.constructor.Point(n+2, xmin-epsilon, ymin+2*(ymax-ymin)+3*epsilon);


        const supTriangle = new this.constructor.Triangle(supA, supB, supC);
        this.delaunay = {};
        this.delaunay[supTriangle.toString()] = supTriangle;

        if (random) {
            shuffleArray(this.nodes);
        }

        for (let i = 0; i < this.nodes.length; i++) {
            const point = new this.constructor.Point(i, ...this.nodes[i]);
            this.addPoint(point);
            if (demo) {
                this.computeVoronoi();
                await new Promise(r => setTimeout(r, demo));
            }
        }

        this.computeVoronoi();
        for (const triangleString of Object.values(this.delaunay)) {
            const triangle = this.delaunay[triangleString];
            for (const point of triangle.getPoints()) {
                if (point.idx >= this.nodes.length) {
                    delete this.delaunay[triangleString];
                    break;
                }
            }
        }
    }

    addPoint(point) {
        const badTriangles = [];
        const sharedEdges = {};
        for (const triangle of Object.values(this.delaunay)) {
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
            delete this.delaunay[triangle.toString()];
        }

        for (const edge of polygon) {
            const newTriangle = new this.constructor.Triangle(edge[0], edge[1], point);
            this.delaunay[newTriangle.toString()] = newTriangle;
        }
    }

    computeVoronoi() {
        const edgeTriangle = {};
        for (const triangle of Object.values(this.delaunay)) {
            for (const edge of triangle.getEdges()) {
                const edgeString = this.constructor.Triangle.getEdgeString(edge);
                if (!(edgeString in edgeTriangle)) {
                    edgeTriangle[edgeString] = [];
                }
                edgeTriangle[edgeString].push(triangle);
            }
        }
        this.voronoi = [];
        for (const triangle of Object.values(this.delaunay)) {
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