function resizeCanvas(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    let c = array.length;
    while(c) {
        const b = Math.random() * c-- | 0;
        [array[c], array[b]] = [array[b], array[c]];
    }
}

function randomColor() {
    // Chatgpt generated the following lists...
    const colors = [
        "#FF6B6B", "#70D6FF", "#FFD166", "#45A29E", "#FF6347",  // Row 1
        "#536DFE", "#FFCE56", "#FF9F43", "#7ED6DF", "#FF5E57",  // Row 2
        "#80DEEA", "#FFB6C1", "#94A6B8", "#FF7F50", "#77B6EA",  // Row 3
        "#FFD700", "#B19CD9", "#32CD32", "#FF69B4", "#87CEEB",  // Row 4
        "#FF8C00", "#6495ED", "#DC143C", "#00FA9A", "#9932CC",  // Row 5
        "#00CED1", "#DAA520", "#8A2BE2", "#008080", "#FF4500",  // Row 6
        "#00BFFF", "#9370DB", "#48D1CC", "#CD853F", "#4682B4",  // Row 7
        "#FF1493", "#1E90FF", "#FFD700"                          // Additional Colors
      ];



    return colors[Math.floor(Math.random() * colors.length)];
}


function minAndMaxNodes(nodes) {
    let xMin = Number.MAX_VALUE;
    let xMax = Number.MIN_VALUE;
    let yMin = Number.MAX_VALUE;
    let yMax = Number.MIN_VALUE;
    for (let i = 0; i < nodes.length; i++) {
        xMin = Math.min(xMin, nodes[i][0]);
        xMax = Math.max(xMax, nodes[i][0]);
        yMin = Math.min(yMin, nodes[i][1]);
        yMax = Math.max(yMax, nodes[i][1]);
    }
    return [xMin, xMax, yMin, yMax];
}