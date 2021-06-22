const canvas = document.querySelector("#positioning");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

let scale;
let plan = {"name":"test","walls":[{"firstPoint":{"x":1046.94,"y":21.57937499999997},"secondPoint":{"x":613.66,"y":21.57937499999997},"size":40,"direction":"West"},{"firstPoint":{"x":613.66,"y":21.57937499999997},"secondPoint":{"x":613.66,"y":346.539375},"size":30,"direction":"South"},{"firstPoint":{"x":613.66,"y":346.539375},"secondPoint":{"x":72.05999999999992,"y":346.539375},"size":50,"direction":"West"},{"firstPoint":{"x":72.05999999999992,"y":346.539375},"secondPoint":{"x":72.05999999999992,"y":563.179375},"size":20,"direction":"South"},{"firstPoint":{"x":72.05999999999992,"y":563.179375},"secondPoint":{"x":721.98,"y":563.179375},"size":60,"direction":"East"},{"firstPoint":{"x":721.98,"y":563.179375},"secondPoint":{"x":721.98,"y":454.859375},"size":10,"direction":"North"},{"firstPoint":{"x":721.98,"y":454.859375},"secondPoint":{"x":1046.94,"y":454.859375},"size":30,"direction":"East"},{"firstPoint":{"x":1046.94,"y":454.859375},"secondPoint":{"x":1046.94,"y":21.57937499999997},"size":40,"direction":"North"}],"beacons":[{"x":559.5,"y":346.539375,"wall":2,"pos":5},{"x":667.82,"y":21.57937499999997,"wall":0,"pos":35},{"x":1046.94,"y":238.21937499999999,"wall":7,"pos":20},{"x":830.3000000000001,"y":454.859375,"wall":6,"pos":10},{"x":397.02,"y":563.179375,"wall":4,"pos":30}],"furnitures":[{"name":"","data":[{"firstPoint":{"x":700.3159999999999,"y":32.41137499999997},"secondPoint":{"x":667.8199999999999,"y":32.41137499999997},"size":"3","direction":"West"},{"firstPoint":{"x":667.8199999999999,"y":32.41137499999997},"secondPoint":{"x":667.8199999999999,"y":140.73137499999999},"size":"10","direction":"South"},{"firstPoint":{"x":667.8199999999999,"y":140.73137499999999},"secondPoint":{"x":700.3159999999999,"y":140.73137499999999},"size":"3","direction":"East"},{"firstPoint":{"x":700.3159999999999,"y":140.73137499999999},"secondPoint":{"x":700.3159999999999,"y":32.41137499999997},"size":"10","direction":"North"}],"products":[],"distance_from_walls":{"horizontal":{"wall_index":0,"furniture_index":0,"dist":1,"firstPoint":{"x":731.5,"y":63},"secondPoint":{"x":731.5,"y":21.57937499999997}},"vertical":{"wall_index":1,"furniture_index":1,"dist":"5","firstPoint":{"x":704,"y":107},"secondPoint":{"x":613.66,"y":107}}}},{"name":"","data":[{"firstPoint":{"x":1036.108,"y":43.24337499999997},"secondPoint":{"x":927.7879999999999,"y":43.24337499999997},"size":"10","direction":"West"},{"firstPoint":{"x":927.7879999999999,"y":43.24337499999997},"secondPoint":{"x":927.7879999999999,"y":97.40337499999998},"size":"5","direction":"South"},{"firstPoint":{"x":927.7879999999999,"y":97.40337499999998},"secondPoint":{"x":711.1479999999999,"y":97.40337499999998},"size":"20","direction":"West"},{"firstPoint":{"x":711.1479999999999,"y":97.40337499999998},"secondPoint":{"x":711.1479999999999,"y":151.56337499999998},"size":"5","direction":"South"},{"firstPoint":{"x":711.1479999999999,"y":151.56337499999998},"secondPoint":{"x":1036.108,"y":151.56337499999998},"size":"30","direction":"East"},{"firstPoint":{"x":1036.108,"y":151.56337499999998},"secondPoint":{"x":1036.108,"y":43.24337499999997},"size":"10","direction":"North"}],"products":[],"distance_from_walls":{"horizontal":{"wall_index":0,"furniture_index":0,"dist":"2","firstPoint":{"x":966,"y":80},"secondPoint":{"x":966,"y":21.57937499999997}},"vertical":{"wall_index":0,"furniture_index":5,"dist":1,"firstPoint":{"x":987,"y":123},"secondPoint":{"x":1046.94,"y":123}}}},{"name":"","data":[{"firstPoint":{"x":115.38799999999992,"y":454.859375},"secondPoint":{"x":115.38799999999992,"y":498.187375},"size":"4","direction":"South"},{"firstPoint":{"x":115.38799999999992,"y":498.187375},"secondPoint":{"x":375.35599999999994,"y":498.187375},"size":"24","direction":"East"},{"firstPoint":{"x":375.35599999999994,"y":498.187375},"secondPoint":{"x":375.35599999999994,"y":454.859375},"size":"4","direction":"North"},{"firstPoint":{"x":375.35599999999994,"y":454.859375},"secondPoint":{"x":115.38799999999992,"y":454.859375},"size":"24","direction":"West"}],"products":[{"x":402,"y":389,"wall":2,"name":""}],"distance_from_walls":{"horizontal":{"wall_index":2,"furniture_index":3,"dist":"10","firstPoint":{"x":347.5,"y":383},"secondPoint":{"x":347.5,"y":346.539375}},"vertical":{"wall_index":3,"furniture_index":0,"dist":"4","firstPoint":{"x":174,"y":420},"secondPoint":{"x":72.05999999999992,"y":420}}}}]}

