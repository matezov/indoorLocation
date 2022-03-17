/* Ablakhoz igazítja a falakat */
function scalePlan() {
    let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
	plan.walls.forEach(coord => {
		switch (coord.direction) {
			case 'North':
				n += coord.size;
				break;
			case 'East':
				e += coord.size;
				break;
			case 'South':
				s += coord.size;
				break;
			case 'West':
				w += coord.size;
				break;
		}
	});
    /* const stmp1 = canvas.height * 0.9 / s;
    const stmp2 = canvas.width * 0.95 / e; */
    const stmp1 = canvas.height * 0.8 / s;
	const stmp2 = canvas.width * 0.95 / e;
	scale = stmp1 < stmp2 ? stmp1 : stmp2;

	// most left position
	let mostLeft = plan.walls[0];
	let mlIndex = 0;

	let index = 0;
	plan.walls.forEach(coord => {
		if (coord.firstPoint.x < mostLeft.firstPoint.x || coord.secondPoint.x < mostLeft.firstPoint.x ||
			coord.firstPoint.x < mostLeft.secondPoint.x || coord.secondPoint.x < mostLeft.secondPoint.x) {
			mostLeft = coord;
			mlIndex = index;
		}
		++index;
	});

	switch (plan.walls[mlIndex].direction) {
		case 'North':
			plan.walls[mlIndex].firstPoint.x = canvas.width * 0.025;
			plan.walls[mlIndex].firstPoint.y = 0;
			plan.walls[mlIndex].secondPoint.x = plan.walls[mlIndex].firstPoint.x;
			plan.walls[mlIndex].secondPoint.y = plan.walls[mlIndex].firstPoint.y - scale * plan.walls[mlIndex].size;
			break;
		case 'South':
			plan.walls[mlIndex].firstPoint.x = canvas.width * 0.025;
			plan.walls[mlIndex].firstPoint.y = 0;
			plan.walls[mlIndex].secondPoint.x = plan.walls[mlIndex].firstPoint.x;
			plan.walls[mlIndex].secondPoint.y = plan.walls[mlIndex].firstPoint.y + scale * plan.walls[mlIndex].size;
			break;
		case 'East':
			plan.walls[mlIndex].secondPoint.x = canvas.width * 0.025;
			plan.walls[mlIndex].secondPoint.y = 0;
			plan.walls[mlIndex].firstPoint.x = plan.walls[mlIndex].secondPoint.x + scale * plan.walls[mlIndex].size;
			plan.walls[mlIndex].firstPoint.y = plan.walls[mlIndex].secondPoint.y;
			break;
		case 'West':
			plan.walls[mlIndex].firstPoint.x = canvas.width * 0.025;
			plan.walls[mlIndex].firstPoint.y = 0;
			plan.walls[mlIndex].secondPoint.x = plan.walls[mlIndex].firstPoint.x + scale * plan.walls[mlIndex].size;
			plan.walls[mlIndex].secondPoint.y = plan.walls[mlIndex].firstPoint.y;
			break;
	}
	for (let i = mlIndex + 1; i < plan.walls.length; ++i) {
		if (plan.walls[i].direction === 'North') {
			plan.walls[i].firstPoint = plan.walls[i - 1].secondPoint;
			plan.walls[i].secondPoint.x = plan.walls[i].firstPoint.x
			plan.walls[i].secondPoint.y = plan.walls[i].firstPoint.y - scale * plan.walls[i].size;
		} else if (plan.walls[i].direction === 'South') {
			plan.walls[i].firstPoint = plan.walls[i - 1].secondPoint;
			plan.walls[i].secondPoint.x = plan.walls[i].firstPoint.x;
			plan.walls[i].secondPoint.y = plan.walls[i].firstPoint.y + scale * plan.walls[i].size;
		} else if (plan.walls[i].direction === 'East') {
			plan.walls[i].firstPoint = plan.walls[i - 1].secondPoint;
			plan.walls[i].secondPoint.x = plan.walls[i].firstPoint.x + scale * plan.walls[i].size;
			plan.walls[i].secondPoint.y = plan.walls[i].firstPoint.y;
		} else if (plan.walls[i].direction === 'West') {
			plan.walls[i].firstPoint = plan.walls[i - 1].secondPoint;
			plan.walls[i].secondPoint.x = plan.walls[i].firstPoint.x - scale * plan.walls[i].size;
			plan.walls[i].secondPoint.y = plan.walls[i].firstPoint.y;
		}
	}
	for (let i = mlIndex - 1; i >= 0; --i) {
		if (plan.walls[i].direction === 'North') {
			plan.walls[i].secondPoint = plan.walls[i + 1].firstPoint;
			plan.walls[i].firstPoint.x = plan.walls[i].secondPoint.x
			plan.walls[i].firstPoint.y = plan.walls[i].secondPoint.y + scale * plan.walls[i].size;
		} else if (plan.walls[i].direction === 'South') {
			plan.walls[i].secondPoint = plan.walls[i + 1].firstPoint;
			plan.walls[i].firstPoint.x = plan.walls[i].secondPoint.x;
			plan.walls[i].firstPoint.y = plan.walls[i].secondPoint.y - scale * plan.walls[i].size;
		} else if (plan.walls[i].direction === 'East') {
			plan.walls[i].secondPoint = plan.walls[i + 1].firstPoint;
			plan.walls[i].firstPoint.x = plan.walls[i].secondPoint.x - scale * plan.walls[i].size;
			plan.walls[i].firstPoint.y = plan.walls[i].secondPoint.y;
		} else if (plan.walls[i].direction === 'West') {
			plan.walls[i].secondPoint = plan.walls[i + 1].firstPoint;
			plan.walls[i].firstPoint.x = plan.walls[i].secondPoint.x + scale * plan.walls[i].size;
			plan.walls[i].firstPoint.y = plan.walls[i].secondPoint.y;
		}
	}
	plan.walls[plan.walls.length - 1].secondPoint = plan.walls[0].firstPoint;

	let topPos = plan.walls[0];

	index = 0;
	plan.walls.forEach(coord => {
		if (coord.firstPoint.y < topPos.firstPoint.y || coord.secondPoint.y < topPos.firstPoint.y ||
			coord.firstPoint.y < topPos.secondPoint.y || coord.secondPoint.y < topPos.secondPoint.y) {
			topPos = coord;
		}
		++index;
	});

	const topY = topPos.firstPoint.y < topPos.secondPoint.y ?
		(Math.abs(topPos.firstPoint.y) + canvas.height * 0.85 * 0.0375) : (Math.abs(topPos.secondPoint.y) + canvas.height * 0.85 * 0.0375);


	for (let i = 0; i < plan.walls.length; ++i) {
		plan.walls[i].firstPoint.y = plan.walls[i].firstPoint.y + topY;
		//plan.walls[i].secondPoint.y = plan.walls[i].secondPoint.y + topY; ??????????? miért csinálja meg e nélkül ?????
	}
	
	let toSlide;
	if (stmp1 < stmp2) {
		toSlide = (stmp2 * e - scale * e) / 2;
		for (let i = 0; i < plan.walls.length; ++i) {
			plan.walls[i].firstPoint.x = plan.walls[i].firstPoint.x + toSlide;
		}
	} else {
		toSlide = (stmp1 * s - stmp2 * s) / 2;
		for (let i = 0; i < plan.walls.length; ++i) {
			plan.walls[i].firstPoint.y = plan.walls[i].firstPoint.y + toSlide;
		}
	}

	for (let i = 0; i < plan.walls.length; ++i) {
		for (let j = 0; j < plan.beacons.length; ++j) {
			if (plan.beacons[j].wall === i) {
				switch (plan.walls[i].direction) {
					case 'North':
						plan.beacons[j].x = plan.walls[i].firstPoint.x;
						plan.beacons[j].y = plan.walls[i].secondPoint.y + plan.beacons[j].pos * scale;
						break;
					case 'South':
						plan.beacons[j].x = plan.walls[i].firstPoint.x;
						plan.beacons[j].y = plan.walls[i].firstPoint.y + plan.beacons[j].pos * scale;
						break;
					case 'East':
						plan.beacons[j].x = plan.walls[i].firstPoint.x + plan.beacons[j].pos * scale;
						plan.beacons[j].y = plan.walls[i].firstPoint.y;
						break;
					case 'West':
						plan.beacons[j].x = plan.walls[i].secondPoint.x + plan.beacons[j].pos * scale;
						plan.beacons[j].y = plan.walls[i].firstPoint.y;
						break;
				}
			}
		}
	}
}

