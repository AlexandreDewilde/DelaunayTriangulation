class Canvas {
    constructor(nodes, algorithm, canvas, options) {
        this.canvas = canvas;
        this.nodes = nodes;
        this.offset = 0;

        this.currentPromise = null;

        this.sizeAdapt();
        window.addEventListener("resize", () => this.sizeAdapt());

        this.voronoiColors = [];
        this.algorithm = algorithm
        this.triangulation = new algorithm(this.nodes, 0);

        this.options = {
            showNodes: true,
            showNodesNumbers: true,
            showTriangulation: true,
            nodeSize: 5,
            fontSize: 15,
        }

        if (options) {
            for (const [key, value] of Object.entries(options)) {
                this.options[key] = value;
            }
        }
    }

    updateOption(option, value) {
        this.options[option] = value;
    }

    resetNodes(nodes) {
        this.nodes = nodes;
        this.sizeAdapt();
        this.triangulation.updateNodes(nodes);
        this.triangulation.triangulate();
    }

    createGif() {
        this.gif = new GIF({
            quality: 100,
            height: this.canvas.height,
            width: this.canvas.width,
            workers: 4,
            quality: 8,
            workerScript: "/scripts/lib/gif.worker.js"
        });

        this.gif.on("finished", blob => {
            const invisibleA = document.createElement("a");
            const url = URL.createObjectURL(blob);
            invisibleA.setAttribute("href", url);
            invisibleA.setAttribute("download", "voronoi.gif");
            document.body.appendChild(invisibleA);
            invisibleA.click();
        });
    }

    updateDemoDelay(demoDelay) {
        this.demoDelay = demoDelay;
        this.triangulation.demoDelay = demoDelay;
    }

    async start(gif=false) {
        setInterval(this.draw.bind(this), 1000/60);
        if (gif) {
            this.currentGif = true;
            this.createGif();
        }
        this.currentPromise = this.triangulation.triangulate();
        await this.currentPromise;
        this.currentPromise = null;
        if (gif) {
            this.gif.render();
            this.currentGif = false;
        }
    }

    async restart(demoDelay=0, gif=false) {
        this.updateDemoDelay(demoDelay);
        this.triangulation = new this.algorithm(this.nodes, demoDelay);
        if (gif) {
            this.currentGif = true;
            this.createGif();
        }
        await this.triangulation.triangulate();
        if (gif) {
            this.gif.render();
            this.currentGif = false;
        }
    }

    draw() {
        this.clearCanvas();
        this.drawVoronoi();
        this.drawPoints();
        this.drawDelaunay();
        if (this.currentGif) {
            this.gif.addFrame(this.canvas.getContext("2d"), {copy: true, delay: 1000/60});
        }
    }

    drawDelaunay() {
        if (this.options.showTriangulation) {
            const edges = this.triangulation.getDelaunayEdges();
            for (const edge of edges) {
                this.drawEdge(...edge, true);
            }
        }
    }

    drawVoronoi() {
        const voronoiFaces = this.triangulation.getVoronoiFaces();
        for (let i = 0; i < voronoiFaces.length; i++) {
            const path = voronoiFaces[i];
            if (this.voronoiColors.length <= i) {
                this.voronoiColors.push(randomColor());
            }
            this.drawPath(path, this.voronoiColors[i]);
        }
    }

    drawPoints() {
        const nodes = this.triangulation.getNodes();
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (this.options.showNodes) {
                this.drawPoint(node, 5, "black", this.canvas);
            }
            if (this.options.showNodesNumbers) {
                this.drawText(i, node[0], node[1]);
            }
        }
    }

    clearCanvas() {
        const context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPoint(node) {
        const context = this.canvas.getContext('2d');
        context.fillStyle = "black";
        context.beginPath();
        context.arc(...this.transform(node, this.scale, this.xMin, this.yMin), this.options.nodeSize, 0, 2 * Math.PI);
        context.fill();
    }

    drawEdge(A, B, dashed=false) {
        const context = this.canvas.getContext("2d");
        context.strokeStyle = "gray";
        context.beginPath();
        if (dashed) {
            context.setLineDash([5, 15]);
        }
        else {
            context.setLineDash([]);
        }
        context.moveTo(...this.transform(A, this.scale, this.xMin, this.yMin));
        context.lineTo(...this.transform(B, this.scale, this.xMin, this.yMin));
        context.stroke();
    }

    drawText(text, x, y) {
        const context = this.canvas.getContext("2d");
        context.fillStyle = "black";
        context.font = `${this.options.fontSize}px sans-serif`;
        context.fillText(text, ...this.transform([x, y], this.scale, this.xMin, this.yMin));
    }

    drawPath(path, color) {
        const context = this.canvas.getContext("2d");
        context.beginPath();
        context.moveTo(...this.transform(path[0], this.scale, this.xMin, this.yMin));
        for (let i = 1; i < path.length; i++) {
            context.lineTo(...this.transform(path[i], this.scale, this.xMin, this.yMin));
        }
        context.fillStyle = color;
        context.fill();
    }

    sizeAdapt() {
        const [xMin, xMax, yMin, yMax] = minAndMaxNodes(this.nodes);
        const xRange = xMax - xMin;
        const yRange = yMax - yMin;
        const scale = Math.min(this.canvas.width/xRange, this.canvas.height/yRange);

        this.scaledNodes = [];
        for (const node of this.nodes) {
            this.scaledNodes.push(this.transform(node, scale, xMin, yMin));
        }

        this.scale = scale * 0.97;
        this.xMin = xMin;
        this.yMin = yMin;
        this.xMax = xMax;
        this.yMax = yMax;
    }

    transform(pos, scale, xMin, yMin) {
        return [this.offset+(pos[0]-xMin)*scale, this.offset+(pos[1]-yMin)*scale];
    }
}