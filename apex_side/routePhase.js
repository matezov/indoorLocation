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

/* Összeköti két utat */
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

function doAllThingsWithRoutes() {
    for (let i = 0; i < routes.length; ++i) {
        let nearest = searchNearestPoint(routes[i], i);
        routes[i] = connectRoutes(routes[i], nearest);
    }
}