// based on https://perso.uclouvain.be/vincent.legat/documents/meca2170/meshGenerationBook.pdf
// Without hilbert curve sorting O(n^2)
// With hilbert curve sorting O(n log(n))

class EfficientBowyerWatson {

    static Vertex = class {
        constructor(idx, x, y) {
            this.idx = idx;
            this.x = x;
            this.y = y;
        }

        getPointCoord() {
            return [this.x, this.y];
        }

        orientationTest(b, c) {
            // TODO deal with colinear points
            // One way is: https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
            return (b.y - this.y) * (c.x - b.x) - (b.x - this.x) * (c.y - b.y) < 0 ? -1 : 1;
        }
   }

    static Edge = class {
        constructor(v1, v2) {
            if (v1.idx > v2.idx) {
                [v1, v2] = [v2, v1];
            }
            this.v1 = v1;
            this.v2 = v2;
        }
        compare(edge) {
            if (this.v1.idx != edge.v1.idx) {
                return this.v1.idx - edge.v1.idx;
            }
            return this.v2.idx - edge.v2.idx;
        }
    }

    static Face = class {
        constructor(a, b, c) {
            this.vertex = [a, b, c];
            this.vertex.sort((x, y) => x.idx - y.idx);
            this.faces = [null, null, null];
            this.deleted = false;
            this.circum = computeCircum(this.getPointsCoords());
            this.radius = computeDst(a.getPointCoord(), this.circum);
        }

        isCircum(point) {
            return computeDst(this.circum, point.getPointCoord()) < this.radius;
        }

        getCentroid() {
            return [(this.vertex[0].x + this.vertex[1].x + this.vertex[2].x) / 3,
            (this.vertex[0].y + this.vertex[1].y + this.vertex[2].y) / 3];
        }

        reset(a, b, c) {
            this.vertex[0] = a;
            this.vertex[1] = b;
            this.vertex[2] = c;
            this.vertex.sort((x, y) => x.idx - y.idx);
            this.faces[0] = this.faces[1] = this.faces[2] = null;
            this.deleted = false;
            this.circum = computeCircum(this.getPointsCoords());
            this.radius = computeDst(a.getPointCoord(), this.circum);
        }

        getEdges() {
            const ret = [];
            for (let i = 0; i < 3; i++) {
                ret.push(new EfficientBowyerWatson.Edge(this.vertex[i], this.vertex[(i+1)%3]));
            }
            return ret;
        }

        getEdge(i) {
            return new EfficientBowyerWatson.Edge(this.vertex[i], this.vertex[(i+1)%3]);
        }

        getPointsCoords() {
            const coords = [];
            for (const point of this.vertex) {
                coords.push([point.x, point.y]);
            }
            return coords;
        }
    }

    constructor(nodes, demoDelay=0) {
        this.nodes = nodes;
        this.demoDelay = demoDelay;
        this.delaunay = null;
        this.voronoiFaces = null;
    }

    computeEdgeIndex(edge) {
        return edge.v1.idx + edge.v2.idx * (this.nodes.length + 5);
    }

    getDelaunayEdges() {
        if (!this.faces) {
            this.triangulate();
        }
        const edges = [];
        for (const face of this.faces) {
            for (const edge of face.getEdges()) {
                if (edge.v1.idx >= this.nodes.length || edge.v2.idx >= this.nodes.length) {
                    continue;
                }
                edges.push([edge.v1.getPointCoord(), edge.v2.getPointCoord()]);
            }
        }
        return edges;
    }

    getVoronoiFaces() {
        if (!this.voronoiFaces) {
            if (!this.faces) {
                this.triangulate();
            }
            this.computeVoronoi();
        }
        return this.voronoiFaces;
    }

    getNodes() {
       return this.nodes;
    }

    updateNodes(nodes) {
        this.nodes = nodes;
        this.faces = null;
        this.voronoiFaces = null;
    }

    getSuperTriangle() {
        const n = this.nodes.length;
        const [xmin, xmax, ymin, ymax] = minAndMaxNodes(this.nodes);
        const epsilon = 0.1 * Math.max(xmax - xmin, ymax - ymin);

        const supA = new this.constructor.Vertex(n, xmin-epsilon, ymin-epsilon);
        const supB = new this.constructor.Vertex(n+1, xmin+2*(xmax-xmin)+3*epsilon,ymin-epsilon );
        const supC = new this.constructor.Vertex(n+2, xmin-epsilon, ymin+2*(ymax-ymin)+3*epsilon);

        return new this.constructor.Face(supA, supB, supC);
    }

