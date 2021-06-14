/* Megkeresi az első felrajzolt faltól sorban a legközelebbi falat, sorrendbe teszi őket */
function searchNextWall() {

	let tmp_coords = [];
	const basic_length = coords.length;
	tmp_coords.push({ firstPoint: coords[0].firstPoint, secondPoint: coords[0].secondPoint, size: 0, direction: coords[0].direction });
	coords.splice(0, 1);
	while (tmp_coords.length < basic_length) {
		const tmp_befPoint = tmp_coords[tmp_coords.length - 1].secondPoint;
		let tmp_curr = coords[0];
		let tmp_index = 0;
		
		for (let i = 1; i < coords.length; ++i) {

			let tmp_firstPointDistance = getDistance(tmp_curr.firstPoint,tmp_befPoint);
			let tmp_secondPointDistance = getDistance(tmp_curr.secondPoint,tmp_befPoint);
			const firstPointDistance = getDistance(coords[i].firstPoint,tmp_befPoint);
			const secondPointDistance = getDistance(coords[i].secondPoint,tmp_befPoint);
			let minDistance = tmp_firstPointDistance < tmp_secondPointDistance ? tmp_firstPointDistance : tmp_secondPointDistance;

			if (firstPointDistance < minDistance || secondPointDistance < minDistance) {
				tmp_curr = coords[i];
				tmp_index = i;
			}

		}

		const tmp_firstPoint = tmp_curr.firstPoint;
		const tmp_secondPoint = tmp_curr.secondPoint;
		const tmp_firstPointDistance2 = getDistance(tmp_firstPoint, tmp_befPoint);
		const tmp_secondPointDistance2 = getDistance(tmp_secondPoint, tmp_befPoint);

		if (tmp_firstPointDistance2 <= tmp_secondPointDistance2) {
			tmp_coords.push({ firstPoint: tmp_firstPoint, secondPoint: tmp_secondPoint, size: 0, direction: '' });
		} else {
			tmp_coords.push({ firstPoint: tmp_secondPoint, secondPoint: tmp_firstPoint, size: 0, direction: '' });
		}
		
		coords.splice(tmp_index, 1);
	}

	coords = tmp_coords;
}

/* Két pont közötti távolságot számolja ki */
function getDistance(point1, point2) {
	const a = point1.x - point2.x
	const b = point1.y - point2.y
	return Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
}

/* Szétszedi azokat a falakat, amik "egyben" lettek felrajzolva */
function takeApart() {

	if (drawingCoords.length <= 15) return;
	
	let breakPoints = [];
	let direction;
	if (Math.abs(drawingCoords[0].x - drawingCoords[15].x) >
		Math.abs(drawingCoords[0].y - drawingCoords[15].y)) {
			direction = 'horizontal';
	} else {
		direction = 'vertical';
	}

	for (let i = 15; i < drawingCoords.length - 16; i += 15) {
		if (Math.abs(drawingCoords[i].x - drawingCoords[i + 15].x) >
			Math.abs(drawingCoords[i].y - drawingCoords[i + 15].y)) {
				if (direction === 'vertical') {
					breakPoints.push({x: drawingCoords[i].x, y: drawingCoords[i].y});
				}
				
			direction = 'horizontal';
		} else {
			if (direction === 'horizontal') {
				breakPoints.push({x: drawingCoords[i].x, y: drawingCoords[i].y})
			}
			direction = 'vertical';
		}
	}
	
	if (breakPoints.length < 1) return;

    if (drawingPhase) {
        coords.splice(-1,1);
        coords.push({firstPoint: {x: drawingCoords[0].x, y: drawingCoords[0].y}, secondPoint: {x: breakPoints[0].x, y: breakPoints[0].y}, size: 0, direction: '' });
        for (let i = 0; i < breakPoints.length - 1; ++i) {
            coords.push({firstPoint: {x: breakPoints[i].x, y: breakPoints[i].y}, secondPoint: {x: breakPoints[i + 1].x, y: breakPoints[i + 1].y}, size: 0, direction: '' });
        }
        coords.push({firstPoint: {x: breakPoints[breakPoints.length - 1].x, y: breakPoints[breakPoints.length - 1].y}, secondPoint: {x: drawingCoords[drawingCoords.length - 1].x, y: drawingCoords[drawingCoords.length - 1].y}, size: 0, direction: '' });
    }
    if (furnishingPhase) {
        furniture.splice(-1,1);
        furniture.push({firstPoint: {x: drawingCoords[0].x, y: drawingCoords[0].y}, secondPoint: {x: breakPoints[0].x, y: breakPoints[0].y}, size: 0, direction: '' });
        for (let i = 0; i < breakPoints.length - 1; ++i) {
            furniture.push({firstPoint: {x: breakPoints[i].x, y: breakPoints[i].y}, secondPoint: {x: breakPoints[i + 1].x, y: breakPoints[i + 1].y}, size: 0, direction: '' });
        }
        furniture.push({firstPoint: {x: breakPoints[breakPoints.length - 1].x, y: breakPoints[breakPoints.length - 1].y}, secondPoint: {x: drawingCoords[drawingCoords.length - 1].x, y: drawingCoords[drawingCoords.length - 1].y}, size: 0, direction: '' });
    }
	
}

/* Visszaadja melyik irányba mutat a falvektora */
function getDirection(coord) {
	if (Math.abs(coord.firstPoint.x - coord.secondPoint.x) >
		Math.abs(coord.firstPoint.y - coord.secondPoint.y)) {
		return 'horizontal';
	} else {
		return 'vertical';
	}
}

/* Összeolvaszt két pontot TODO */
function mergeTwoPoints(P1, P2) {

	const minCoordX = Math.min(P1.firstPoint.x, P1.secondPoint.x, P2.firstPoint.x, P2.secondPoint.x);
	const maxCoordX = Math.max(P1.firstPoint.x, P1.secondPoint.x, P2.firstPoint.x, P2.secondPoint.x);
	const minCoordY = Math.min(P1.firstPoint.y, P1.secondPoint.y, P2.firstPoint.y, P2.secondPoint.y);
	const maxCoordY = Math.max(P1.firstPoint.y, P1.secondPoint.y, P2.firstPoint.y, P2.secondPoint.y);

	if (getDirection(P1) === 'horizontal') {
		return {
			firstPoint: {x: minCoordX, y: minCoordY},
			secondPoint: {x: maxCoordX, y: minCoordY},
			size: 0,
			direction: ''
		}
	} else {
		return {
			firstPoint: {x: minCoordX, y: minCoordY},
			secondPoint: {x: minCoordX, y: maxCoordY},
			size: 0,
			direction: ''
		}
	}
}

/* Egybeolvassza az egymás melletti "egyirányú" falakat TODO */
function mergeSameDirection() {

	let merged_coords = [];

	console.log(getDirection(coords[coords.length - 1]) === getDirection(coords[0]))
	if (getDirection(coords[coords.length - 1]) === getDirection(coords[0])) {
		merged_coords.push(mergeTwoPoints(coords[coords.length - 1], coords[0]));
		coords.splice(coords.length - 1, 1);
	} else {
		merged_coords.push(coords[0]);
	}

	for (let i = 0; i < coords.length - 1; ++i) {
		console.log(getDirection(coords[i]) === getDirection(coords[i + 1]))
		if (getDirection(coords[i]) === getDirection(coords[i + 1])) {
			merged_coords.push(mergeTwoPoints(coords[i], coords[i + 1]));
			coords.splice(i+1, 1)
		} else {
			merged_coords.push(coords[i]);
		}
	}

	console.log(coords);
	coords = merged_coords;

}