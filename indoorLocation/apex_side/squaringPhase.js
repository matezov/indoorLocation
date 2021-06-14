/* Arányosan rajzolja fel az alaprajzot a balfelső sarokhoz, majd középre helyezei*/
function scalingToWindowSize() {
	let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
	coords.forEach(coord => {
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
	if (n === 0 || s === 0 || e === 0 || w === 0) {
		alert("Legalább egy méret nem lett megadva!");
		return;
	}
	if (n !== s || e !== w) {
		alert("Hibás méretek!");
		return;
	}

	const stmp1 = canvas.height * 0.8 / s;
	const stmp2 = canvas.width * 0.95 / e;
	const scale = stmp1 < stmp2 ? stmp1 : stmp2;
	scale_permanent = scale;

	// most left position
	let mostLeft = coords[0];
	let mlIndex = 0;

	let index = 0;
	coords.forEach(coord => {
		if (coord.firstPoint.x < mostLeft.firstPoint.x || coord.secondPoint.x < mostLeft.firstPoint.x ||
			coord.firstPoint.x < mostLeft.secondPoint.x || coord.secondPoint.x < mostLeft.secondPoint.x) {
			mostLeft = coord;
			mlIndex = index;
		}
		++index;
	});

	switch (coords[mlIndex].direction) {
		case 'North':
			coords[mlIndex].firstPoint.x = canvas.width * 0.025;
			coords[mlIndex].firstPoint.y = 0;
			coords[mlIndex].secondPoint.x = coords[mlIndex].firstPoint.x;
			coords[mlIndex].secondPoint.y = coords[mlIndex].firstPoint.y - scale * coords[mlIndex].size;
			break; 
		case 'South':
			coords[mlIndex].firstPoint.x = canvas.width * 0.025;
			coords[mlIndex].firstPoint.y = 0;
			coords[mlIndex].secondPoint.x = coords[mlIndex].firstPoint.x;
			coords[mlIndex].secondPoint.y = coords[mlIndex].firstPoint.y + scale * coords[mlIndex].size;
			break;
		case 'East':
			coords[mlIndex].secondPoint.x = canvas.width * 0.025;
			coords[mlIndex].secondPoint.y = 0;
			coords[mlIndex].firstPoint.x = coords[mlIndex].secondPoint.x + scale * coords[mlIndex].size;
			coords[mlIndex].firstPoint.y = coords[mlIndex].secondPoint.y;
			break;
		case 'West':
			coords[mlIndex].firstPoint.x = canvas.width * 0.025;
			coords[mlIndex].firstPoint.y = 0;
			coords[mlIndex].secondPoint.x = coords[mlIndex].firstPoint.x + scale * coords[mlIndex].size;
			coords[mlIndex].secondPoint.y = coords[mlIndex].firstPoint.y;
			break;
	}
	for (let i = mlIndex + 1; i < coords.length; ++i) {
		if (coords[i].direction === 'North') {
			coords[i].firstPoint = coords[i - 1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x
			coords[i].secondPoint.y = coords[i].firstPoint.y - scale * coords[i].size;
		} else if (coords[i].direction === 'South') {
			coords[i].firstPoint = coords[i - 1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x;
			coords[i].secondPoint.y = coords[i].firstPoint.y + scale * coords[i].size;
		} else if (coords[i].direction === 'East') {
			coords[i].firstPoint = coords[i - 1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x + scale * coords[i].size;
			coords[i].secondPoint.y = coords[i].firstPoint.y;
		} else if (coords[i].direction === 'West') {
			coords[i].firstPoint = coords[i - 1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x - scale * coords[i].size;
			coords[i].secondPoint.y = coords[i].firstPoint.y;
		}
	}
	for (let i = mlIndex - 1; i >= 0; --i) {
		if (coords[i].direction === 'North') {
			coords[i].secondPoint = coords[i + 1].firstPoint;
			coords[i].firstPoint.x = coords[i].secondPoint.x
			coords[i].firstPoint.y = coords[i].secondPoint.y + scale * coords[i].size;
		} else if (coords[i].direction === 'South') {
			coords[i].secondPoint = coords[i + 1].firstPoint;
			coords[i].firstPoint.x = coords[i].secondPoint.x;
			coords[i].firstPoint.y = coords[i].secondPoint.y - scale * coords[i].size;
		} else if (coords[i].direction === 'East') {
			coords[i].secondPoint = coords[i + 1].firstPoint;
			coords[i].firstPoint.x = coords[i].secondPoint.x - scale * coords[i].size;
			coords[i].firstPoint.y = coords[i].secondPoint.y;
		} else if (coords[i].direction === 'West') {
			coords[i].secondPoint = coords[i + 1].firstPoint;
			coords[i].firstPoint.x = coords[i].secondPoint.x + scale * coords[i].size;
			coords[i].firstPoint.y = coords[i].secondPoint.y;
		}
	}
	coords[coords.length - 1].secondPoint = coords[0].firstPoint;

	// top position
	let topPos = coords[0];

	index = 0;
	coords.forEach(coord => {
		if (coord.firstPoint.y < topPos.firstPoint.y || coord.secondPoint.y < topPos.firstPoint.y ||
			coord.firstPoint.y < topPos.secondPoint.y || coord.secondPoint.y < topPos.secondPoint.y) {
			topPos = coord;
		}
		++index;
	});

	const topY = topPos.firstPoint.y < topPos.secondPoint.y ?
		(Math.abs(topPos.firstPoint.y) + canvas.height * 0.85 * 0.0375) : (Math.abs(topPos.secondPoint.y) + canvas.height * 0.85 * 0.0375);

	for (let i = 0; i < coords.length; ++i) {
		coords[i].firstPoint.y = coords[i].firstPoint.y + topY;
		//coords[i].secondPoint.y = coords[i].secondPoint.y + topY; ??????????? miért csinálja meg e nélkül ????? TODO
	}

	// Középre igazítás
	let toSlide;
	if (stmp1 < stmp2) {
		toSlide = (stmp2 * e - scale * e) / 2;
		for (let i = 0; i < coords.length; ++i) {
			coords[i].firstPoint.x = coords[i].firstPoint.x + toSlide;
		}
	} else {
		toSlide = (stmp1 * s - stmp2 * s) / 2;
		for (let i = 0; i < coords.length; ++i) {
			coords[i].firstPoint.y = coords[i].firstPoint.y + toSlide;
		}
	}

	drawingPhase = false;
	squaringPhase = false;
	beaconPhase = true;

	context.clearRect(0, 0, canvas.width, canvas.height);
}

/* falak "szögesítése", kiegyenesítése */
function squaring() {
	if (coords.length < 4) return;

	let direction;
	if (Math.abs(coords[0].firstPoint.x - coords[0].secondPoint.x) >
		Math.abs(coords[0].firstPoint.y - coords[0].secondPoint.y)) {
		direction = 'horizontal';
		coords[0].secondPoint.y = coords[0].firstPoint.y;
	} else {
		direction = 'vertical';
		coords[0].secondPoint.x = coords[0].firstPoint.x;
	}

	for (let i = 1; i < coords.length; ++i) {
		if (direction === 'horizontal') {
			coords[i].firstPoint = coords[i - 1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x;
			direction = 'vertical';
		} else {
			coords[i].firstPoint = coords[i - 1].secondPoint;
			coords[i].secondPoint.y = coords[i].firstPoint.y;
			direction = 'horizontal';
		}
	}

	if (direction === 'horizontal') {
		coords[coords.length - 1].secondPoint.x = coords[0].firstPoint.x;
		coords[0].firstPoint.y = coords[coords.length - 1].secondPoint.y;
	} else {
		coords[coords.length - 1].secondPoint.y = coords[0].firstPoint.y;
		coords[0].firstPoint.x = coords[coords.length - 1].secondPoint.x;
	}

	drawingPhase = false;
	squaringPhase = true;
	draw();
}