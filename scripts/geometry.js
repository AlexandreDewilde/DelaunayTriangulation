function computeDst(node1, node2) {
    return Math.sqrt((node1[0] - node2[0]) * (node1[0] - node2[0]) + (node1[1] - node2[1]) * (node1[1] - node2[1]));
}

// https://stackoverflow.com/questions/56224824/how-do-i-find-the-circumcenter-of-the-triangle-using-python-without-external-lib
function computeCircum(coords) {
    const [a, b, c] = coords;
    const ah = a[0] * a[0] + a[1] * a[1];
    const bh = b[0] * b[0] + b[1] * b[1];
    const ch = c[0] * c[0] + c[1] * c[1];
    const D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]))
    return [1 / D * (ah * (b[1] - c[1]) + bh * (c[1] - a[1]) + ch * (a[1] - b[1])),
                        1 / D * (ah * (c[0] - b[0]) + bh * (a[0] - c[0]) + ch * (b[0] - a[0]))];
}

function orientationTest(nodeA, nodeB, nodeC) {
    // TODO deal with colinear points
    // One way is: https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
    return (nodeB[1] - nodeA[1]) * (nodeC[0] * nodeB[0]) - (nodeB[0] - nodeA[0]) * (nodeC[1] * nodeB[1]);
}