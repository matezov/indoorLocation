const canvas = document.querySelector("#positioning");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight * 0.8;

let scale;
let pos;
let dest;
let dest_name;
let position_to_show;
let graph;
let shortest_route;
let sensor = new Accelerometer( {frequency: 5} );
//let sensor = new LinearAccelerationSensor( {frequency: 1} );
let coordinates = [];
let s_r;

let pos_;

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
	getPosition({x: max[0].x , y: max[0].y, r: max[0].r}, {x: max[1].x , y: max[1].y, r: max[1].r}, {x: max[2].x , y: max[2].y, r: max[2].r});
}

let positions_ = [];

function calculatePositions(arr) {
	positions_.splice(0, positions_.length-1);
	for (let i = 0; i < arr.length - 2; ++i) {
		let pos_tmp = getPosition(arr[i], arr[i+1], arr[i+2]);
		positions_.push(pos_tmp);
	}
	if (arr.length >= 3) {
		let pos_tmp = getPosition(arr[0], arr[arr.length - 2], arr[arr.length - 1]);
		positions_.push(pos_tmp);
		if (arr.length > 3) {
			pos_tmp = getPosition(arr[0], arr[1], arr[arr.length - 1]);
			positions_.push(pos_tmp);
		}
	}
	draw();
}

function set_pos_to_nearest(arr) {
	let curr_max = arr[0];
	for (let j = 1; j < arr.length; ++j) {
		if (curr_max.d < arr[j].d) {
			curr_max = arr[j];
		}
	}
	pos = {x: curr_max.x + 6, y: curr_max.y + 6};
	draw();
}


canvas.onclick = function (e) {
	if (e.layerX > searchButton.x && e.layerX < searchButton.x + searchButton.width &&
		e.layerY > searchButton.y && e.layerY < searchButton.y + searchButton.height) {
			let name = prompt('Keresendő cikk neve:');
			let index1;
			let index2;
			for (let i = 0; i < plan.furnitures.length; ++i) {
				for (let j = 0; j < plan.furnitures[i].products.length; ++j) {
					plan.furnitures[i].products[j].stuffHere.forEach( sh => {
						if (name === sh) {
							index1 = i;
							index2 = j;
							dest_name = name;
						}
					});
				}
			}
			if (index1 !== undefined && index2 !== undefined) {
				let xt = (plan.furnitures[index1].separators[index2].firstPoint.x + plan.furnitures[index1].separators[index2].secondPoint.x) / 2;
				let yt = (plan.furnitures[index1].separators[index2].firstPoint.y + plan.furnitures[index1].separators[index2].secondPoint.y) / 2;
				dest = {x: xt, y: yt}
				console.log(pos)
				if (pos === undefined) {
					pos = {x: 300,y: 300}
				}
				console.log(dest)
				searchNearestRoute(pos, dest);
				draw();
			}
	}
}

function getPosition(P1, P2, P3) {

	const S = (Math.pow(P3.x, 2) - Math.pow(P2.x, 2) + Math.pow(P3.y, 2) - Math.pow(P2.y, 2) + Math.pow(P2.r * 1000 * scale, 2) - Math.pow(P3.r * 1000 * scale, 2)) / 2;
  	const T = (Math.pow(P1.x, 2) - Math.pow(P2.x, 2) + Math.pow(P1.y, 2) - Math.pow(P2.y, 2) + Math.pow(P2.r * 1000 * scale, 2) - Math.pow(P1.r * 1000 * scale, 2)) / 2;
	const y = ((T * (P2.x - P3.x)) - (S * (P2.x - P1.x))) / (((P1.y - P2.y) * (P2.x - P3.x)) - ((P3.y - P2.y) * (P2.x - P1.x)));
	const x = ((y * (P1.y - P2.y)) - T) / (P2.x - P1.x);

	let pos_TMP = {x: x, y: y};

	return pos_TMP;

	/* pos = {x: x, y: y};
	console.log(pos);
	if (inRoom(pos)) {
		draw();
	} */
}

