const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

let drawingPhase = true;		// kézi rajzolási fázis
let squaringPhase = false;		// itt már nem lehet rajzolni, a falak méreteit lehet megadni
let beaconPhase = false;		// jeladókat lehet elhelyezni, megadni a méretét
let drawAll = false;			// kirajzol mindent a megadott méretek szerint a képernyőhöz arányosan, majd itt el lehet menteni (TODO SAVE)

let scale_permanent;			// arány 1:

// Falak kezdő-és végpontjaik, méreteik, irányaik
let coords = [];

// Jeladók pozíciója
let beacons = [];

// "gombok" ... "mButton - middle button"
let mButton = {
	width: canvas.width / 3,
	height: canvas.height / 10,
	x: canvas.width / 3,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}
let deleteButton = {
	width: canvas.width / 10,
	height: canvas.height / 10,
	x: canvas.width - canvas.width / 9,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}
let backButton = {
	width: canvas.width / 10,
	height: canvas.height / 10,
	x: canvas.width / 9 - canvas.width / 10,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}

canvas.onclick = function (e) {
	// Middle button // TODO
	if (e.layerX > mButton.x && e.layerX < mButton.x + mButton.width &&
		e.layerY > mButton.y && e.layerY < mButton.y + mButton.height) {
		if (drawingPhase) {
			coords.splice(-1, 1);
			next();
		} else {
			next();
			context.clearRect(0, 0, canvas.width, canvas.height);
			draw();
		}
		//next();
	}
	// Right button (delete)
	if (e.layerX > deleteButton.x && e.layerX < deleteButton.x + deleteButton.width &&
		e.layerY > deleteButton.y && e.layerY < deleteButton.y + deleteButton.height) {
		clear();
	}

	// Left button
	if (e.layerX > backButton.x && e.layerX < backButton.x + backButton.width &&
		e.layerY > backButton.y && e.layerY < backButton.y + backButton.height) {
		if (squaringPhase || drawingPhase) {
			coords.splice(-1, 1);
		}
		back();
	}

	if (squaringPhase || beaconPhase) {
		for (let i = 0; i < coords.length; ++i) {
			if (coords[i].firstPoint.x === coords[i].secondPoint.x
				&& coords[i].firstPoint.y > coords[i].secondPoint.y) {
				if (e.layerX > coords[i].firstPoint.x - 5 && e.layerX < coords[i].secondPoint.x + 5 &&
					e.layerY < coords[i].firstPoint.y && e.layerY > coords[i].secondPoint.y) {
					if (squaringPhase) {
						let size = prompt("Méret:");
						if (parseInt(size) != NaN) {
							coords[i].size = parseInt(size);
							coords[i].direction = 'North';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						}
					}
					if (beaconPhase) {
						setBeacon(i, e);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			}
			if (coords[i].firstPoint.x === coords[i].secondPoint.x
				&& coords[i].firstPoint.y < coords[i].secondPoint.y) {
				if (e.layerX > coords[i].firstPoint.x - 5 && e.layerX < coords[i].secondPoint.x + 5 &&
					e.layerY > coords[i].firstPoint.y && e.layerY < coords[i].secondPoint.y) {
					if (squaringPhase) {
						let size = prompt("Méret:");
						if (parseInt(size) != NaN) {
							coords[i].size = parseInt(size);
							coords[i].direction = 'South';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						}
					}
					if (beaconPhase) {
						setBeacon(i, e);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			}
			if (coords[i].firstPoint.y === coords[i].secondPoint.y
				&& coords[i].firstPoint.x < coords[i].secondPoint.x) {
				if (e.layerX > coords[i].firstPoint.x && e.layerX < coords[i].secondPoint.x &&
					e.layerY > coords[i].firstPoint.y - 5 && e.layerY < coords[i].secondPoint.y + 5) {
					if (squaringPhase) {
						let size = prompt("Méret:");
						if (parseInt(size) != NaN) {
							coords[i].size = parseInt(size);
							coords[i].direction = 'East';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						}
					}
					if (beaconPhase) {
						setBeacon(i, e);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			}
			if (coords[i].firstPoint.y === coords[i].secondPoint.y
				&& coords[i].firstPoint.x > coords[i].secondPoint.x) {
				if (e.layerX < coords[i].firstPoint.x && e.layerX > coords[i].secondPoint.x &&
					e.layerY > coords[i].firstPoint.y - 5 && e.layerY < coords[i].secondPoint.y + 5) {
					if (squaringPhase) {
						let size = prompt("Méret:");
						if (parseInt(size) != NaN) {
							coords[i].size = parseInt(size);
							coords[i].direction = 'West';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						}
					}
					if (beaconPhase) {
						setBeacon(i, e);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			}
		}
	}
}



function squaringTheRightWay() {
	if (coords.length < 4) {
		alert('Kevés fal lett rajzolva!');
		return;
	}
	if (coords.length % 2 === 1) {
		alert('Páratlan a falak száma!');
		return;
	}

	let tmp_coords = [];
	const basic_length = coords.length;
	tmp_coords.push({ firstPoint: coords[0].firstPoint, secondPoint: coords[0].secondPoint, size: 0, direction: coords[0].direction });
	coords.splice(0, 1);
	let last12;
	while (tmp_coords.length < basic_length) {
		let tmp_curr = coords[0];
		let tmp_index = 0;
		let tmp_point = 0;
		for (let i = 0; i < coords.length; ++i) {

			let firstPointDistance = Math.sqrt(Math.pow(coords[i].firstPoint.x - tmp_coords[tmp_coords.length - 1].secondPoint.x, 2)
				+ Math.pow(coords[i].firstPoint.y - tmp_coords[tmp_coords.length - 1].secondPoint.y, 2));

			let secondPointDistance = Math.sqrt(Math.pow(coords[i].secondPoint.x - tmp_coords[tmp_coords.length - 1].secondPoint.x, 2)
				+ Math.pow(coords[i].secondPoint.y - tmp_coords[tmp_coords.length - 1].secondPoint.y, 2));

			let tmp_firstPointDistance = Math.sqrt(Math.pow(tmp_curr.firstPoint.x - tmp_coords[tmp_coords.length - 1].secondPoint.x, 2)
				+ Math.pow(tmp_curr.firstPoint.y - tmp_coords[tmp_coords.length - 1].secondPoint.y, 2));
			
			let tmp_secondPointDistance = Math.sqrt(Math.pow(tmp_curr.secondPoint.x - tmp_coords[tmp_coords.length - 1].secondPoint.x, 2)
				+ Math.pow(tmp_curr.secondPoint.y - tmp_coords[tmp_coords.length - 1].secondPoint.y, 2));

			let minDistance = tmp_firstPointDistance < tmp_secondPointDistance ? tmp_firstPointDistance : tmp_secondPointDistance;

			console.log('first1: ', firstPointDistance);
			console.log('second1: ', secondPointDistance);
			console.log('min1: ', minDistance)

			if (firstPointDistance < minDistance) {
				tmp_curr = coords[i];
				tmp_index = i;
				tmp_point = 1;
				last12 = 1;
			}
			if (secondPointDistance < minDistance) {
				tmp_curr = coords[i];
				tmp_index = i;
				tmp_point = 2;
				last12 = 2;
			}

			console.log('first2: ', firstPointDistance);
			console.log('second2: ', secondPointDistance);
			console.log('min2: ', minDistance)
		}
		if (tmp_point === 1) {
			tmp_coords.push({ firstPoint: tmp_curr.firstPoint, secondPoint: tmp_curr.secondPoint, size: 0, direction: '' });
		} else if (tmp_point === 2) {
			tmp_coords.push({ firstPoint: tmp_curr.secondPoint, secondPoint: tmp_curr.firstPoint, size: 0, direction: '' });
		} else {
			let firstPointDistance = Math.sqrt(Math.pow(tmp_curr.firstPoint.x - tmp_coords[tmp_coords.length - 1].secondPoint.x, 2)
				+ Math.pow(tmp_curr.firstPoint.y - tmp_coords[tmp_coords.length - 1].secondPoint.y, 2));

			let secondPointDistance = Math.sqrt(Math.pow(tmp_curr.secondPoint.x - tmp_coords[tmp_coords.length - 1].secondPoint.x, 2)
				+ Math.pow(tmp_curr.secondPoint.y - tmp_coords[tmp_coords.length - 1].secondPoint.y, 2));

			if (firstPointDistance < secondPointDistance) {
				tmp_coords.push({ firstPoint: tmp_curr.firstPoint, secondPoint: tmp_curr.secondPoint, size: 0, direction: '' });
			} else {
				tmp_coords.push({ firstPoint: tmp_curr.secondPoint, secondPoint: tmp_curr.firstPoint, size: 0, direction: '' });
			}
		}
		coords.splice(tmp_index, 1);
	}

	coords = tmp_coords;

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
	context.clearRect(0, 0, canvas.width, canvas.height);
	draw();
}

function setBeacon(index, e) {
	let b = false;
	for (let i = 0; i < beacons.length; ++i) {
		if (e.layerX > beacons[i].x - 15 && e.layerX < beacons[i].x + 15
			&& e.layerY > beacons[i].y - 15 && e.layerY < beacons[i].y + 15
			&& beacons[i].wall === index) {
			if (confirm('Törli ezt a jeladót?')) {
				beacons.splice(i, 1);
			}
			console.log(beacons[i]);
			b = true;
			return;
		}
	}

	if (b) return;

	let size;
	size = parseInt(prompt('Adja meg a méretet a felső vagy a bal sarokhoz viszonyítva:'));
	while (size > coords[index].size) {
		alert('Hibás méret!');
		size = parseInt(prompt('Adja meg a méretet a felső vagy a bal sarokhoz viszonyítva:'));
	}

	let coordX, coordY, posFromFirstPoint;

	switch (coords[index].direction) {
		case 'North':
			coordX = coords[index].firstPoint.x;
			coordY = e.clientY;
			posFromFirstPoint = coords[index].size - size;
			break;
		case 'South':
			coordX = coords[index].firstPoint.x;
			coordY = e.clientY;
			posFromFirstPoint = size;
			break;
		case 'East':
			coordX = e.clientX;
			coordY = coords[index].firstPoint.y;
			posFromFirstPoint = size;
			break;
		case 'West':
			coordX = e.clientX;
			coordY = coords[index].firstPoint.y;
			posFromFirstPoint = coords[index].size - size;
			break;
	}
	beacons.push({ x: coordX, y: coordY, wall: index, pos: posFromFirstPoint });
}

// TODO
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
	if (n !== s || e !== w) {
		alert("Hibás méretek!");
		return;
	}

	let stmp1 = canvas.height * 0.85 / s;
	let stmp2 = canvas.width * 0.95 / e;
	const scale = stmp1 < stmp2 ? Math.round(stmp1) : Math.round(stmp2);
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
	let topIndex = 0;

	index = 0;
	coords.forEach(coord => {
		if (coord.firstPoint.y < topPos.firstPoint.y || coord.secondPoint.y < topPos.firstPoint.y ||
			coord.firstPoint.y < topPos.secondPoint.y || coord.secondPoint.y < topPos.secondPoint.y) {
			topPos = coord;
			topIndex = index;
		}
		++index;
	});

	const topY = topPos.firstPoint.y < topPos.secondPoint.y ?
		(Math.abs(topPos.firstPoint.y) + canvas.height * 0.85 * 0.0375) : (Math.abs(topPos.secondPoint.y) + canvas.height * 0.85 * 0.0375);

	for (let i = 0; i < coords.length; ++i) {
		coords[i].firstPoint.y = coords[i].firstPoint.y + topY;
		//coords[i].secondPoint.y = coords[i].secondPoint.y + topY; ??????????? miért csinálja meg e nélkül ????? TODO
	}

	drawingPhase = false;
	squaringPhase = false;
	beaconPhase = true;

	context.clearRect(0, 0, canvas.width, canvas.height);
}

function next() {
	if (drawingPhase) {
		//squaring();
		squaringTheRightWay();
		draw();
		drawingPhase = false;
		squaringPhase = true;
	} else if (squaringPhase) {
		scalingToWindowSize();
		draw();
		squaringPhase = false;
		beaconPhase = true;
	} else if (beaconPhase) {
		draw();
		beaconPhase = false;
		drawAll = true;
	} else if (drawAll) {
		save();
	}
}

function back() {
	if (drawingPhase) { // TODO menü?
		drawingPhase = true;
		squaringPhase = false;
		coords.splice(-1, 1);
		draw();
	}
	if (squaringPhase) {
		drawingPhase = true;
		squaringPhase = false;
		coords = [];
		draw();
	}
	if (beaconPhase) {
		squaringPhase = true;
		beaconPhase = false;
		beacons = [];
		draw();
	}
	if (drawAll) {
		beaconPhase = true;
		drawAll = false;
		draw();
	}
}

// "falak szögesítése, kiegyenesítése"
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
	context.clearRect(0, 0, canvas.width, canvas.height);
	draw();
}

function clear() {
	let b = confirm("Törli az eddigi rajzot?");
	if (!b) return;
	prevX, currX, prevY, currY = undefined;
	coords = [];
	beacons = [];
	drawingPhase = true;
	squaringPhase = false;
	beaconPhase = false;
	context.clearRect(0, 0, canvas.width, canvas.height);
	draw();
}

// TODO
function save() {
	let b = true;
	coords.forEach(coord => {
		if (coord.size <= 0) {
			b = false;
		}
	});
	let tname;
	if (!b) {
		alert("Nincsen megadva az összes fal mérete!");
	} else {
		tname = prompt('Alaprajz neve:');

		// Ez a forma?
		const toSave = {
			name: tname,
			walls: coords,
			beacons: beacons
		}
		console.log(toSave);
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


// -- Kézi rajzolás --
let flag = false;
let prevX, prevY;
let currX, currY;
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
			firstPoint = { x: currX, y: currY };
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
			secondPoint = { x: currX, y: currY };
			coords.push({ firstPoint, secondPoint, size: 0, direction: '' });
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
// -------------------


// svg images
let imgMB = new Image();
imgMB.onload = function () {
	context.drawImage(imgMB, mButton.x, mButton.y, mButton.width, mButton.height);
};
let imgBB = new Image();
imgBB.onload = function () {
	context.drawImage(imgBB, backButton.x, backButton.y, backButton.width, backButton.height);
};
let imgDB = new Image();
imgDB.onload = function () {
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
	if (squaringPhase) {
		imgMB.src = "svg_files/arrow-90deg-right.svg";
		imgBB.src = "svg_files/arrow-return-left.svg";
		imgDB.src = "svg_files/trash-fill.svg";
		if (coords.length < 4) return;
		let h = (canvas.height - mButton.height - mButton.y);
		context.clearRect(0, 0, canvas.width, h);
		for (let i = 0; i < coords.length; ++i) {
			context.beginPath();
			context.moveTo(coords[i].firstPoint.x, coords[i].firstPoint.y);
			context.lineTo(coords[i].secondPoint.x, coords[i].secondPoint.y);
			context.stroke();
			context.font = "15px Arial";
			context.fillText(coords[i].size, (coords[i].firstPoint.x + coords[i].secondPoint.x) / 2, (coords[i].firstPoint.y + coords[i].secondPoint.y) / 2)
		}
	}
	if (beaconPhase) {
		imgMB.src = "svg_files/arrow-90deg-right.svg";
		imgBB.src = "svg_files/arrow-return-left.svg";
		imgDB.src = "svg_files/trash-fill.svg";
		let h = (canvas.height - mButton.height - mButton.y);
		context.clearRect(0, 0, canvas.width, h);
		for (let i = 0; i < coords.length; ++i) {
			context.beginPath();
			context.moveTo(coords[i].firstPoint.x, coords[i].firstPoint.y);
			context.lineTo(coords[i].secondPoint.x, coords[i].secondPoint.y);
			context.stroke();
			context.font = "15px Arial";
			context.fillText(coords[i].size, (coords[i].firstPoint.x + coords[i].secondPoint.x) / 2, (coords[i].firstPoint.y + coords[i].secondPoint.y) / 2)
		}
		for (let i = 0; i < beacons.length; ++i) {
			context.strokeStyle = "red";
			context.fillStyle = "red";
			context.beginPath();
			context.arc(beacons[i].x, beacons[i].y, 10, 0, 2 * Math.PI);
			context.stroke();
			if (beacons[i].pos > 0) {
				context.fill();
			} else {
				context.stroke();
			}
		}
		context.strokeStyle = "black";
		context.fillStyle = "black";
	}
	if (drawAll) {
		imgMB.src = "svg_files/save.svg";
		imgBB.src = "svg_files/arrow-return-left.svg";
		imgDB.src = "svg_files/trash-fill.svg";
		let h = (canvas.height - mButton.height - mButton.y);
		context.clearRect(0, 0, canvas.width, h);
		for (let i = 0; i < coords.length; ++i) {
			context.beginPath();
			context.moveTo(coords[i].firstPoint.x, coords[i].firstPoint.y);
			context.lineTo(coords[i].secondPoint.x, coords[i].secondPoint.y);
			context.stroke();
			context.font = "15px Arial";
			context.fillText(coords[i].size, (coords[i].firstPoint.x + coords[i].secondPoint.x) / 2, (coords[i].firstPoint.y + coords[i].secondPoint.y) / 2)
			context.strokeStyle = "green";
			context.fillStyle = "green";
			for (let j = 0; j < beacons.length; ++j) {
				if (beacons[j].wall === i) {
					switch (coords[i].direction) {
						case 'North':
							context.beginPath();
							context.arc(coords[i].firstPoint.x, coords[i].firstPoint.y - beacons[j].pos * scale_permanent, 10, 0, 2 * Math.PI);
							if (beacons[j].pos > 0) {
								context.fill();
							} else {
								context.stroke();
							}
							break;
						case 'South':
							context.beginPath();
							context.arc(coords[i].firstPoint.x, coords[i].firstPoint.y + beacons[j].pos * scale_permanent, 10, 0, 2 * Math.PI);
							if (beacons[j].pos > 0) {
								context.fill();
							} else {
								context.stroke();
							}
							break;
						case 'East':
							context.beginPath();
							context.arc(coords[i].firstPoint.x + beacons[j].pos * scale_permanent, coords[i].firstPoint.y, 10, 0, 2 * Math.PI);
							if (beacons[j].pos > 0) {
								context.fill();
							} else {
								context.stroke();
							}
							break;
						case 'West':
							context.beginPath();
							context.arc(coords[i].firstPoint.x - beacons[j].pos * scale_permanent, coords[i].firstPoint.y, 10, 0, 2 * Math.PI);
							if (beacons[j].pos > 0) {
								context.fill();
							} else {
								context.stroke();
							}
							break;
					}
				}
			}
			context.strokeStyle = "black";
			context.fillStyle = "black";
		}
	}
}
draw();