/* Ablakhoz igazítja a berendezéseket */
function scaleFurnitures() {

    for (let i = 0; i < plan.furnitures.length; ++i) {

        let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
        plan.furnitures[i].data.forEach(f => {
            switch (f.direction) {
                case 'North':
                    n += parseFloat(f.size);
                    break;
                case 'East':
                    e += parseFloat(f.size);
                    break;
                case 'South':
                    s += parseFloat(f.size);
                    break;
                case 'West':
                    w += parseFloat(f.size);
                    break;
            }
        });

        const lor = leftOrRight(plan.furnitures[i].distance_from_walls.vertical);
        const vind = plan.furnitures[i].distance_from_walls.vertical.furniture_index;

        if (lor === 'left') {
            switch (plan.furnitures[i].data[vind].direction) {
                case 'North':
                    plan.furnitures[i].data[vind].firstPoint.x = plan.walls[plan.furnitures[i].distance_from_walls.vertical.wall_index].secondPoint.x + scale * plan.furnitures[i].distance_from_walls.vertical.dist;
                    plan.furnitures[i].data[vind].firstPoint.y = n * scale;
                    plan.furnitures[i].data[vind].secondPoint.x = plan.furnitures[i].data[vind].firstPoint.x;
                    plan.furnitures[i].data[vind].secondPoint.y = plan.furnitures[i].data[vind].firstPoint.y - scale * plan.furnitures[i].data[vind].size;
                    break; 
                case 'South':
                    plan.furnitures[i].data[vind].firstPoint.x = plan.walls[plan.furnitures[i].distance_from_walls.vertical.wall_index].secondPoint.x + scale * plan.furnitures[i].distance_from_walls.vertical.dist;
                    plan.furnitures[i].data[vind].firstPoint.y = 0;
                    plan.furnitures[i].data[vind].secondPoint.x = plan.furnitures[i].data[vind].firstPoint.x;
                    plan.furnitures[i].data[vind].secondPoint.y = plan.furnitures[i].data[vind].firstPoint.y + scale * plan.furnitures[i].data[vind].size;
                    break;
            }
        } else if (lor === 'right') {
            switch (plan.furnitures[i].data[vind].direction) {
                case 'North':
                    plan.furnitures[i].data[vind].firstPoint.x = plan.walls[plan.furnitures[i].distance_from_walls.vertical.wall_index].secondPoint.x - scale * plan.furnitures[i].distance_from_walls.vertical.dist;
                    plan.furnitures[i].data[vind].firstPoint.y = n * scale;
                    plan.furnitures[i].data[vind].secondPoint.x = plan.furnitures[i].data[vind].firstPoint.x;
                    plan.furnitures[i].data[vind].secondPoint.y = plan.furnitures[i].data[vind].firstPoint.y - scale * plan.furnitures[i].data[vind].size;
                    break; 
                case 'South':
                    plan.furnitures[i].data[vind].firstPoint.x = plan.walls[plan.furnitures[i].distance_from_walls.vertical.wall_index].secondPoint.x - scale * plan.furnitures[i].distance_from_walls.vertical.dist;
                    plan.furnitures[i].data[vind].firstPoint.y = 0;
                    plan.furnitures[i].data[vind].secondPoint.x = plan.furnitures[i].data[vind].firstPoint.x;
                    plan.furnitures[i].data[vind].secondPoint.y = plan.furnitures[i].data[vind].firstPoint.y + scale * plan.furnitures[i].data[vind].size;
                    break;
            }
        }

       for (let j = vind + 1; j < plan.furnitures[i].data.length; ++j) {
            if (plan.furnitures[i].data[j].direction === 'North') {
                plan.furnitures[i].data[j].firstPoint = plan.furnitures[i].data[j - 1].secondPoint;
                plan.furnitures[i].data[j].secondPoint.x = plan.furnitures[i].data[j].firstPoint.x
                plan.furnitures[i].data[j].secondPoint.y = plan.furnitures[i].data[j].firstPoint.y - scale * plan.furnitures[i].data[j].size;
            } else if (plan.furnitures[i].data[j].direction === 'South') {
                plan.furnitures[i].data[j].firstPoint = plan.furnitures[i].data[j - 1].secondPoint;
                plan.furnitures[i].data[j].secondPoint.x = plan.furnitures[i].data[j].firstPoint.x;
                plan.furnitures[i].data[j].secondPoint.y = plan.furnitures[i].data[j].firstPoint.y + scale * plan.furnitures[i].data[j].size;
            } else if (plan.furnitures[i].data[j].direction === 'East') {
                plan.furnitures[i].data[j].firstPoint = plan.furnitures[i].data[j - 1].secondPoint;
                plan.furnitures[i].data[j].secondPoint.x = plan.furnitures[i].data[j].firstPoint.x + scale * plan.furnitures[i].data[j].size;
                plan.furnitures[i].data[j].secondPoint.y = plan.furnitures[i].data[j].firstPoint.y;
            } else if (plan.furnitures[i].data[j].direction === 'West') {
                plan.furnitures[i].data[j].firstPoint = plan.furnitures[i].data[j - 1].secondPoint;
                plan.furnitures[i].data[j].secondPoint.x = plan.furnitures[i].data[j].firstPoint.x - scale * plan.furnitures[i].data[j].size;
                plan.furnitures[i].data[j].secondPoint.y = plan.furnitures[i].data[j].firstPoint.y;
            }
        }
        for (let j = vind - 1; j >= 0; --j) {
            if (plan.furnitures[i].data[j].direction === 'North') {
                plan.furnitures[i].data[j].secondPoint = plan.furnitures[i].data[j + 1].firstPoint;
                plan.furnitures[i].data[j].firstPoint.x = plan.furnitures[i].data[j].secondPoint.x
                plan.furnitures[i].data[j].firstPoint.y = plan.furnitures[i].data[j].secondPoint.y + scale * plan.furnitures[i].data[j].size;
            } else if (plan.furnitures[i].data[j].direction === 'South') {
                plan.furnitures[i].data[j].secondPoint = plan.furnitures[i].data[j + 1].firstPoint;
                plan.furnitures[i].data[j].firstPoint.x = plan.furnitures[i].data[j].secondPoint.x;
                plan.furnitures[i].data[j].firstPoint.y = plan.furnitures[i].data[j].secondPoint.y - scale * plan.furnitures[i].data[j].size;
            } else if (plan.furnitures[i].data[j].direction === 'East') {
                plan.furnitures[i].data[j].secondPoint = plan.furnitures[i].data[j + 1].firstPoint;
                plan.furnitures[i].data[j].firstPoint.x = plan.furnitures[i].data[j].secondPoint.x - scale * plan.furnitures[i].data[j].size;
                plan.furnitures[i].data[j].firstPoint.y = plan.furnitures[i].data[j].secondPoint.y;
            } else if (plan.furnitures[i].data[j].direction === 'West') {
                plan.furnitures[i].data[j].secondPoint = plan.furnitures[i].data[j + 1].firstPoint;
                plan.furnitures[i].data[j].firstPoint.x = plan.furnitures[i].data[j].secondPoint.x + scale * plan.furnitures[i].data[j].size;
                plan.furnitures[i].data[j].firstPoint.y = plan.furnitures[i].data[j].secondPoint.y;
            }
        }
        plan.furnitures[i].data[plan.furnitures[i].data.length - 1].secondPoint = plan.furnitures[i].data[0].firstPoint;

        const tob = topOrBottom(plan.furnitures[i].distance_from_walls.horizontal);
        const hind = plan.furnitures[i].distance_from_walls.horizontal.furniture_index;
        if (tob === 'top') {
            const topY = plan.walls[plan.furnitures[i].distance_from_walls.horizontal.wall_index].secondPoint.y + scale * plan.furnitures[i].distance_from_walls.horizontal.dist;

            for (let j = 0; j < plan.furnitures[i].data.length; ++j) {
                plan.furnitures[i].data[j].firstPoint.y += topY;
            }
        }
        if (tob == 'bottom') {
            const topY = plan.walls[plan.furnitures[i].distance_from_walls.horizontal.wall_index].secondPoint.y - scale * plan.furnitures[i].distance_from_walls.horizontal.dist - scale * n;

            for (let j = 0; j < plan.furnitures[i].data.length; ++j) {
                plan.furnitures[i].data[j].firstPoint.y += topY;
            }
        }

        /* elválasztások a polcokon */
        if (w > n) {
            let separations = [];
            let startPoint = topLeftCoordOfFurniture(plan.furnitures[i]);
            let fp = {x: startPoint.x, y: startPoint.y};
            let sp = {x: startPoint.x, y: startPoint.y + n * scale};
            let infostartpoint = {firstPoint: fp, secondPoint: sp};
            for (let k = 0; k < plan.furnitures[i].products.length; ++k) {
                fp = {x: startPoint.x + (k + 1) * scale, y: startPoint.y};
                sp = {x: startPoint.x + (k + 1) * scale, y: startPoint.y + n * scale};
                separations.push({firstPoint: fp, secondPoint: sp});
            }
            fp = {x: startPoint.x + (plan.furnitures[i].products.length + 1) * scale, y: startPoint.y};
            sp = {x: startPoint.x + (plan.furnitures[i].products.length + 1) * scale, y: startPoint.y + n * scale};
            let infoendpoint = {firstPoint: fp, secondPoint: sp};
            plan.furnitures[i].info = {direction: 'horizontal', start: infostartpoint, end: infoendpoint}
            plan.furnitures[i].separators = separations;
        } else {    
            let separations = [];
            let startPoint = topLeftCoordOfFurniture(plan.furnitures[i]);
            let fp = {x: startPoint.x, y: startPoint.y};
            let sp = {x: startPoint.x + w * scale, y: startPoint.y};
            let infostartpoint = {firstPoint: fp, secondPoint: sp};
            for (let k = 0; k < plan.furnitures[i].products.length; ++k) {
                fp = {x: startPoint.x, y: startPoint.y + (k + 1) * scale};
                sp = {x: startPoint.x + w * scale, y: startPoint.y + (k + 1) * scale};

                separations.push({firstPoint: fp, secondPoint: sp});
            }
            fp = {x: startPoint.x, y: startPoint.y + (plan.furnitures[i].products.length + 1) * scale};
            sp = {x: startPoint.x + w * scale, y: startPoint.y + (plan.furnitures[i].products.length + 1) * scale};
            let infoendpoint = {firstPoint: fp, secondPoint: sp};
            plan.furnitures[i].info = {direction: 'vertical', start: infostartpoint, end: infoendpoint}
            plan.furnitures[i].separators = separations;
        }
    }
}