function getDistance(point1, point2) {
	const a = point1.x - point2.x
	const b = point1.y - point2.y
	return Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
}

function initGraph() {
	let graph = new Graph();
	for (let i = 0; i < plan.routes.peaks.length; ++i) {
		graph.addVertex(plan.routes.peaks[i].id.toString(), plan.routes.peaks[i].x, plan.routes.peaks[i].y);
	}
	for (let j = 0; j < plan.routes.edges.length; ++j) {
		let weight = getDistance({x: plan.routes.edges[j].from.x, y: plan.routes.edges[j].from.y},{x: plan.routes.edges[j].to.x, y: plan.routes.edges[j].to.y});
		graph.addEdge(plan.routes.edges[j].from.id.toString(), plan.routes.edges[j].to.id.toString(), weight);
	}
	return graph;
}

function inRoom(pos) {
	let b = true;
	let topLeft = false, bottomLeft = false, topRigth = false, bottomRight = false;
	plan.walls.forEach(coord => {
            let mincoordX = coord.firstPoint.x < coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
            let maxcoordX = coord.firstPoint.x > coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
            let mincoordY = coord.firstPoint.y < coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
            let maxcoordY = coord.firstPoint.y > coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
            /* bal felso pontja */
            if (pos.x > mincoordX && pos.y > mincoordY) {
                    topLeft = true;
            }
            /* bal also pontja */
            if (pos.x > mincoordX && pos.y < maxcoordY) {
                    bottomLeft = true;
            }
            /* jobb felso pontja */
            if (pos.x < maxcoordX && pos.y > mincoordY) {
                    topRigth = true;
            }
            /* jobb also pontja */
            if (pos.x < maxcoordX && pos.y < maxcoordY) {
                    bottomRight = true;
            }
        });
    if (bottomLeft === false || bottomRight === false || topLeft === false || topRigth === false) {
        b = false;
	}
	return b;
}

function searchNearestRoute(start, end) {

	let min_start = getDistance(start, {x: plan.routes.peaks[0].x, y: plan.routes.peaks[0].y});
	let min_start_index = 0;
	let min_dest = getDistance(end, {x: plan.routes.peaks[0].x, y: plan.routes.peaks[0].y});
	let min_dest_index = 0;
	for (let i = 1; i < plan.routes.peaks.length; ++i) {
		console.log(getDistance(start, {x: plan.routes.peaks[i].x, y: plan.routes.peaks[i].y}));
		if (getDistance(start, {x: plan.routes.peaks[i].x, y: plan.routes.peaks[i].y}) < min_start) {
			min_start = getDistance(start, {x: plan.routes.peaks[i].x, y: plan.routes.peaks[i].y});
			min_start_index = i;
		}
		if (getDistance(end, {x: plan.routes.peaks[i].x, y: plan.routes.peaks[i].y}) < min_dest) {
			min_dest = getDistance(end, {x: plan.routes.peaks[i].x, y: plan.routes.peaks[i].y});
			min_dest_index = i;
		}
	}
	shortest_route = graph.shortest_route(min_start_index.toString(), min_dest_index.toString());
	console.log(s_r.routes);
	draw();
}

function inObject(pos) {
	let b = false;
	let topLeft = false, bottomLeft = false, topRigth = false, bottomRight = false;
	plan.furnitures.forEach(furniture => {
		furniture.data.forEach(coord => {
            let mincoordX = coord.firstPoint.x < coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
            let maxcoordX = coord.firstPoint.x > coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
            let mincoordY = coord.firstPoint.y < coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
            let maxcoordY = coord.firstPoint.y > coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
            /* bal felso pontja */
            if (pos.x > mincoordX && pos.y > mincoordY) {
                    topLeft = true;
            }
            /* bal also pontja */
            if (pos.x > mincoordX && pos.y < maxcoordY) {
                    bottomLeft = true;
            }
            /* jobb felso pontja */
            if (pos.x < maxcoordX && pos.y > mincoordY) {
                    topRigth = true;
            }
            /* jobb also pontja */
            if (pos.x < maxcoordX && pos.y < maxcoordY) {
                    bottomRight = true;
            }
		});
		if (bottomLeft === true && bottomRight && true || topLeft && true || topRigth && true) {
			b = true;
			return true;
		}
	});
	return b;
}