    hilbertSort(nodes) {
        nodes.sort((x,y) => {
            const res = hilbertCoord(x[0], x[1], 0, 0, 1, 0, 1, 0, 30);
            const res2 = hilbertCoord(y[0], y[1], 0, 0, 1, 0, 1, 0, 30);
            return res - res2;
        });
    }

    async triangulate(hilbert=true) {
        this.faces = [this.getSuperTriangle(this.nodes)];
        if (hilbert) {
            this.hilbertSort(this.nodes);
        }

        for (let i = 0; i < this.nodes.length; i++) {
            this.addPoint(i);
            if (this.demoDelay) {
                this.computeVoronoi();
                await new Promise(r => setTimeout(r, this.demoDelay));
            }
        }
    }

    addPoint(i) {
        const vertex = new this.constructor.Vertex(i, ...this.nodes[i]);
        const f = this.lineSearch(this.faces[this.faces.length - 1], vertex);
        const cavity = [];
        const boundary = [];
        const otherSide = [];
        this.delaunayCavity(f, vertex, cavity, boundary, otherSide);
        const cavityLen = cavity.length;
        let j = 0;
        for (; j < cavityLen; j++) {
            cavity[j].reset(boundary[j].v1, boundary[j].v2, vertex);
        }
        for (; j < cavityLen + 2; j++) {
            const newFace = new this.constructor.Face(boundary[j].v1, boundary[j].v2, vertex);
            cavity.push(newFace);
            this.faces.push(newFace);
        }
        for (j = 0; j < otherSide.length; j++) {
            otherSide[j].deleted = false;
            cavity.push(otherSide[j]);
        }
        this.computeAdjency(cavity);
    }

    computeAdjency(cavity) {
        const edgeToFace = {};
        for (const face of cavity) {
            for (let i = 0; i < 3; i++) {
                const edgeIdx = this.computeEdgeIndex(face.getEdge(i));
                if (!(edgeIdx in edgeToFace)) {
                    edgeToFace[edgeIdx] = [i, face];
                }
                else {
                    const mapping = edgeToFace[edgeIdx];
                    face.faces[i] = mapping[1];
                    mapping[1].faces[mapping[0]] = face;
                    delete edgeToFace[edgeIdx];
                }
            }
        }
    }

    computeVoronoi() {
        const pointCircums = {};
        const vertexMatch = {};
        for (const face of this.faces) {
            for (const vertex of face.vertex) {
                if (!(vertex.idx in pointCircums)) {
                    pointCircums[vertex.idx] = [];
                    vertexMatch[vertex.idx] = vertex;
                }
                pointCircums[vertex.idx].push(face.circum);
            }
        }
        this.voronoiFaces = [];
        for (const [ptIdx, lst] of Object.entries(pointCircums)) {
            lst.sort((a,b) => polarSortCompare(a, b, vertexMatch[ptIdx].getPointCoord()));
            this.voronoiFaces.push(lst);
        }
    }

    delaunayCavity(face, vertex, cavity, boundary, otherSides) {
        const stack = [face];
        while (stack.length) {
            face = stack.pop();
            if (!face || face.deleted) {
                continue;
            }
            face.deleted = true;
            cavity.push(face);
            for (let i = 0; i < 3; i++) {
                const neighFace = face.faces[i];
                if (!neighFace) {
                    boundary.push(face.getEdge(i));
                }
                else if (neighFace.isCircum(vertex) == false) {
                    boundary.push(face.getEdge(i));
                    if (!neighFace.deleted) {
                        neighFace.deleted = true;
                        otherSides.push(neighFace);
                    }
                }
                else {
                    stack.push(neighFace);
                }
            }
        }
    }

    intersect(a, b, c, d) {
        // https://stackoverflow.com/questions/3838329/how-can-i-check-if-two-segments-intersect
        return a.orientationTest(b, c) * a.orientationTest(b, d) < 0
            && c.orientationTest(d, a) * c.orientationTest(d, b) < 0;
    }

    lineSearch(face, vertex) {
        while (true) {
            if (face.isCircum(vertex)) {
                return face;
            }
            const c = new this.constructor.Vertex(-1, ...face.getCentroid());
            const edges = face.getEdges();
            let found = false;
            for (let i = 0; i < 3; i++) {
                const edge = edges[i];
                if (this.intersect(c, vertex, edge.v1, edge.v2) && !found) {
                    face = face.faces[i];
                    found = true;
                    break;
                }
            }
            if (!found) {
                return;
            }
        }
    }
}