let pos;

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

/* Visszaadja a 3 legerősebb jellel rendelkező jeladót. arr -> [{x,y,d}] */
function strongestSigns(arr) {
	let max = [];

	for (let i = 0; i < 3; ++i) {
		let curr_max = arr[0];
		let curr_index = 0;
		for (let j = 1; j < arr.length; ++j) {
			if (curr_max.d < arr[j].d) {
				curr_max = arr[j];
				curr_index = j;
			}
		}
		max.push(curr_max);
		arr.splice(curr_index, 1);
	}

	return max;
}


/* function trilateration(P1, P2, P3) {

	let S = (Math.pow(P3.x, 2) - Math.pow(P2.x, 2) + Math.pow(P3.y, 2) - Math.pow(P2.y, 2) + Math.pow(P2.r, 2) - Math.pow(P3.r, 2)) / 2;
   	let T = (Math.pow(P1.x, 2) - Math.pow(P2.x, 2) + Math.pow(P1.y, 2) - Math.pow(P2.y, 2) + Math.pow(P2.r, 2) - Math.pow(P1.r, 2)) / 2;
    let y = ((T * (P2.x - P3.x)) - (S * (P2.x - P1.x))) / (((P1.y - P2.y) * (P2.x - P3.x)) - ((P3.y - P2.y) * (P2.x - P1.x)));
	let x = ((y * (P1.y - P2.y)) - T) / (P2.x - P1.x);

	return {x, y}
} */

// console.log(trilateration({x: plan.beacons[0].x ,y: plan.beacons[0].y,r: 50.00},{x: plan.beacons[1].x ,y: plan.beacons[1].y,r: 36.06},{x: plan.beacons[2].x ,y: plan.beacons[2].y,r: 68.83}));
// console.log(trilateration({x: 100 ,y: 100,r: 50.00},{x: 160 ,y: 120,r: 36.06},{x: 70 ,y: 150,r: 68.83}));

/* 3 pontot távolsággal Pi = {x,y,r,d} alakban */
function getPosition(P1, P2, P3) {
	
	const A = 2 * P2.x - 2 * P1.x
	const B = 2 * P2.y - 2 * P1.y
	const C = P1.r ** 2 - P2.r ** 2 - P1.x ** 2 + P2.x ** 2 - P1.y ** 2 + P2.y ** 2
	const D = 2 * P3.x - 2 * P2.x
	const E = 2 * P3.y - 2 * P2.y
	const F = P2.r ** 2 - P3.r ** 2 - P2.x ** 2 + P3.x ** 2 - P2.y ** 2 + P3.y ** 2
	const x = (C * E - F * B) / (E * A - B * D);
	const y = (C * D - A * F) / (B * D - A * E);

	return {x, y}
}

function move(i) {
	// pos = getPosition({x: plan.beacons[0].x ,y: plan.beacons[0].y,r: 50.00},{x: plan.beacons[1].x ,y: plan.beacons[1].y,r: 36.06},{x: plan.beacons[2].x ,y: plan.beacons[2].y,r: 68.83});
	// pos = getPosition(max[0], max[1], max[2]);
	draw();
}

let c = 0;

function init() {
	scalePlan();
	let arr = [{x:1,y:1,r: 5,d:10},{x:2,y:2,r:5, d:21},{x:3,y:3,r: 5,d:50},{x:4,y:4,r: 5,d:32},{x:1,y:2,r: 5,d:42},{x:1,y:2,r: 5,d:4},{x:1,y:2,r: 5,d:23},{x:1,y:2,r: 5,d:324}]; 
	const max_array = strongestSigns(arr);
	//pos = getPosition({x: plan.beacons[0].x ,y: plan.beacons[0].y,r: 50.00},{x: plan.beacons[1].x ,y: plan.beacons[1].y,r: 36.06},{x: plan.beacons[2].x ,y: plan.beacons[2].y,r: 68.83});
	console.log(max_array);
	pos = getPosition(max_array[0],max_array[1],max_array[2])
	draw();
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
        context.fillStyle = "green";
        context.beginPath();
        context.arc(plan.beacons[i].x, plan.beacons[i].y, 5, 0, 2 * Math.PI);
        context.fill();
	}

	context.fillStyle = "red";
	context.beginPath();
	context.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
	context.fill();

}

init();

let t = window.setInterval(move, 100, 21);