const canvas = document.querySelector("#positioning");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

/* var kalmanFilter = new KalmanFilter();

console.log(kalmanFilter.filter(3));
console.log(kalmanFilter.filter(2));
console.log(kalmanFilter.filter(1)); */

let scale;
let plan = {"name":"KJNADS","walls":[{"firstPoint":{"x":866.3,"y":554.860625},"secondPoint":{"x":332.7,"y":554.860625},"size":20,"direction":"West"},{"firstPoint":{"x":332.7,"y":554.860625},"secondPoint":{"x":332.7,"y":21.260625000000005},"size":20,"direction":"North"},{"firstPoint":{"x":332.7,"y":21.260625000000005},"secondPoint":{"x":866.3,"y":21.260625000000005},"size":20,"direction":"East"},{"firstPoint":{"x":866.3,"y":21.260625000000005},"secondPoint":{"x":866.3,"y":554.860625},"size":20,"direction":"South"}],"beacons":[{"x":732.9,"y":21.260625000000005,"wall":2,"pos":15},{"x":866.3,"y":288.060625,"wall":3,"pos":10}]}

scalePlan();

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
    const stmp1 = canvas.height * 0.9 / s;
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
						plan.beacons[j].y = plan.walls[i].firstPoint.y - plan.beacons[j].pos * scale;
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
						plan.beacons[j].x = plan.walls[i].firstPoint.x - plan.beacons[j].pos * scale;
						plan.beacons[j].y = plan.walls[i].firstPoint.y;
						break;
				}
			}
		}
	}
}

const draw = function (e) {
	context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < plan.walls.length; ++i) {
        context.beginPath();
        context.moveTo(plan.walls[i].firstPoint.x, plan.walls[i].firstPoint.y);
        context.lineTo(plan.walls[i].secondPoint.x, plan.walls[i].secondPoint.y);
        context.stroke();
    }
    for (let i = 0; i < plan.beacons.length; ++i) {
		let imgBeacon = new Image();
		imgBeacon.onload = function () {
			context.drawImage(imgBeacon, plan.beacons[i].x, plan.beacons[i].y, 15, 15);
		};
		imgBeacon.src = "svg_files/broadcast.svg";
        context.fillStyle = "green";
        context.beginPath();
        context.arc(plan.beacons[i].x, plan.beacons[i].y, 5, 0, 2 * Math.PI);
        context.fill();
	}
}
draw();