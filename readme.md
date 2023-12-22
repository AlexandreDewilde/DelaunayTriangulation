# Numerical project final assignement

## [User interface](https://alexandredewilde.github.io/DelaunayTriangulation/)

The site is avaiable [here](https://alexandredewilde.github.io/DelaunayTriangulation/)

### Home page & methods pages

Thoses pages demonstrate the bowyer watson algorithm,

* You can generate random points or load node files via drag and drop on the canvas

* Create the corresponding triangulation and Voronoi diagram.

* Choose differents parameters for the demo like nodes sizes, demo speed...

* Download the animation gif (very slow be patient ;) )

* By default, the program uses an efficient algorithm. If you would like to choose

* Demo can be a bit delicate, some behavior can crash, if site is not responding reload the page

You can customize your experience with several parameters:

* Demo Delay: Adjust the speed of the demonstration.

* Number of Points: Set the desired number of points using the slider next to the "Generate Random Points" button.

* Node and Font Size: To ensure readability varies with the number of nodes, you can adjust these sizes.

Additionally, you have the option to display or hide various elements:

* Show or hide the nodes.

* Display or omit the indices of the nodes.

* Choose whether to show the triangulation lines.

### Comparison page

Charts with the timings for the differents algorithms

## Explanation of the alogrithm

### Naive bowyer watson
The Bowyer-Watson algorithm is employed to generate the Delaunay Triangulation, from this triangulation we can get the Voronoi diagrams which is the [dual graph](https://en.wikipedia.org/wiki/Dual_graph) of it.

The Delaunay triangulation divides a set of points into triangles, ensuring that the circumscribed circle of each triangle does not contain any other points from the input set. The Voronoi diagram partitions the plane into regions associated with individual input points, encompassing all points closer to that specific point than to any other.

Here's a concise description of the steps:

Delaunay Triangulation:

1. Create a "supertriangle" encompassing all points based on the minimal and maximal x and y coordinates of the input set.
2. Insert points one by one into the triangulation, identifying the affected triangle for each point. (find the delaunay cavity)
3. Remove the affected triangles and create new triangles by connecting the released edge with the newly inserted point.
4. Once all points are added, remove triangles sharing an edge with the supertriangle to obtain the Delaunay triangulation.

Voronoi Diagram Construction:

1. Find the circumcenter of all triangles in the Delaunay triangulation.
2. Construct Voronoi edges by creating perpendicular bisectors of the edges of the Delaunay triangulation.
3. The intersection of these edges creates Voronoi vertices.
4. Connect Voronoi vertices to form Voronoi cells, which are polygons representing the Voronoi diagram. To find the polygon use polar sort.

The naive version of the bowyer watson algorithm has a complexity of O(n^2) with n the number of points.

### Efficient Bowyer-Watson

We implemented an optimized version of the Bowyer-Watson algorithm, called "Efficient Bowyer-Watson," to enhance its performance.

The are a lot of differents optimizations to increase performance of our previous algorithm:

* New datastructure
    * For face/triangle: references to adjancent triangles

* To find the affected triangle by insertion of a new point (find delaunay cavity), we can take advantage of our new datastructure, we just need to find a face affected and then search recursively around the affected faces

* Points insertions order: we can change the order of inserted points by using hilbert sort; this way the points are inserted in a precise order, when we search for a face affected by insertion of a new point we can start from the previous inserted one, it will be near the previous face.

## Deal with edge cases

Because it's geometry there are always edges cases :(

* When it's colinear there is no triangulation, our algorithm just draw a line

* When it's concyclic, there are more than one triangulation, so our algorithm choose arbitrarily the triangulation.

* When points are not bounded our algorithms adapt the super triangle to the min and max coordinates

## Speed and complexity difference

We can clearly see experimentally the difference between both implentation on the [comparison page](https://alexandredewilde.github.io/DelaunayTriangulation/pages/comparison.html), the efficient one is much more faster than the naive one

We cannot really see a big difference one the one with hilbert sort and no hilbert sort, it can be due to the hilbert sort implementation, the overhead is slow.