const buttonsize = canvas.height * 0.1;

let searchButton = {
	width: buttonsize,
	height: buttonsize,
	x: canvas.width / 2 - buttonsize / 2,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}

let imgMB = new Image();
imgMB.onload = function () {
	context.drawImage(imgMB, searchButton.x, searchButton.y, searchButton.width, searchButton.height);
};
let pos_by_all;
const draw = function (e) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	imgMB.src = "js/search.svg";
    for (let i = 0; i < plan.walls.length; ++i) {
        context.beginPath();
        context.moveTo(plan.walls[i].firstPoint.x, plan.walls[i].firstPoint.y);
        context.lineTo(plan.walls[i].secondPoint.x, plan.walls[i].secondPoint.y);
        context.stroke();
    }
    for (let i = 0; i < plan.beacons.length; ++i) {
        context.fillStyle = "yellow";
        context.beginPath();
        context.arc(plan.beacons[i].x, plan.beacons[i].y, 5, 0, 2 * Math.PI);
		context.fill();
		context.fillStyle = "black";
	}
	for (let i = 0; i < plan.furnitures.length; ++i) {
		plan.furnitures[i].data.forEach(wall => {
			context.beginPath();
			context.moveTo(wall.firstPoint.x, wall.firstPoint.y);
			context.lineTo(wall.secondPoint.x, wall.secondPoint.y);
			context.stroke();
		});
	}

	let x_tmp = 0;
	let y_tmp = 0;
	
	for (let i = 0; i < positions_.length; ++i) {
		x_tmp = x_tmp + positions_[i].x;
		y_tmp = y_tmp + positions_[i].y;
		context.fillStyle = "black";
		context.beginPath();
		context.arc(positions_[i].x, positions_[i].y, 5, 0, 2 * Math.PI);
		context.fill();
	}
	x_tmp = x_tmp / positions_.length;
	y_tmp = y_tmp / positions_.length;
	if (inRoom({x: x_tmp, y: y_tmp})) {
		pos_by_all = {x: x_tmp, y: y_tmp};
	}
	
	if (pos_by_all !== undefined) {
		context.fillStyle = "brown";
		context.beginPath();
		context.arc(pos_by_all.x, pos_by_all.y, 5, 0, 2 * Math.PI);
		context.fill();
	}

	for (let i = 0; i < positions_.length; ++i) {
		for (let j = 0; j < positions_.length; ++j) {
			if (i != j) {
				context.fillStyle = "blue";
				context.beginPath();
				context.arc((positions_[i].x + positions_[j].x) / 2, (positions_[i].y + positions_[j].y) / 2, 5, 0, 2 * Math.PI);
				context.fill();
			}
		}
	}

	if (pos !== undefined) {
		context.fillStyle = "brown";
		context.beginPath();
		context.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
		context.fill();
	}

	if (followingPoint_ !== undefined) {
		context.fillStyle = "brown";
		context.beginPath();
		context.arc(followingPoint_.x, followingPoint_.y, 5, 0, 2 * Math.PI);
		context.fill();
	}

	if (pointToFollow !== undefined) {
		context.fillStyle = "brown";
		context.beginPath();
		context.arc(pointToFollow.x, pointToFollow.y, 5, 0, 2 * Math.PI);
		context.fill();
	}

	/* for (let i = 0; i < plan.routes.peaks.length; ++i) {
		context.beginPath();
		context.arc(plan.routes.peaks[i].x, plan.routes.peaks[i].y, 5, 0, 2 * Math.PI);
		context.stroke();
		context.font = "15px Arial";
		context.fillText(plan.routes.peaks[i].id, (plan.routes.peaks[i].x + plan.routes.peaks[i].x) / 2, (plan.routes.peaks[i].y + plan.routes.peaks[i].y) / 2)
	} */

	s_r = {routes: shortest_route, coords: Array(shortest_route.length)};
	for (let i = 0; i < plan.routes.peaks.length; ++i) {
		for (let j = 0; j < shortest_route.length; ++j) {
			if (plan.routes.peaks[i].id.toString() === shortest_route[j]) {
				s_r.coords[j] = {x: plan.routes.peaks[i].x, y: plan.routes.peaks[i].y};
			}
		}
	}
	
	/* for (let i = 0; i < plan.routes.edges.length; ++i) {
		context.beginPath();
		context.moveTo(plan.routes.edges[i].from.x, plan.routes.edges[i].from.y);
		context.lineTo(plan.routes.edges[i].to.x, plan.routes.edges[i].to.y);
		context.stroke();
	} */

	for (let i = 0; i < s_r.routes.length - 1; ++i) {
		context.strokeStyle = "red";
		context.beginPath();
		context.moveTo(s_r.coords[i].x, s_r.coords[i].y);
		context.lineTo(s_r.coords[i + 1].x, s_r.coords[i + 1].y);
		context.stroke();
		context.strokeStyle = "black";
	} 
	if (pos_ !== undefined) {
		context.fillStyle = "green";
		context.beginPath();
		context.arc(pos_.x, pos_.y, 5, 0, 2 * Math.PI);
		context.fill();
	}
	
	if (dest !== undefined) {
		context.fillStyle = "red";
		context.beginPath();
		context.arc(dest.x, dest.y, 5, 0, 2 * Math.PI);
		context.fill();
	}
}

