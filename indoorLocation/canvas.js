const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

let drawingPhase = true; // kézi rajzolási fázis
let rightAnglingPhase = false; // itt már nem lehet rajzolni, méreteket lehet megadni
let beaconPhase = false; // jeladókat lehet elhelyezni TODO

let scale_permanent;

// Falak kezdő-és végpontjaik, méreteik, irányaik
let coords = [];

// Jeladók pozíviója
let beacons = [];

// "gombok" ... "mButton - middle button"
let mButton = {
	width: canvas.width / 3,
	height: canvas.height / 10,
	x: canvas.width / 3,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}

let deleteButton = {
	width: canvas.width / 10,
	height: canvas.height / 10,
	x: canvas.width - canvas.width / 9,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}

let backButton = {
	width: canvas.width / 10,
	height: canvas.height / 10,
	x: canvas.width / 9 - canvas.width / 10,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}

canvas.onclick = function (e) {
	// Middle button // TODO
	if (e.layerX > mButton.x && e.layerX < mButton.x + mButton.width &&
		e.layerY > mButton.y && e.layerY < mButton.y + mButton.height) {
			if (drawingPhase) {
				coords.splice(-1,1);
				rightAngling();
			} else if (rightAnglingPhase) {
				save();
			} else if (beaconPhase) {

			}
	}
	// Right button (delete)
	if (e.layerX > deleteButton.x && e.layerX < deleteButton.x + deleteButton.width &&
		e.layerY > deleteButton.y && e.layerY < deleteButton.y + deleteButton.height) {
			clear();
	}

	if (rightAnglingPhase || beaconPhase) {
		for (let i = 0; i < coords.length; ++i) {
			if (coords[i].firstPoint.x === coords[i].secondPoint.x
				&& coords[i].firstPoint.y > coords[i].secondPoint.y) {
					if (e.layerX > coords[i].firstPoint.x - 5 && e.layerX < coords[i].secondPoint.x + 5 &&
						e.layerY < coords[i].firstPoint.y && e.layerY > coords[i].secondPoint.y) {
							if (rightAnglingPhase) {
								let size = prompt("Méret:");
								if (parseInt(size) != NaN) {
									coords[i].size = parseInt(size);
									coords[i].direction = 'North';
									context.clearRect(0,0,canvas.width,canvas.height);
									draw();
								}
							}
							if (beaconPhase) {
								setBeacon(i, e);
								context.clearRect(0,0,canvas.width,canvas.height);
								draw();
							}
					}
			}
			if (coords[i].firstPoint.x === coords[i].secondPoint.x
				&& coords[i].firstPoint.y < coords[i].secondPoint.y) {
					if (e.layerX > coords[i].firstPoint.x - 5 && e.layerX < coords[i].secondPoint.x + 5 &&
						e.layerY > coords[i].firstPoint.y && e.layerY < coords[i].secondPoint.y) {
							if (rightAnglingPhase) {
								let size = prompt("Méret:");
								if (parseInt(size) != NaN) {
									coords[i].size = parseInt(size);
									coords[i].direction = 'South';
									context.clearRect(0,0,canvas.width,canvas.height);
									draw();
								}
							}
							if (beaconPhase) {
								setBeacon(i, e);
								context.clearRect(0,0,canvas.width,canvas.height);
								draw();
							}
					}
			}
			if (coords[i].firstPoint.y === coords[i].secondPoint.y
				&& coords[i].firstPoint.x < coords[i].secondPoint.x) {
					if (e.layerX > coords[i].firstPoint.x && e.layerX < coords[i].secondPoint.x &&
						e.layerY > coords[i].firstPoint.y - 5 && e.layerY < coords[i].secondPoint.y + 5) {
							if (rightAnglingPhase) {
								let size = prompt("Méret:");
								if (parseInt(size) != NaN) {
									coords[i].size = parseInt(size);
									coords[i].direction = 'East';
									context.clearRect(0,0,canvas.width,canvas.height);
									draw();
								}
							}
							if (beaconPhase) {
								setBeacon(i, e);
								context.clearRect(0,0,canvas.width,canvas.height);
								draw();
							}
					}
			}
			if (coords[i].firstPoint.y === coords[i].secondPoint.y
				&& coords[i].firstPoint.x > coords[i].secondPoint.x) {
					if (e.layerX < coords[i].firstPoint.x && e.layerX > coords[i].secondPoint.x &&
						e.layerY > coords[i].firstPoint.y - 5 && e.layerY < coords[i].secondPoint.y + 5) {
							if (rightAnglingPhase) {
								let size = prompt("Méret:");
								if (parseInt(size) != NaN) {
									coords[i].size = parseInt(size);
									coords[i].direction = 'West';
									context.clearRect(0,0,canvas.width,canvas.height);
									draw();
								}
							}
							if (beaconPhase) {
								setBeacon(i, e);
								context.clearRect(0,0,canvas.width,canvas.height);
								draw();
							}
					}
			}
		}
	}
}

