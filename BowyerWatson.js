class BowyerWatson {
    constructor(nodes, drawNode, drawEdge) {
        this.nodes = nodes;
        this.drawNode = drawNode;
        this.drawEdge = drawEdge;
        this.delaunay = null;
        this.extendedNodes = null;
    }

    draw(scaledNodes) {
        for (const node of scaledNodes) {
            this.drawNode(node, 5, "black", this.canvas);
        }
        if (!this.delaunay) {
            this.triangulate();
        }

        for (const triangle of this.delaunay) {
            this.drawEdge(scaledNodes[triangle[0]], scaledNodes[triangle[1]], this.canvas);
            this.drawEdge(scaledNodes[triangle[2]], scaledNodes[triangle[1]], this.canvas);
            this.drawEdge(scaledNodes[triangle[0]], scaledNodes[triangle[2]], this.canvas);
        }
    }

    triangulate() {
        const supA = [-10, -10]
        const supB = [20 + 10, -10];
        const supC = [-10, 20+10];

        this.extendedNodes = [...this.nodes, supA, supB, supC];
        this.delaunay = [[this.nodes.length, this.nodes.length + 1, this.nodes.length + 2]];

        for (let i = 0; i < this.nodes.length; i++) {
            this.addPoint(i);
        }

        for (let idx = this.delaunay.length - 1; idx >= 0; idx--) {
            const triangle = this.delaunay[idx];
            for (const node of triangle) {
                if (node >= this.nodes.length) {
                    this.delaunay.splice(idx, 1);
                    break;
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
                if (edge2String in sharedEdges) {
                    sharedEdge += sharedEdges[edge2String];
                }
                if (sharedEdge == 1) {
                    polygon.push(edge);
                }
            }
        }

        for (const triangle of badTriangles) {
            this.delaunay.splice(this.delaunay.indexOf(triangle), 1);
        }

        for (const edge of polygon) {
            this.delaunay.push([edge[0], edge[1], i]);
        }
    }
}