function setPos_(sensor_x, sensor_y) {
	pos = {x: pos.x + sensor_x, y: pos.y + sensor_y};
	draw();
}

let isMove;

let move_tmp_ = []
let counter_tmp_;
let moving_direction = 1;

function moveOnRoute() {
	if (s_r.coords.length < 1) return;
	for (let i = 0; i < s_r.coords.length - 1; ++i) {
		pos_ = s_r.coords[i];
		move_tmp_.push(pos_);
		console.log(pos_);
		let distance_ = getDistance(s_r.coords[i], s_r.coords[i + 1]);
		while (distance_ > 0) {
			if (Math.abs(s_r.coords[i].x - s_r.coords[i + 1].x) > Math.abs(s_r.coords[i].y - s_r.coords[i + 1].y)) {
				if (s_r.coords[i].x < s_r.coords[i + 1].x) {
					pos_ = {x: pos_.x + 5, y: pos_.y}
					console.log('1: ' + pos_);
				} else {
					pos_ = {x: pos_.x - 5, y: pos_.y}
					console.log('2: ' + pos_);
				}
			} else {
				if (s_r.coords[i].y < s_r.coords[i + 1].y) {
					pos_ = {x: pos_.x, y: pos_.y + 5}
					console.log('3: ' + pos_);
				} else {
					pos_ = {x: pos_.x, y: pos_.y - 5}
					console.log('4: ' + pos_);
				}
			}
			move_tmp_.push(pos_);
			distance_ = distance_ - 5;
		}
		move_tmp_.push(pos_);
	}

	move_tmp_.push(s_r.coords[s_r.coords.length - 1]);

	counter_tmp_ = 0;

	let blalba = window.setInterval(function(){
			pos_ = move_tmp_[counter_tmp_];
			counter_tmp_ += 1;
			draw();
			if (counter_tmp_ === move_tmp_.length) {
				clearInterval(blalba);
			}
	}, 100);
}

