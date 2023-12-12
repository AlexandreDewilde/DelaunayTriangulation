class Canvas {
    constructor(nodes, algorithm, canvas) {
        this.canvas = canvas;
        this.nodes = nodes;
        this.triangulation = new algorithm(this.nodes, this.drawPoint.bind(this), this.drawEdge.bind(this));
        this.offset = 0;
    }

    start() {
        this.sizeAdapt();
        window.addEventListener("resize", () => this.sizeAdapt());
        setInterval(this.draw.bind(this), 1000/60);
    }

    draw() {
        this.clearCanvas();
        this.triangulation.draw(this.scaledNodes);
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
        context.arc(node[0], node[1], size, 0, 2 * Math.PI);
        context.fill();
    }

    drawEdge(A, B) {
        const context = this.canvas.getContext("2d");
        context.strokeStyle = "gray";
        context.beginPath();
        context.moveTo(A[0], A[1]);
        context.lineTo(B[0], B[1]);
        context.stroke();
    }

    drawText(text, x, y) {
        const context = this.canvas.getContext("2d");
        context.font = "20px sans-serif";
        context.fillText(text, x, y);
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
    }

    transform(pos, scale, xMin, yMin) {
        return [this.offset+(pos[0]-xMin)*scale, this.offset+(pos[1]-yMin)*scale];
    }
}