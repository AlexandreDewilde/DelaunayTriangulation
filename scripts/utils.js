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