function followTheHerd() {
	let blalba2 = window.setInterval(function(){
		if (isMove == 1) {
			if (pos_by_all.x < pos_.x) {
				if (pos_by_all.y < pos_.y) {
					pos_ = {x: pos_.x - 2, y: pos_.y - 2};
				} else if (pos_by_all.y == pos_.y) {
					pos_ = {x: pos_.x - 2, y: pos_.y};
				} else {
					pos_ = {x: pos_.x - 2, y: pos_.y + 2};
				}
			} else if (pos_by_all.x == pos_.x) {
				if (pos_by_all.y < pos_.y) {
					pos_ = {x: pos_.x, y: pos_.y - 2};
				} else if (pos_by_all.y == pos_.y) {
					pos_ = {x: pos_.x, y: pos_.y};
				} else {
					pos_ = {x: pos_.x, y: pos_.y + 2};
				}
			} else {
				if (pos_by_all.y < pos_.y) {
					pos_ = {x: pos_.x + 2, y: pos_.y - 2};
				} else if (pos_by_all.y == pos_.y) {
					pos_ = {x: pos_.x + 2, y: pos_.y};
				} else {
					pos_ = {x: pos_.x + 2, y: pos_.y + 2};
				}
			}
		}
			if (counter_tmp_ === move_tmp_.length) {
				clearInterval(blalba2);
			}
	}, 100);
}

// FOLYOSO
let followingPoint_;
let pointToFollow;
function setPointToFollow(arr) {
	let curr_max = arr[0];
	for (let j = 1; j < arr.length; ++j) {
		if (curr_max.d < arr[j].d) {
			curr_max = arr[j];
		}
	}
	pointToFollow = {x: curr_max.x + 6, y: curr_max.y + 6};
	if (followingPoint_ == undefined) {
		followingPoint_ = pointToFollow;
	}
	draw();
}

function initAisleStuff() {
	let blalba_ = window.setInterval(function(){
		/* if (isMove == 1) { */
			if (pointToFollow.x < followingPoint_.x) {
				if (pointToFollow.y < followingPoint_.y) {
					followingPoint_ = {x: followingPoint_.x - 2, y: followingPoint_.y - 2};
				} else if (pointToFollow.y == followingPoint_.y) {
					followingPoint_ = {x: followingPoint_.x - 2, y: followingPoint_.y};
				} else {
					followingPoint_ = {x: followingPoint_.x - 2, y: followingPoint_.y + 2};
				}
			} else if (pointToFollow.x == followingPoint_.x) {
				if (pointToFollow.y < followingPoint_.y) {
					followingPoint_ = {x: followingPoint_.x, y: followingPoint_.y - 2};
				} else if (pointToFollow.y == followingPoint_.y) {
					followingPoint_ = {x: followingPoint_.x, y: followingPoint_.y};
				} else {
					followingPoint_ = {x: followingPoint_.x, y: followingPoint_.y + 2};
				}
			} else {
				if (pointToFollow.y < followingPoint_.y) {
					followingPoint_ = {x: followingPoint_.x + 2, y: followingPoint_.y - 2};
				} else if (pointToFollow.y == followingPoint_.y) {
					followingPoint_ = {x: followingPoint_.x + 2, y: followingPoint_.y};
				} else {
					followingPoint_ = {x: followingPoint_.x + 2, y: followingPoint_.y + 2};
				}
			}
		/* } */
		draw();
	}, 100);
}

function init() {
	scalePlan();
	scaleFurnitures();
	scaleGraph();
	graph = initGraph();
	console.log(graph);
	let n1 = 5;
	let n2 = 10;
	shortest_route = graph.shortest_route(n1.toString(), n2.toString());
	//pos = {x: 100, y: 100};
    //sensor = new Accelerometer();
	sensor.start();
	
    /* sensor.onreading = () => {
		if (sensor.x + sensor.y>= 4) {
			isMove = 1;
		} else {
			isMove = 0;
		}}
	sensor.onerror = event => console.log(event.error.name, event.error.message); */
	pedometer = new Pedometer();
	let blalba_32 = window.setInterval(function(){
		setActivity(sensor.x, sensor.y, sensor.z);
	}, 1000);
	draw();
	//moveOnRoute();
	if (pos_ == undefined) {
		pos_ = {x: 100, y: 100};
	}
	followTheHerd();
	initAisleStuff();
}

function setActivity(x, y, z) {
	let norm = Math.sqrt(x * x + y * y + z * z);
	if (norm > 0.5) {
		isMove = 1;
	} else {
		isMove = 0;
	}
}

let pedometer;
function calcSteps() {
	
}

init();