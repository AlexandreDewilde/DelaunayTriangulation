class Canvas {
    constructor(nodes, algorithm, canvas) {
        this.canvas = canvas;
        this.nodes = nodes;
        this.offset = 0;

        this.sizeAdapt();
        window.addEventListener("resize", () => this.sizeAdapt());

        const drawingMethods = {
            drawPoint: this.drawPoint.bind(this),
            drawEdge: this.drawEdge.bind(this),
            drawText: this.drawText.bind(this),
            drawPath: this.drawPath.bind(this),
        }
        this.triangulation = new algorithm(this.nodes, drawingMethods);
    }

    start() {
        this.triangulation.triangulate();
        setInterval(this.draw.bind(this), 1000/60);
    }

    startDemo() {
        this.triangulation.triangulate(1000);

        setInterval(this.draw.bind(this), 1000/60);
    }

    draw() {
        this.clearCanvas();
        this.triangulation.draw();
    }


    clearCanvas() {
        const context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPoint(node) {
        const size = 5;
        const context = this.canvas.getContext('2d');
        context.fillStyle = "black";
        context.beginPath();
        context.arc(...this.transform(node, this.scale, this.xMin, this.yMin), size, 0, 2 * Math.PI);
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
        context.font = "20px sans-serif";
        context.fillText(text, x, y);
    }

    drawPath(path) {
        const colors = ["red", "blue", "orange", "black"];
        const color = colors[3];//colors[Math.floor(Math.random() * (colors.length-1))];
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
        let xMin = Number.MAX_VALUE;
        let yMin = Number.MAX_VALUE;
        let xMax = Number.MIN_VALUE;
        let yMax = Number.MIN_VALUE;
        for (const node of this.nodes) {
            xMax = Math.max(xMax, node[0]);
            xMin = Math.min(xMin, node[0]);
            yMax = Math.max(yMax, node[1]);
            yMin = Math.min(yMin, node[1]);
        }
        const xRange = xMax - xMin;
        const yRange = yMax - yMin;
        const scale = Math.min(this.canvas.width/xRange, this.canvas.height/yRange);

        this.scaledNodes = [];
        for (const node of this.nodes) {
            this.scaledNodes.push(this.transform(node, scale, xMin, yMin));
        }
        this.scale = scale;
        this.xMin = xMin;
        this.yMin = yMin;
        this.xMax = xMax;
        this.yMax = yMax;
    }

    transform(pos, scale, xMin, yMin) {
        return [this.offset+(pos[0]-xMin)*scale, this.offset+(pos[1]-yMin)*scale];
    }
}