function setBeacon(index, e) {
	let b = false;
	for (let i = 0; i < beacons.length; ++i) {
		if (e.layerX > beacons[i].x - 7 && e.layerX < beacons[i].x + 7
			&& e.layerY > beacons[i].y - 7 && e.layerY < beacons[i].y + 7
			&& beacons[i].wall === index) {
				if (confirm('Biztos kitörli ezt a jeladót?')) {
					beacons.splice(i,1);
				}
				b = true;
				return;
		}
	}

	if (b) return;

	let coordX, coordY, posFromFirstPoint;

	switch (coords[index].direction) {
		case 'North':
			coordX = coords[index].firstPoint.x;
			coordY = e.clientY;
			posFromFirstPoint = (coords[index].firstPoint.y - e.clientY) * scale_permanent;
			break;
		case 'South':
			coordX = coords[index].firstPoint.x;
			coordY = e.clientY;
			posFromFirstPoint = (e.clientY - coords[index].firstPoint.y) * scale_permanent;
			break;
		case 'East':
			coordX = e.clientX;
			coordY = coords[index].firstPoint.y;
			posFromFirstPoint = (e.clientX - coords[index].firstPoint.x) * scale_permanent;
			break;
		case 'West':
			coordX = e.clientX;
			coordY = coords[index].firstPoint.y;
			posFromFirstPoint = (coords[index].firstPoint.x - e.clientX) * scale_permanent;
			break;
	}
	console.log('coordX: ',coordX);
	console.log('coordY: ',coordY);
	console.log('posFromFirstPoint: ',posFromFirstPoint);

	beacons.push({x: coordX, y: coordY, wall: index, pos: posFromFirstPoint});
}

