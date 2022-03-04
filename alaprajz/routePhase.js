
/* Kiegyenesíti az útvonalakat */
function squareRoutes() {

	for (let i = 0; i < routes.length; ++i) {
		if (getDirection(routes[i]) === 'vertical') {
            routes[i].secondPoint.x = routes[i].firstPoint.x;
            routes[i].direction = 'vertical';
		} else {
            routes[i].secondPoint.y = routes[i].firstPoint.y;
            routes[i].direction = 'horizontal';
		}
    }
    
}

/* Kiegyenesíti az útvonalat */
function squareRoute(route) {

    let tmp_route = route;
    if (getDirection(tmp_route) === 'vertical') {
        tmp_route.secondPoint.x = tmp_route.firstPoint.x;
        tmp_route.direction = 'vertical';
    } else {
        tmp_route.secondPoint.y = tmp_route.firstPoint.y;
        tmp_route.direction = 'horizontal';
    }
    return tmp_route;
}

/* Visszaadja a legközelebbi út vég/kezdőpontját a megadott útnak */
function searchNearestPoint(route, index) {
    if (routes.length <= 1) return;
    let nearest = getDistance(route.firstPoint, routes[0].firstPoint) < getDistance(route.firstPoint, routes[0].secondPoint)
                    ? routes[0].firstPoint : routes[0].secondPoint;
    for (let i = 0; i < routes.length; ++i) {
        if (i !== index) {
            if (getDistance(route.firstPoint, nearest) > getDistance(route.firstPoint, routes[i].firstPoint)) {
                nearest = routes[i].firstPoint;
            }
            if (getDistance(route.firstPoint, nearest) > getDistance(route.firstPoint, routes[i].secondPoint)) {
                nearest = routes[i].secondPoint;
            }
        }
    }
    console.log(nearest)
    return nearest;
}

/* Összeköt két utat */
function connectRoutes(curr_route, nearest_route) {
    if (routes.length <= 1) return;

    let route = curr_route;
    console.log(curr_route);

    console.log(curr_route.direction)

    if (curr_route.direction === 'vertical') {
        route.firstPoint = nearest_route;
        route.secondPoint.x = nearest_route.x;
    } else {
        route.firstPoint = nearest_route;
        route.secondPoint.y = nearest_route.y;
    }
    console.log(route);

    return route;
}

/*  */
function doAllThingsWithRoutes() {
    for (let i = 0; i < routes.length; ++i) {
        let nearest = searchNearestPoint(routes[i], i);
        routes[i] = connectRoutes(routes[i], nearest);
    }
}

let graph = {
    peaks: [],
    edges: [],
    scaled_in: {cw: canvas.width, ch: canvas.height, scale: scale_permanent}
};

let graph_id = 0;

function addPeakToGraph(point) {
    let nearestWalls = searchNearestWallsForPeak(point);
    graph.peaks.push({id: graph_id, x: point.x, y: point.y, nw: nearestWalls});
    console.log({id: graph_id, x: point.x, y: point.y, nw: nearestWalls});
    graph_id += 1;
}

function connectPeaks(peak1, peak2) {
    graph.edges.push({from: peak1, to: peak2});
}

function searchNearestWallsForPeak(pos) {

    let distH;
    let distV;
    let mostLeft;
    let mostTop;

    if (coords[0].direction === 'vertical') {
        distH = getDistance({ x: 0, y: coords[1].firstPoint.y }, { x: 0, y: pos.y });
        distV = getDistance({ x: coords[0].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
        mostLeft = {wallindex: 0, distance: distV / scale_permanent};
        mostTop = {wallindex: 1, distance: distH / scale_permanent}; 
    } else {
        distH = getDistance({ x: 0, y: coords[0].firstPoint.y }, { x: 0, y: pos.y });
        distV = getDistance({ x: coords[1].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
        mostLeft = {wallindex: 1, distance: distV / scale_permanent};
        mostTop = {wallindex: 0, distance: distH / scale_permanent}; 
    }

    
    for (let i = 2; i < coords.length; ++i) {
        if (coords[i].direction === 'vertical') {
            if (coords[i].firstPoint.x < coords[mostLeft.wallindex].firstPoint.x) {
                distV = getDistance({ x: coords[i].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
                mostLeft = {wallindex: i, distance: distV / scale_permanent};
            }
        } else if (coords[i].direction === 'horizontal') {
            if (coords[i].firstPoint.y < coords[mostTop.wallindex].firstPoint.y) {
                distV = getDistance({ x: coords[i].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
                mostLeft = {wallindex: i, distance: distV / scale_permanent};
            }
        }
    }

    return {hw: mostTop, vw: mostLeft};   

}