// based on https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
// https://codeforces.com/blog/entry/85638

// O(n^2)
class BowyerWatson {
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
            this.drawEdge(this.nodes[triangle.a], this.nodes[triangle.b], true);
            this.drawEdge(this.nodes[triangle.c], this.nodes[triangle.b], true);
            this.drawEdge(this.nodes[triangle.a], this.nodes[triangle.c], true);
        }
        for (const edge of this.voronoi) {
            this.drawEdge(edge[0], edge[1]);
        }
    }

    triangulate() {
        const supA = [-10, -10]
        const supB = [20 + 10, -10];
        const supC = [-10, 20+10];

        this.extendedNodes = [...this.nodes, supA, supB, supC];
        const supTriangle = new Triangle(this.nodes.length, this.nodes.length + 1, this.nodes.length + 2);
        supTriangle.setCircum(computeCircum(supTriangle, this.extendedNodes));
        this.delaunay = [supTriangle];

        for (let i = 0; i < this.nodes.length; i++) {
            this.addPoint(i);
        }

        for (let idx = this.delaunay.length - 1; idx >= 0; idx--) {
            const triangle = this.delaunay[idx];
            for (const node of [triangle.a, triangle.b, triangle.c]) {
                if (node >= this.nodes.length) {
                    // we should find an other datastructure to avoid expensive operation
                    this.delaunay.splice(idx, 1);
                    break;
                }
            }
        }
    }

    computeVoronoi() {
        const edgeTriangle = {};
        for (const triangle of this.delaunay) {
            for (const edge of getEdges(triangle)) {
                const edgeString = getEdgeString(edge);
                if (!(edgeString in edgeTriangle)) {
                    edgeTriangle[edgeString] = [];
                }
                edgeTriangle[edgeString].push(triangle);
            }
        }
        this.voronoi = [];
        for (const triangle of this.delaunay) {
            for (const edge of getEdges(triangle)) {
                const edgeString = getEdgeString(edge);
                for (const triangle2 of edgeTriangle[edgeString]) {
                    if (triangle2 == triangle) {
                        continue;
                    }
                    this.voronoi.push([triangle.circum, triangle2.circum]);
                }
            }
        }
    }

    addPoint(i) {
        const badTriangles = [];
        const sharedEdges = {};
        for (const triangle of this.delaunay) {
            if (isCircum(triangle, i, this.extendedNodes)) {
                badTriangles.push(triangle);
                for (const edgeString of getEdgesString(triangle)) {
                    if (!(edgeString in sharedEdges)) {
                        sharedEdges[edgeString] = 0;
                    }
                    sharedEdges[edgeString]++;
                }
            }
        }

        const polygon = [];
        for (const triangle of badTriangles) {
            for (const edge of getEdges(triangle)) {
                const edge2String = getEdgeString([edge[1], edge[0]]);
                let sharedEdge = sharedEdges[getEdgeString(edge)];
                if (sharedEdge == 1) {
                    polygon.push(edge);
                }
            }
        }

        for (const triangle of badTriangles) {
            this.delaunay.splice(this.delaunay.indexOf(triangle), 1);
        }

        for (const edge of polygon) {
            const newTriangle = new Triangle(edge[0], edge[1], i);
            this.delaunay.push(newTriangle);
            newTriangle.setCircum(computeCircum(newTriangle, this.extendedNodes));
        }
    }
}