// TODO
function scalingToWindowSize() {
	let n=0,e=0,s=0,w=0;	// sum(kül. irányú falak)
	let nws = [], ews = [], sws = [], wws = [];
	coords.forEach(coord => {
		switch (coord.direction) {
			case 'North':
				n += coord.size;
				nws.push(coord);
				break;
			case 'East':
				e += coord.size;
				ews.push(coord);
				break;
			case 'South':
				s += coord.size;
				sws.push(coord);
				break;
			case 'West':
				w += coord.size;
				wws.push(coord);
				break;
		}
	});
	if (n !== s || e !== w) {
		alert("Valami nem jó a méretekkel!");
		return;
	}

	let stmp1 = canvas.height * 0.85 / s;
	let stmp2 = canvas.width * 0.95 / e;
	const scale = stmp1 < stmp2 ? Math.round(stmp1) : Math.round(stmp2);
	scale_permanent = scale;
	// most left position
	let mostLeft = coords[0];
	let mlIndex = 0;

	let index = 0;
	coords.forEach(coord => {
		if (coord.firstPoint.x < mostLeft.firstPoint.x || coord.secondPoint.x < mostLeft.firstPoint.x ||
			coord.firstPoint.x < mostLeft.secondPoint.x || coord.secondPoint.x < mostLeft.secondPoint.x) {
			mostLeft = coord;
			mlIndex = index;
		}
		++index;
	});

	switch (coords[mlIndex].direction) {
		case 'North':
			coords[mlIndex].firstPoint.x = canvas.width * 0.025;
			coords[mlIndex].firstPoint.y = 0;
			coords[mlIndex].secondPoint.x = coords[mlIndex].firstPoint.x;
			coords[mlIndex].secondPoint.y = coords[mlIndex].firstPoint.y - scale * coords[mlIndex].size;
			break;
		case 'South':
			coords[mlIndex].firstPoint.x = canvas.width * 0.025;
			coords[mlIndex].firstPoint.y = 0;
			coords[mlIndex].secondPoint.x = coords[mlIndex].firstPoint.x;
			coords[mlIndex].secondPoint.y = coords[mlIndex].firstPoint.y + scale * coords[mlIndex].size;
			break;
		case 'East':
			coords[mlIndex].secondPoint.x = canvas.width * 0.025;
			coords[mlIndex].secondPoint.y = 0;
			coords[mlIndex].firstPoint.x = coords[mlIndex].secondPoint.x + scale * coords[mlIndex].size;
			coords[mlIndex].firstPoint.y = coords[mlIndex].secondPoint.y;
			break;
		case 'West':
			coords[mlIndex].firstPoint.x = canvas.width * 0.025;
			coords[mlIndex].firstPoint.y = 0;
			coords[mlIndex].secondPoint.x = coords[mlIndex].firstPoint.x + scale * coords[mlIndex].size;
			coords[mlIndex].secondPoint.y = coords[mlIndex].firstPoint.y;
			break;
	}
	for (let i = mlIndex + 1; i < coords.length; ++i) {
		if (coords[i].direction === 'North') {
			coords[i].firstPoint = coords[i-1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x
			coords[i].secondPoint.y = coords[i].firstPoint.y - scale * coords[i].size;
		} else if (coords[i].direction === 'South') {
			coords[i].firstPoint = coords[i-1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x;
			coords[i].secondPoint.y = coords[i].firstPoint.y + scale * coords[i].size;
		} else if (coords[i].direction === 'East') {
			coords[i].firstPoint = coords[i-1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x + scale * coords[i].size;
			coords[i].secondPoint.y = coords[i].firstPoint.y;
		} else if (coords[i].direction === 'West') {
			coords[i].firstPoint = coords[i-1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x - scale * coords[i].size;
			coords[i].secondPoint.y = coords[i].firstPoint.y;
		}
	}
	for (let i = mlIndex - 1; i >= 0; --i) {
		if (coords[i].direction === 'North') {
			coords[i].secondPoint = coords[i+1].firstPoint;
			coords[i].firstPoint.x = coords[i].secondPoint.x
			coords[i].firstPoint.y = coords[i].secondPoint.y + scale * coords[i].size;
		} else if (coords[i].direction === 'South') {
			coords[i].secondPoint = coords[i+1].firstPoint;
			coords[i].firstPoint.x = coords[i].secondPoint.x;
			coords[i].firstPoint.y = coords[i].secondPoint.y - scale * coords[i].size;
		} else if (coords[i].direction === 'East') {
			coords[i].secondPoint = coords[i+1].firstPoint;
			coords[i].firstPoint.x = coords[i].secondPoint.x - scale * coords[i].size;
			coords[i].firstPoint.y = coords[i].secondPoint.y;
		} else if (coords[i].direction === 'West') {
			coords[i].secondPoint = coords[i+1].firstPoint;
			coords[i].firstPoint.x = coords[i].secondPoint.x + scale * coords[i].size;
			coords[i].firstPoint.y = coords[i].secondPoint.y;
		}
	}
	coords[coords.length - 1].secondPoint = coords[0].firstPoint;

	// top position
	let topPos = coords[0];
	let topIndex = 0;

	index = 0;
	coords.forEach(coord => {
		if (coord.firstPoint.y < topPos.firstPoint.y || coord.secondPoint.y < topPos.firstPoint.y ||
			coord.firstPoint.y < topPos.secondPoint.y || coord.secondPoint.y < topPos.secondPoint.y) {
				topPos = coord;
				topIndex = index;
		}
		++index;
	});

	const topY = topPos.firstPoint.y < topPos.secondPoint.y ? 
					(Math.abs(topPos.firstPoint.y) + canvas.height * 0.85 * 0.0375): (Math.abs(topPos.secondPoint.y) + canvas.height * 0.85 * 0.0375);

	for (let i = 0; i < coords.length; ++i) {
		coords[i].firstPoint.y = coords[i].firstPoint.y + topY;
		//coords[i].secondPoint.y = coords[i].secondPoint.y + topY;
	}

	drawingPhase = false; // kézi rajzolási fázis
	rightAnglingPhase = false; // itt már nem lehet rajzolni, méreteket lehet megadni
	beaconPhase = true;

	context.clearRect(0,0,canvas.width,canvas.height);
}

// "falak szögesítése", "falak kiegyenesítése"
function rightAngling() {
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
			coords[i].firstPoint = coords[i-1].secondPoint;
			coords[i].secondPoint.x = coords[i].firstPoint.x;
			direction = 'vertical';
		} else {
			coords[i].firstPoint = coords[i-1].secondPoint;
			coords[i].secondPoint.y = coords[i].firstPoint.y;
			direction = 'horizontal';
		}
	}
	
	if (direction === 'horizontal') {
		coords[coords.length-1].secondPoint.x = coords[0].firstPoint.x;
		coords[0].firstPoint.y = coords[coords.length-1].secondPoint.y;
	} else {
		coords[coords.length-1].secondPoint.y= coords[0].firstPoint.y;
		coords[0].firstPoint.x = coords[coords.length-1].secondPoint.x;
	}

	drawingPhase = false;
	rightAnglingPhase = true;
	context.clearRect(0,0,canvas.width,canvas.height);
	draw();
}

function clear() {
	let b = confirm("Törli az eddigi rajzot?");
	if (!b) return;
	context.clearRect(0,0,canvas.width,canvas.height);
	prevX, currX, prevY, currY = undefined;
	coords = [];
	drawingPhase = true;
	rightAnglingPhase = false;
	draw();
}

// TODO
function save() {
	let b = true;
	coords.forEach(coord => {
		if (coord.size <= 0) {
			b = false;
		}
	});
	if (!b) {
		alert("Nincsen megadva az összes fal mérete!");
	} else {
		let tname = prompt('Alaprajz neve:');
		scalingToWindowSize();
		draw();
		/* drawingPhase = false;
		rightAnglingPhase = false;
		beaconPhase = true; */
	}
}

// Egér eseménykezelők rajzoláshoz 
canvas.addEventListener("mousemove", function (e) {
	if (drawingPhase) {
		paintCoord('move', e);
	}
}, false);
canvas.addEventListener("mousedown", function (e) {
	if (drawingPhase) {
		paintCoord('down', e);
	}
}, false);
canvas.addEventListener("mouseup", function (e) {
	if (drawingPhase) {
		paintCoord('up', e);
	}
}, false);
canvas.addEventListener("mouseout", function (e) {
	if (drawingPhase) {
		paintCoord('out', e);
	}
}, false);

let flag = false;
let prevX, prevY;
let currX ,currY;
let dot_flag = false;

let firstPoint;
let secondPoint;
let fPB = false;

function paintCoord(ms, e) {
	if (!drawingPhase) return; // amúgy sem lenne meghívva a fgv. ebben az esetben
	if (ms === 'down') {
		prevX = currX;
		prevY = currY;
		currX = e.clientX - canvas.offsetLeft;
		currY = e.clientY - canvas.offsetTop;

		if (!fPB) {
			firstPoint = {x: currX, y: currY};
			fPB = true;
		}

		flag = true;
		dot_flag = true;
		if (dot_flag) {
			context.beginPath();
			context.fillStyle = "black";
			context.fillRect(currX, currY, 2, 2);
			context.closePath();
			dot_flag = false;
		}
	}
	if (ms === 'up' || ms === "out") {
		if (ms == 'up') {
			currX = e.clientX - canvas.offsetLeft;
			currY = e.clientY - canvas.offsetTop;
			secondPoint = {x: currX, y: currY};
			coords.push({firstPoint, secondPoint, size: 0, direction: ''});
			console.log(coords);
			fPB = false;
		}
		if (ms === 'out') {
			fPB = false;
		}
		flag = false;
	}
	if (ms === 'move') {
		if (flag) {
			prevX = currX;
			prevY = currY;
			currX = e.clientX - canvas.offsetLeft;
			currY = e.clientY - canvas.offsetTop;
			draw();
		}
	}
}

// svg imgs
let imgMB = new Image();
imgMB.onload = function() {
	context.drawImage(imgMB, mButton.x, mButton.y, mButton.width, mButton.height);
};
let imgBB = new Image();
imgBB.onload = function() {
	context.drawImage(imgBB, backButton.x, backButton.y, backButton.width, backButton.height);
};
let imgDB = new Image();
imgDB.onload = function() {
	context.drawImage(imgDB, deleteButton.x, deleteButton.y, deleteButton.width, deleteButton.height);
};

const draw = function (e) {
	if (drawingPhase) {
		imgMB.src = "svg_files/arrow-90deg-right.svg";	
		imgBB.src = "svg_files/arrow-return-left.svg";
		imgDB.src = "svg_files/trash-fill.svg";
		context.beginPath();
		context.moveTo(prevX, prevY);
		context.lineTo(currX, currY);
		context.strokeStyle = "black";
		context.lineWidth = 2;
		context.stroke();
		context.closePath();
	}
	if (rightAnglingPhase) {
		imgMB.src = "svg_files/save.svg";
		imgBB.src = "svg_files/arrow-return-left.svg";
		imgDB.src = "svg_files/trash-fill.svg";
		if (coords.length < 4) return;
		let h = (canvas.height - mButton.height - mButton.y);
		context.clearRect(0,0,canvas.width,h);
		for (let i = 0; i < coords.length; ++i) {
			context.beginPath();
			context.moveTo(coords[i].firstPoint.x, coords[i].firstPoint.y);
			context.lineTo(coords[i].secondPoint.x, coords[i].secondPoint.y);
			context.stroke();
			context.font = "15px Arial";
			context.fillText(coords[i].size,(coords[i].firstPoint.x + coords[i].secondPoint.x) / 2,(coords[i].firstPoint.y + coords[i].secondPoint.y) / 2)
		}
	}
	if (beaconPhase) {
		imgMB.src = "svg_files/save.svg";	
		imgBB.src = "svg_files/arrow-return-left.svg";
		imgDB.src = "svg_files/trash-fill.svg";
		let h = (canvas.height - mButton.height - mButton.y);
		context.clearRect(0,0,canvas.width,h);
		for (let i = 0; i < coords.length; ++i) {
			context.beginPath();
			context.moveTo(coords[i].firstPoint.x, coords[i].firstPoint.y);
			context.lineTo(coords[i].secondPoint.x, coords[i].secondPoint.y);
			context.stroke();
			context.font = "15px Arial";
			context.fillText(coords[i].size,(coords[i].firstPoint.x + coords[i].secondPoint.x) / 2,(coords[i].firstPoint.y + coords[i].secondPoint.y) / 2)
		}
		for (let i = 0; i < beacons.length; ++i) {
			context.strokeStyle = "red";
			context.beginPath();
			context.arc(beacons[i].x, beacons[i].y, 10, 0, 2 * Math.PI);
			context.stroke();
		}
		context.strokeStyle = "black";
	}
}
draw();