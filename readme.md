# Numerical project final assignement
## Explanation of the site 
## Home page 
On this page, you can generate random points and create the corresponding triangulation and Voronoi diagram. By default, the program uses an efficient algorithm. If you prefer to use a simpler, less efficient method, you can switch to the naive version by changing the selected algorithm.

You can customize your experience with several parameters:

Demo Delay: Adjust the speed of the demonstration.
Number of Points: Set the desired number of points using the slider next to the "Generate Random Points" button.
Node and Font Size: To ensure readability varies with the number of nodes, you can adjust these sizes.
Additionally, you have the option to display or hide various elements:

Show or hide the nodes.
Display or omit the indices of the nodes.
Choose whether to show the triangulation lines.
For those interested in generating specific triangulations, you can upload a file containing the coordinates of the nodes.

## Explanation of the alogrithm

### Naive bowyer watson
The Bowyer-Watson algorithm is employed to generate both Delaunay Triangulation and Voronoi diagrams. The Delaunay triangulation divides a set of points into triangles, ensuring that the circumscribed circle of each triangle does not contain any other points from the input set. Simultaneously, the Voronoi diagram partitions the plane into regions associated with individual input points, encompassing all points closer to that specific point than to any other.

Here's a concise description of the steps:

Delaunay Triangulation:

1. Create a "supertriangle" encompassing all points based on the minimal and maximal x and y coordinates of the input set.
2. Insert points one by one into the triangulation, identifying the affected triangle for each point.
3. Remove the affected triangles and create new triangles by connecting the released edge with the newly inserted point.
4. Once all points are added, remove triangles sharing an edge with the supertriangle to obtain the Delaunay triangulation.

Voronoi Diagram Construction:

1. Find the circumcenter of all triangles in the Delaunay triangulation.
2. Construct Voronoi edges by creating perpendicular bisectors of the edges of the Delaunay triangulation.
3. The intersection of these edges creates Voronoi vertices.
4. Connect Voronoi vertices to form Voronoi cells, which are polygons representing the Voronoi diagram.

The naive version of the bowyer watson algorithm has a complexity of O(n^2) with n the number of points. 

### Efficient Bowyer-Watson 
We implemented an optimized version of the Bowyer-Watson algorithm, called "Efficient Bowyer-Watson," to enhance its performance. The key improvement lies in using Hilbert curve sorting for the points. The Hilbert curve is a space-filling curve that visits every point in a way that keeps nearby points close to each other. By sorting points along the Hilbert curve, we ensure that consecutive points are in close proximity, preserving data locality.

In our algorithm, this improved data locality is crucial for reducing the number of local searches needed to find the next invalid triangle during point insertion. As a result, the number of searches no longer increases with the number of points, leading to an overall complexity of O(nlogn). This optimization significantly improves the efficiency of the triangulation process, especially for larger datasets.


## Comparison page 
You can  run a random time test. You then obtain 2 graphs.

On the first graph, we see the difference in complexity of the efficient and naive version, we  clearly see the n^2 and nlog(n) tendency. 
On the second graph, we compare the efficient ?

??? 