/* Megkeresi a legbaloldalabbi falat */
function topLeftCoordOfFurniture(furniture) {
    let mostLeft = furniture.data[0].firstPoint.x < furniture.data[0].secondPoint.x ? furniture.data[0].firstPoint.x : furniture.data[0].secondPoint.x;
    for (let i = 1; i < furniture.data.length; ++i) {
        if (furniture.data[i].firstPoint.x < mostLeft) {
            mostLeft = furniture.data[i].firstPoint.x;
        }
        if (furniture.data[i].secondPoint.x < mostLeft) {
            mostLeft = furniture.data[i].secondPoint.x;
        }
    }
    let mostTop = furniture.data[0].firstPoint.y < furniture.data[0].secondPoint.y ? furniture.data[0].firstPoint.y : furniture.data[0].secondPoint.y;
    for (let i = 1; i < furniture.data.length; ++i) {
        if (furniture.data[i].firstPoint.y < mostLeft) {
            mostTop = furniture.data[i].firstPoint.y;
        }
        if (furniture.data[i].secondPoint.y < mostLeft) {
            mostTop = furniture.data[i].secondPoint.y;
        }
    }
    return {x: mostLeft, y: mostTop};
}

/* bal vagy jobb oldalon van e a legközelebbi fal */
function leftOrRight(coord) {
    if (coord.firstPoint.x > coord.secondPoint.x) {
        return 'left';
    } else {
        return 'right';
    }
}

