const canvas = document.querySelector("#mapMaker");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

let drawingPhase = true;		// kézi rajzolási fázis
let squaringPhase = false;		// itt már nem lehet rajzolni, a falak méreteit lehet megadni
let beaconPhase = false;		// jeladókat lehet elhelyezni, megadni a méretét
let drawAll = false;			// kirajzol mindent a megadott méretek szerint a képernyőhöz arányosan, majd itt el lehet menteni (TODO SAVE)

let scale_permanent;			// arány

// Falak kezdő-és végpontjaik, méreteik, irányaik
let coords = [];

// Jeladók pozíciója
let beacons = [];

let beaconsHeight;

const buttonsize = canvas.height * 0.1;

// "gombok" ... "mButton - middle button"
let mButton = {
	width: buttonsize,
	height: buttonsize,
	x: canvas.width / 2 - buttonsize / 2,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}
let deleteButton = {
	width: buttonsize,
	height: buttonsize,
	x: canvas.width * 0.99 - buttonsize,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}
let backButton = {
	width: buttonsize,
	height: buttonsize,
	x: canvas.width*0.01,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}

/* Canvasra való kattintás */
canvas.onclick = function (e) {
	// Middle button
	if (e.layerX > mButton.x && e.layerX < mButton.x + mButton.width &&
		e.layerY > mButton.y && e.layerY < mButton.y + mButton.height) {
		if (drawingPhase) {
			//coords.splice(-1, 1);
			next();
		} else {
			next();
			context.clearRect(0, 0, canvas.width, canvas.height);
			draw();
		}
	}
	// Right button (delete)
	if (e.layerX > deleteButton.x && e.layerX < deleteButton.x + deleteButton.width &&
		e.layerY > deleteButton.y && e.layerY < deleteButton.y + deleteButton.height) {
		clear();
	}

	// Left button
	if (e.layerX > backButton.x && e.layerX < backButton.x + backButton.width &&
		e.layerY > backButton.y && e.layerY < backButton.y + backButton.height) {
		/* if (squaringPhase || drawingPhase) {
			coords.splice(-1, 1);
		} */
		back();
	}
	
	// Falakra való kattintás
	if (squaringPhase || beaconPhase) {
		for (let i = 0; i < coords.length; ++i) {
			if (coords[i].firstPoint.x === coords[i].secondPoint.x
				&& coords[i].firstPoint.y > coords[i].secondPoint.y) {
				if (e.layerX > coords[i].firstPoint.x - 5 && e.layerX < coords[i].secondPoint.x + 5 &&
					e.layerY < coords[i].firstPoint.y && e.layerY > coords[i].secondPoint.y) {
					if (squaringPhase) {
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							coords[i].size = parseFloat(size);
							coords[i].direction = 'North';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert("Hibás méret!");
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
						if (parseFloat(size) > 0) {
							coords[i].size = parseFloat(size);
							coords[i].direction = 'South';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
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
						if (parseFloat(size) > 0) {
							coords[i].size = parseFloat(size);
							coords[i].direction = 'East';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
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
						if (parseFloat(size) > 0) {
							coords[i].size = parseFloat(size);
							coords[i].direction = 'West';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
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

/* Megkeresi az első felrajzolt faltól sorban a legközelebbi falat, sorrendbe teszi őket */
function searchNextWall() {
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

/* felhelyezi az adott indexű falra a "jeladót" vagy jeladóra kattintás esetén meg lehet adni a méretét*/
function setBeacon(index, e) {
	let size = 0;
	for (let i = 0; i < beacons.length; ++i) {
		if (e.layerX > beacons[i].x - 15 && e.layerX < beacons[i].x + 15
			&& e.layerY > beacons[i].y - 15 && e.layerY < beacons[i].y + 15
			&& beacons[i].wall === index) {
			size = parseFloat(prompt('Adja meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
			while (size >= coords[index].size || coords[index].size <= 0) {
				alert('Hibás méret!');
				size = parseFloat(prompt('Adja meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
			}
			switch (coords[index].direction) {
				case 'North':
					size = coords[index].size - size;
					break;
				case 'West':
					size = coords[index].size - size;
					break;
			}
			beacons[i].pos = size;
			return;
		}
	}

	beacons.push({ x: e.clientX, y: e.clientY, wall: index, pos: size });
	draw();
}

/* Arányosan rajzolja fel az alaprajzot */
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

/* Arányosan rajzolja fel a jeladókat */
function scalingBeacons() {
	for (let i = 0; i < coords.length; ++i) {
		for (let j = 0; j < beacons.length; ++j) {
			if (beacons[j].wall === i) {
				switch (coords[i].direction) {
					case 'North':
						beacons[j].x = coords[i].firstPoint.x;
						beacons[j].y = coords[i].firstPoint.y - beacons[j].pos * scale_permanent;
						break;
					case 'South':
						beacons[j].x = coords[i].firstPoint.x;
						beacons[j].y = coords[i].firstPoint.y + beacons[j].pos * scale_permanent;
						break;
					case 'East':
						beacons[j].x = coords[i].firstPoint.x + beacons[j].pos * scale_permanent;
						beacons[j].y = coords[i].firstPoint.y;
						break;
					case 'West':
						beacons[j].x = coords[i].firstPoint.x - beacons[j].pos * scale_permanent;
						beacons[j].y = coords[i].firstPoint.y;
						break;
				}
			}
		}
	}
}

/* "Következő" gombra való kattintásra */
function next() {
	if (drawingPhase) {
		searchNextWall();
		if (coords.length < 4 || coords.length%2 === 1) {
			return;
		}
		squaring();
		drawingPhase = false;
		squaringPhase = true;
		draw();
	} else if (squaringPhase) {
		scalingToWindowSize();
		draw();
	} else if (beaconPhase) {
		let b = false;
		beacons.forEach(beacon => {
			if (beacon.pos <= 0) {
				b = true;
				return;
			}
		});
		if (b) {
			alert('Nincs megadva az összes jeladó pozíciója!');
			return;
		}
		scalingBeacons();
		beaconPhase = false;
		drawAll = true;
		draw();
	} else if (drawAll) {
		save();
	}
}

/* "Vissza" gombra való kattintásra */
function back() {
	if (drawingPhase) { // TODO menü?
		drawingPhase = true;
		squaringPhase = false;
		context.clearRect(0, 0, canvas.width, canvas.height);
		draw();
	}
	if (squaringPhase) {
		drawingPhase = true;
		squaringPhase = false;
		coords = [];
		context.clearRect(0, 0, canvas.width, canvas.height);
		draw();
	}
	if (beaconPhase) {
		if (beacons.length === 0) {
			squaringPhase = true;
			beaconPhase = false;
		} else {
			beacons.splice(-1,1);
		}
		draw();
	}
	if (drawAll) {
		beaconPhase = true;
		drawAll = false;
		draw();
	}
}

/* Törlés gombra való kattintásra */
function clear() {
	if ((coords.length > 0) && confirm("Törli az eddigi rajzot?")) {
		prevX, currX, prevY, currY = undefined;
		coords = [];
		beacons = [];
		drawingPhase = true;
		squaringPhase = false;
		beaconPhase = false;
		drawAll = false;
		context.clearRect(0, 0, canvas.width, canvas.height);
		draw();
	}
}

/* TODO */
function save() {
	let tname = prompt('Alaprajz neve:');
	const toSave = {
		name: tname,
		walls: coords,
		beacons: beacons
	}
	console.log(toSave);
	download(JSON.stringify(toSave),'floorPlan.json','text/plain');
}

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

/* Egér eseménykezelők rajzoláshoz  */
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


let drawingCoords = []

function takeApart() {
	console.log(drawingCoords.length);
	if (drawingCoords.length <= 20) return;
	let breakPoints = [];
	let direction;
	if (Math.abs(drawingCoords[0].x - drawingCoords[20].x) >
		Math.abs(drawingCoords[0].y - drawingCoords[20].y)) {
			direction = 'horizontal';
	} else {
		direction = 'vertical';
	}
	for (let i = 20; i < drawingCoords.length - 21; i += 20) {
		if (Math.abs(drawingCoords[i].x - drawingCoords[i + 20].x) >
			Math.abs(drawingCoords[i].y - drawingCoords[i + 20].y)) {
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

	coords.splice(-1,1);
	coords.push({firstPoint: {x: drawingCoords[0].x, y: drawingCoords[0].y}, secondPoint: {x: breakPoints[0].x, y: breakPoints[0].y}, size: 0, direction: '' });
	for (let i = 0; i < breakPoints.length - 1; ++i) {
		coords.push({firstPoint: {x: breakPoints[i].x, y: breakPoints[i].y}, secondPoint: {x: breakPoints[i + 1].x, y: breakPoints[i + 1].y}, size: 0, direction: '' });
	}
	coords.push({firstPoint: {x: breakPoints[breakPoints.length - 1].x, y: breakPoints[breakPoints.length - 1].y}, secondPoint: {x: drawingCoords[drawingCoords.length - 1].x, y: drawingCoords[drawingCoords.length - 1].y}, size: 0, direction: '' });

	console.log(breakPoints);
	console.log(coords);
}

/*  -- Kézi rajzolás -- */
let flag = false;
let prevX, prevY;
let currX, currY;
let dot_flag = false;

let firstPoint;
let secondPoint;
let fPB = false;

function paintCoord(ms, e) {
	if (e.clientY > canvas.height*0.9) return;
	if (!drawingPhase) return;
	if (ms === 'down') {
		prevX = currX;
		prevY = currY;
		currX = e.clientX - canvas.offsetLeft;
		currY = e.clientY - canvas.offsetTop;

		/* ---- */
		drawingCoords.push({ x: currX, y: currY });
		/* ---- */

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
			/* ---- */
			drawingCoords.push({ x: currX, y: currY });
			/* ---- */
			takeApart();
			drawingCoords = [];
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
			/* ---- */
			drawingCoords.push({ x: currX, y: currY });
			/* ---- */
			draw();
		}
	}
}
// -------------------

// svg-s
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
/* let imgBeacon = new Image();
 */
const draw = function (e) {
	//imgBeacon.src = "svg_files/broadcast.svg";
	if (drawingPhase) {
		imgMB.src = "svg_files/next.svg";
		imgBB.src = "svg_files/arrow-left.svg";
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
		context.clearRect(0, 0, canvas.width, canvas.height);
		imgMB.src = "svg_files/next.svg";
		imgBB.src = "svg_files/arrow-left.svg";
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
		context.clearRect(0, 0, canvas.width, canvas.height);
		imgMB.src = "svg_files/next.svg";
		imgBB.src = "svg_files/arrow-left.svg";
		imgDB.src = "svg_files/trash-fill.svg";

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
			context.arc(beacons[i].x, beacons[i].y, 5, 0, 2 * Math.PI);
			context.stroke();
			if (beacons[i].pos > 0) {
				context.fill();
				context.font = "15px Arial";
				context.fillStyle = "black";
				if (coords[beacons[i].wall].direction === 'North' || coords[beacons[i].wall].direction === 'West') {
					context.beginPath();
					context.moveTo(coords[beacons[i].wall].secondPoint.x, coords[beacons[i].wall].secondPoint.y);
					context.lineTo(beacons[i].x, beacons[i].y);
					context.stroke();
					if (coords[beacons[i].wall].direction === 'North') {
						context.fillText(coords[beacons[i].wall].size - beacons[i].pos, beacons[i].x + 5, beacons[i].y);
					} else {
						context.fillText(coords[beacons[i].wall].size - beacons[i].pos, beacons[i].x, beacons[i].y - 5);
					}
				} else {
					context.beginPath();
					context.moveTo(coords[beacons[i].wall].firstPoint.x, coords[beacons[i].wall].firstPoint.y);
					context.lineTo(beacons[i].x, beacons[i].y);
					context.stroke();
					if (coords[beacons[i].wall].direction === 'South') {
						context.fillText(beacons[i].pos, beacons[i].x + 5, beacons[i].y);
					} else {
						context.fillText(beacons[i].pos, beacons[i].x, beacons[i].y - 5);
					}
				}
			} else {
				context.stroke();
			}
		}
		context.strokeStyle = "black";
		context.fillStyle = "black";
	}
	if (drawAll) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		imgMB.src = "svg_files/floppy-disk.svg";
		imgBB.src = "svg_files/arrow-left.svg";
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
			let imgBeacon = new Image();
			imgBeacon.onload = function () {
				context.drawImage(imgBeacon, beacons[i].x, beacons[i].y, 15, 15);
			};
			imgBeacon.src = "svg_files/broadcast.svg";
			context.fillStyle = "green";
			context.beginPath();
			context.arc(beacons[i].x, beacons[i].y, 5, 0, 2 * Math.PI);
			context.fill();
			if (beacons[i].pos > 0) {
				context.fill();
				context.font = "15px Arial";
				switch (coords[beacons[i].wall].direction) {
					case 'North':
						context.fillText(coords[beacons[i].wall].size -beacons[i].pos, beacons[i].x, beacons[i].y);
						break;
					case 'South':
						context.fillText(beacons[i].pos, beacons[i].x, beacons[i].y);
						break;
					case 'East':
						context.fillText(beacons[i].pos, beacons[i].x, beacons[i].y);
						break;
					case 'West':
						context.fillText(coords[beacons[i].wall].size - beacons[i].pos, beacons[i].x, beacons[i].y);
						break;
				}
			} else {
				context.stroke();
			}
		}

		context.strokeStyle = "black";
		context.fillStyle = "black";
	}
}
draw();