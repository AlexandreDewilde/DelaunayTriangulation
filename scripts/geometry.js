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

// https://perso.uclouvain.be/vincent.legat/documents/meca2170/meshGenerationBook.pdf
function hilbertCoord(x, y, x0, y0, xRed, yRed, xBlue, yBlue, d) {
    let coord = 0;
    for (let i = 0; i < d / 2; i++) {
        const coordRed = (x - x0) * xRed + (y - y0) * yRed;
        const coordBlue = (x - x0) * xBlue + (y -y0) * yBlue;
        xRed /= 2; yRed /= 2; xBlue /= 2; yBlue /= 2;
        if (coordRed <= 0 && coordBlue <= 0) {
            x0 -= (xBlue + xRed);
            y0 -= (yBlue + yRed);
            [xRed, yRed, xBlue, yBlue] = [xBlue, yBlue, xRed, yRed];
        }
        else if (coordRed <= 0 && coordBlue >= 0) {
            x0 += xBlue - xRed;
            y0 += yBlue - yRed;
            coord |= (1 << (d - i)*2);
        }
        else if (coordRed >= 0 && coordBlue >= 0) {
            x0 += xBlue + xRed;
            y0 += yBlue + yRed;
            coord |= (1 << (d - i)*2+1)
        }
        else {
            x0 += -xBlue + xRed;
            y0 += -yBlue + yRed;
            xBlue = -xBlue;
            yBlue = -yBlue;
            xRed = -xRed;
            yRed = -yRed;
            coord |= (1 << (d - i)*2) | (1 << (d - i)*2 + 1)
        }
    }
    return coord
}

function polarSortCompare(a, b, origin) {
    const ac = [...a];
    const bc = [...b];
    ac[0] -= origin[0]; ac[1] -= origin[1];
    bc[0] -= origin[0]; bc[1] -= origin[1];
    const halfA = ac[1] > 0 || (ac[1] == 0 && ac[0] >= 0);
    const halfB = bc[1] > 0 || (bc[1] == 0 && bc[0] >= 0);
    return halfA == halfB ? ac[0] * bc[1] - ac[1] * bc[0] : halfA - halfB;
}

function areCollinear(point1, point2, point3) {
    // Calculate the slopes between pairs of points
    const slope1 = (point2[1] - point1[1]) / (point2[0] - point1[0]);
    const slope2 = (point3[1] - point2[1]) / (point3[0] - point2[0]);
    console.log(slope1, slope2)

    // Check if the slopes are equal (or if they are both infinite for vertical lines)
    return slope1 === slope2 || (isNaN(slope1) && isNaN(slope2));
}

function parseCollinear(nodes){
    // regarde pour tous les triplet de noeud
    n = 0

    for(let i=0; i<nodes.length-2; i++){
        for(let j=i+1; j<nodes.length-1; j++){
            for(let k=j+1; k<nodes.length; k++){
                if (areCollinear(nodes[i], nodes[j], nodes[k])){
                    console.log('nodes ' + i +', '+j +',' +k +' are collinear')
                    n+=1
                } else{
                    console.log('nodes ' + i +', '+j +',' +k +' are  not collinear')
                }
            }
        }
    }
    console.log(n)
}
//encore tester pour d'autre cas puis faire la partie qui remplace par la moyenne des deux ou jsp
//console.log(nodeData)