/* felső vagy alsó oldalon van e a legközelebbi fal */
function topOrBottom(coord) {
    if (coord.firstPoint.y > coord.secondPoint.y) {
        return 'top';
    } else {
        return 'bottom';
    }
}

/* méretezi a gráfot a canvashez */
function scaleGraph() {

    for (let i = 0; i < plan.routes.peaks.length; ++i) {
        plan.routes.peaks[i].x = plan.walls[plan.routes.peaks[i].nw.vw.wallindex].firstPoint.x + scale * plan.routes.peaks[i].nw.vw.distance;
        plan.routes.peaks[i].y = plan.walls[plan.routes.peaks[i].nw.hw.wallindex].firstPoint.y + scale * plan.routes.peaks[i].nw.hw.distance;
	}

	for (let i = 0; i < plan.routes.edges.length; ++i) {
        plan.routes.edges[i].from.x = plan.walls[ plan.routes.edges[i].from.nw.vw.wallindex].firstPoint.x + scale * plan.routes.edges[i].from.nw.vw.distance;
        plan.routes.edges[i].from.y = plan.walls[ plan.routes.edges[i].from.nw.hw.wallindex].firstPoint.y + scale * plan.routes.edges[i].from.nw.hw.distance;
        plan.routes.edges[i].to.x = plan.walls[ plan.routes.edges[i].to.nw.vw.wallindex].firstPoint.x + scale * plan.routes.edges[i].to.nw.vw.distance;
        plan.routes.edges[i].to.y = plan.walls[ plan.routes.edges[i].to.nw.hw.wallindex].firstPoint.y + scale * plan.routes.edges[i].to.nw.hw.distance;
    }

}