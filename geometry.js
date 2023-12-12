function computeDst(node1, node2) {
    return Math.sqrt((node1[0] - node2[0]) * (node1[0] - node2[0]) + (node1[1] - node2[1]) * (node1[1] - node2[1]));
}

function getEdges(triangle) {
    return [[triangle[0], triangle[1]], [triangle[1], triangle[2]], [triangle[2], triangle[0]]];
}

function getEdgeString(edge) {
    return edge[0] + "_" + edge[1];
}

function getEdgesString(triangle) {
    const edges = getEdges(triangle);
    const res = [];
    for (const edge of edges) {
        res.push(getEdgeString(edge));
    }
    return res;
}

function isCircum(triangle, point, nodes) {
    const center = computeCircum(triangle, nodes);
    return computeDst(nodes[point], center) < computeDst(center, nodes[triangle[0]]);
}

// https://stackoverflow.com/questions/56224824/how-do-i-find-the-circumcenter-of-the-triangle-using-python-without-external-lib
function computeCircum(triangle, nodes) {
    const a = nodes[triangle[0]];
    const b = nodes[triangle[1]];
    const c = nodes[triangle[2]];
    const ah = a[0] * a[0] + a[1] * a[1];
    const bh = b[0] * b[0] + b[1] * b[1];
    const ch = c[0] * c[0] + c[1] * c[1];
    const D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]))
    return [1 / D * (ah * (b[1] - c[1]) + bh * (c[1] - a[1]) + ch * (a[1] - b[1])),
                        1 / D * (ah * (c[0] - b[0]) + bh * (a[0] - c[0]) + ch * (b[0] - a[0]))];
}