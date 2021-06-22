const canvas = document.querySelector("#mapMaker");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

let drawingPhase;			// kézi rajzolási fázis
let squaringPhase;			// itt már nem lehet rajzolni, a falak méreteit lehet megadni
let beaconPhase;			// jeladókat lehet elhelyezni, megadni a méretét
let furnishingPhase;		// berendezések elhelyezése
let furnitureSizingPhase;	// berendezések méretezése
let productPhase;			// termékeket lehet elhelyezni a polcokon
let routePhase;
let drawAll;				// kirajzol mindent a megadott méretek szerint a képernyőhöz arányosan, majd itt el lehet menteni

let scale_permanent;		// arány

let coords;					// Falak kezdő-és végpontjaik, méreteik, irányaik
let beacons;				// Jeladók pozíciója
let furnitures;				// berendezés
let routes;					// utak

const buttonsize = canvas.height * 0.1;

function init() {
	coords = [];					// Falak kezdő-és végpontjaik, méreteik, irányaik
	beacons = [];					// Jeladók pozíciója
	furnitures = [];
	routes = [];
	drawingPhase = true;			// kézi rajzolási fázis
	squaringPhase = false;			// itt már nem lehet rajzolni, a falak méreteit lehet megadni
	beaconPhase = false;			// jeladókat lehet elhelyezni, megadni a méretét
	furnishingPhase = false;		// berendezések elhelyezése
	furnitureSizingPhase = false;	// berendezések méretezése
	productPhase = false;			// termékeket lehet elhelyezni a polcokon
	routePhase = false;
	drawAll = false;

	draw();
}

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

	if (furnitureSizingPhase) {
		for (let i = 0; i < furnitures.length; ++i) {
			let b = false;
			for (let j = 0; j < furnitures[i].data.length; ++j) {
				if (furnitures[i].data[j].firstPoint.x === furnitures[i].data[j].secondPoint.x
					&& furnitures[i].data[j].firstPoint.y > furnitures[i].data[j].secondPoint.y) {
					if (e.layerX > furnitures[i].data[j].firstPoint.x - 5 && e.layerX < furnitures[i].data[j].secondPoint.x + 5 &&
						e.layerY < furnitures[i].data[j].firstPoint.y && e.layerY > furnitures[i].data[j].secondPoint.y) {
						if (!furnitureSizingPhase) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							furnitures[i].data[j].size = size;
							furnitures[i].data[j].direction = 'North';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				} else if (furnitures[i].data[j].firstPoint.x === furnitures[i].data[j].secondPoint.x
					&& furnitures[i].data[j].firstPoint.y < furnitures[i].data[j].secondPoint.y) {
					if (e.layerX > furnitures[i].data[j].firstPoint.x - 5 && e.layerX < furnitures[i].data[j].secondPoint.x + 5 &&
						e.layerY > furnitures[i].data[j].firstPoint.y && e.layerY < furnitures[i].data[j].secondPoint.y) {
						if (!furnitureSizingPhase) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							furnitures[i].data[j].size = size;
							furnitures[i].data[j].direction = 'South';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				} else if (furnitures[i].data[j].firstPoint.y === furnitures[i].data[j].secondPoint.y
					&& furnitures[i].data[j].firstPoint.x < furnitures[i].data[j].secondPoint.x) {
					if (e.layerX > furnitures[i].data[j].firstPoint.x && e.layerX < furnitures[i].data[j].secondPoint.x &&
						e.layerY > furnitures[i].data[j].firstPoint.y - 5 && e.layerY < furnitures[i].data[j].secondPoint.y + 5) {
						if (!furnitureSizingPhase) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							furnitures[i].data[j].size = size;
							furnitures[i].data[j].direction = 'East';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				} else if (furnitures[i].data[j].firstPoint.y === furnitures[i].data[j].secondPoint.y
					&& furnitures[i].data[j].firstPoint.x > furnitures[i].data[j].secondPoint.x) {
					if (e.layerX < furnitures[i].data[j].firstPoint.x && e.layerX > furnitures[i].data[j].secondPoint.x &&
						e.layerY > furnitures[i].data[j].firstPoint.y - 5 && e.layerY < furnitures[i].data[j].secondPoint.y + 5) {
						if (!furnitureSizingPhase) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							furnitures[i].data[j].size = size;
							furnitures[i].data[j].direction = 'West';
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				}
			}
			const point = {x: e.layerX, y: e.layerY};
			if (!b && pointOnWall(point, furnitures[i].distance_from_walls.horizontal)) {
				let size = prompt("Méret:");
				if (parseFloat(size) >= 0) {
					furnitures[i].distance_from_walls.horizontal.dist = size;
					context.clearRect(0, 0, canvas.width, canvas.height);
					draw();
				} else {
					alert('Hibás méret!');
				}
				draw();
				b = true;
			}
			if (!b && pointOnWall(point, furnitures[i].distance_from_walls.vertical)) {
				let size = prompt("Méret:");
				if (parseFloat(size) >= 0) {
					furnitures[i].distance_from_walls.vertical.dist = size;
					context.clearRect(0, 0, canvas.width, canvas.height);
					draw();
				} else {
					alert('Hibás méret!');
				}
				draw();
				b = true;
			}
		}

	}

	if (productPhase) {
		for (let i = 0; i < furnitures.length; ++i) {
			const point = {x: e.layerX, y: e.layerY};
			if (inObject(point, furnitures[i].data)) {
				setProduct(i, e);
				draw();
			}
		}
	}


}

/* Rajta van e a megadott pont a megadott falon */
function pointOnWall(point, wall) {
	let b = true;

	let topLeft = false, bottomLeft = false, topRigth = false, bottomRight = false;
	let mincoordX = wall.firstPoint.x < wall.secondPoint.x ? wall.firstPoint.x : wall.secondPoint.x;
	let maxcoordX = wall.firstPoint.x > wall.secondPoint.x ? wall.firstPoint.x : wall.secondPoint.x;
	let mincoordY = wall.firstPoint.y < wall.secondPoint.y ? wall.firstPoint.y : wall.secondPoint.y;
	let maxcoordY = wall.firstPoint.y > wall.secondPoint.y ? wall.firstPoint.y : wall.secondPoint.y;
	/* bal felso pontja */
	if (point.x > mincoordX - 5 && point.y > mincoordY - 5) {
		topLeft = true;
	}
	/* bal also pontja */
	if (point.x > mincoordX - 5 && point.y < maxcoordY + 5) {
		bottomLeft = true;
	}
	/* jobb felso pontja */
	if (point.x < maxcoordX + 5 && point.y > mincoordY - 5) {
		topRigth = true;
	}
	/* jobb also pontja */
	if (point.x < maxcoordX + 5 && point.y < maxcoordY + 5) {
		bottomRight = true;
	}
    if (bottomLeft === false || bottomRight === false|| topLeft === false || topRigth === false) {
        b = false;
    }
    return b;
}

/* "Következő" gombra való kattintásra */
function next() {
	if (drawingPhase) {
		searchNextWall();
		while (!isAnySameDirection()) {
			console.log('be');
			mergeSameDirections();
		}
		console.log(coords.length);
		if (coords.length < 4) {
			alert('Kevés fal lett rajzolva!');
			return;
		}
		if (coords.length % 2 === 1) {
			alert('Páratlan a falak száma!');
			return;
		}
		squaring();
		drawingPhase = false;
		squaringPhase = true;
		draw();
	} else if (squaringPhase) {
		console.log('squaringPhase');
		scalingToWindowSize();
		draw();
		console.log('beaconPhase');
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
		furnishingPhase = true;
		prevX = undefined, prevY = undefined;
		currX = undefined, currY = undefined;
		if (!confirm('Akarsz hozzáadni berendezést?')) {
			furnishingPhase = false;
			drawAll = true;
			console.log('furnishingPhase');
		}
		draw();
	} else if (furnishingPhase) {
		if (furniture.length > 0) {
			if (confirm('Hozzáadod a felrajzolt objektumot?')) {
				if (furniture.length > 0) {
					squareFurniture();
					if (furniture.length <= 0) return;
					placeSomething();
					draw();
					console.log(furnitures);
					prevX = undefined, prevY = undefined;
					currX = undefined, currY = undefined;
					furniture = [];
				}
				return;
			}
		}
		if (confirm('Végeztél a berendezések hozzáadásával?')) {
			furnishingPhase = false;
			furnitureSizingPhase = true;
			prevX = undefined, prevY = undefined;
			currX = undefined, currY = undefined;
			console.log('furnitureSizingPhase');
		}
	} else if (furnitureSizingPhase) {
		scaleFurnitures();
		furnitureSizingPhase = false;
		productPhase = true;
		draw();
		console.log('productPhase');
	} else if (productPhase) {
		productPhase = false;
		routePhase = true;
		draw();
		console.log('routePhase');
		console.log(furnitures[0].products);
	} else if (routePhase) {
		prevX = undefined, prevY = undefined;
		currX = undefined, currY = undefined;
		routePhase = false;
		drawAll = true;
		doAllThingsWithRoutes();
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
		clear();
		context.clearRect(0, 0, canvas.width, canvas.height);
		draw();
	} else if (squaringPhase) {
		drawingPhase = true;
		squaringPhase = false;
		coords = [];
		context.clearRect(0, 0, canvas.width, canvas.height);
		draw();
	} else if (beaconPhase) {
		if (beacons.length === 0) {
			squaringPhase = true;
			beaconPhase = false;
		} else {
			beacons.splice(-1,1);
		}
		draw();
	} else if (furnishingPhase) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		furniture = [];
		//furnitures = [];
		if (furnitures.length === 0) {
			beaconPhase = true;
			drawAll = false;
		} else {
			furnitures.splice(-1, 1);
		}
		draw();
	} else if (furnitureSizingPhase) {
		furnishingPhase = true;
		furnitureSizingPhase = false;
		draw();
	} else if (productPhase) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		furnitureSizingPhase = true;
		productPhase = false;
		draw();
	} else if (routePhase) {
		if (routes.length === 0) {
			productPhase = true;
			routePhase = false;
		} else {
			routes.splice(-1, 1);
		}
		
		draw();
	} else if (drawAll) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		routePhase = true;
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
		furnitures = [];
		furniture = [];
		routes = [];
		drawingPhase = true;
		squaringPhase = false;
		beaconPhase = false;
		furnishingPhase = false;
		productPhase = false;
		routePhase = false;
		drawAll = false;
		context.clearRect(0, 0, canvas.width, canvas.height);
		draw();
	}
}

/* TODO */
function save() {
	if (confirm('Menti az alaprajzot?')) {
		let tname = prompt('Alaprajz neve:');
		const toSave = {
			name: tname,
			walls: coords,
			beacons: beacons,
			furnitures: furnitures,
			routes: routes
		}
		console.log(toSave);
		download(JSON.stringify(toSave),'floorPlan.json','text/plain');
	}
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
	if (drawingPhase || furnishingPhase || routePhase) {
		paintCoord('move', e);
	}
}, false);
canvas.addEventListener("mousedown", function (e) {
	if (drawingPhase || furnishingPhase || routePhase) {
		paintCoord('down', e);
	}
}, false);
canvas.addEventListener("mouseup", function (e) {
	if (drawingPhase || furnishingPhase || routePhase) {
		paintCoord('up', e);
	}
}, false);
canvas.addEventListener("mouseout", function (e) {
	if (drawingPhase || furnishingPhase || routePhase) {
		paintCoord('out', e);
	}
}, false);

/* Érintés eseménykezelők rajzoláshoz */
canvas.addEventListener("touchmove", function (e) {
	if (drawingPhase || furnishingPhase) {
		paintCoord2('move', e);
	}
}, false);
canvas.addEventListener("touchstart", function (e) {
	if (drawingPhase || furnishingPhase) {
		paintCoord2('down', e);
	}
}, false);
canvas.addEventListener("touchend", function (e) {
	if (drawingPhase || furnishingPhase) {
		paintCoord2('up', e);
	}
}, false);
canvas.addEventListener("touchcancel", function (e) {
	if (drawingPhase || furnishingPhase) {
		paintCoord2('out', e);
	}
}, false);

/*  -- Kézi rajzolás -- */
let flag = false;
let prevX, prevY;
let currX, currY;
let dot_flag = false;

let firstPoint;
let secondPoint;
let fPB = false;

let drawingCoords = []
let furniture = [];

/* Egérhez */
function paintCoord(ms, e) {
	if (e.clientY > canvas.height*0.9) return;
	if (!drawingPhase && !furnishingPhase && !routePhase) return;
	if (ms === 'down') {
		prevX = currX;
		prevY = currY;
		currX = e.clientX - canvas.offsetLeft;
		currY = e.clientY - canvas.offsetTop;

		drawingCoords.push({ x: currX, y: currY });

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
			if (drawingPhase) {
				coords.push({ firstPoint, secondPoint, size: 0, direction: '' });
			}
			if (furnishingPhase) {
				furniture.push({ name: '', firstPoint, secondPoint, size: 0, direction: '' });
			}
			if (routePhase) {
				//routes.push({firstPoint, secondPoint, size: 0, direction: ''});
				let route = {firstPoint, secondPoint, size: 0, direction: ''}
				routes.push(squareRoute(route));
			}
			drawingCoords.push({ x: currX, y: currY });
			takeApart();
			drawingCoords = [];
			fPB = false;
		}
		if (ms === 'out' || currY > canvas.height * 0.9) {
			drawingCoords = [];
			if (drawingPhase) {
				coords.splice(-1, 1);
			}
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
			drawingCoords.push({ x: currX, y: currY });
			draw();
		}
	}
}

/* Érintéshez */
function paintCoord2(ms, e) {
	if (e.touches[0].clientY > canvas.height*0.9) return;
	if (!drawingPhase && !furnishingPhase) return;
	if (ms === 'down') {
		prevX = currX;
		prevY = currY;
		currX = e.touches[0].clientX - canvas.offsetLeft;
		currY = e.touches[0].clientY - canvas.offsetTop;

		drawingCoords.push({ x: currX, y: currY });

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
			currX = e.touches[0].clientX - canvas.offsetLeft;
			currY = e.touches[0].clientY - canvas.offsetTop;
			secondPoint = { x: currX, y: currY };
			if (drawingPhase) {
				coords.push({ firstPoint, secondPoint, size: 0, direction: '' });
			}
			if (furnishingPhase) {
				furniture.push({ name: '', firstPoint, secondPoint, size: 0, direction: '' });
			}
			if (routePhase) {
				routes.push({firstPoint, secondPoint, size: 0, direction: ''});
			}
			drawingCoords.push({ x: currX, y: currY });
			takeApart();
			drawingCoords = [];
			fPB = false;
		}
		if (ms === 'out' || currY > canvas.height * 0.9) {
			drawingCoords = [];
			if (drawingPhase) {
				coords.splice(-1, 1);
			}
			fPB = false;
		}
		flag = false;
	}
	if (ms === 'move') {
		if (flag) {
			prevX = currX;
			prevY = currY;
			currX = e.touches[0].clientX - canvas.offsetLeft;
			currY = e.touches[0].clientY - canvas.offsetTop;
			drawingCoords.push({ x: currX, y: currY });
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
/* let imgBeacon = new Image(); */
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

	if (furnishingPhase) {
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


		for (let i = 0; i < furnitures.length; ++i) {
			furnitures[i].data.forEach(furniture => {
				context.beginPath();
				context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
				context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
				context.stroke();
			});
		}

		context.beginPath();
		context.moveTo(prevX, prevY);
		context.lineTo(currX, currY);
		context.strokeStyle = "black";
		context.lineWidth = 2;
		context.stroke();
		context.closePath();

	}

	if (furnitureSizingPhase) {
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

		for (let i = 0; i < furnitures.length; ++i) {
			context.strokeStyle = "black";
			context.fillStyle = "black";
			furnitures[i].data.forEach(furniture => {
				context.beginPath();
				context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
				context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
				context.stroke();
				context.font = "15px Arial";
				context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
			});

			context.beginPath();
			context.setLineDash([5, 10]);
			context.moveTo(furnitures[i].distance_from_walls.horizontal.firstPoint.x,furnitures[i].distance_from_walls.horizontal.firstPoint.y);
			context.lineTo(furnitures[i].distance_from_walls.horizontal.secondPoint.x,furnitures[i].distance_from_walls.horizontal.secondPoint.y);
			context.stroke();

			context.font = "15px Arial";
			context.fillText(furnitures[i].distance_from_walls.horizontal.dist, (furnitures[i].distance_from_walls.horizontal.firstPoint.x + furnitures[i].distance_from_walls.horizontal.secondPoint.x) / 2, (furnitures[i].distance_from_walls.horizontal.firstPoint.y + furnitures[i].distance_from_walls.horizontal.secondPoint.y) / 2);

			context.beginPath();
			context.moveTo(furnitures[i].distance_from_walls.vertical.firstPoint.x,furnitures[i].distance_from_walls.vertical.firstPoint.y);
			context.lineTo(furnitures[i].distance_from_walls.vertical.secondPoint.x,furnitures[i].distance_from_walls.vertical.secondPoint.y);
			context.stroke();
			context.setLineDash([]);

			context.font = "15px Arial";
			context.fillText(furnitures[i].distance_from_walls.vertical.dist, (furnitures[i].distance_from_walls.vertical.firstPoint.x + furnitures[i].distance_from_walls.vertical.secondPoint.x) / 2, (furnitures[i].distance_from_walls.vertical.firstPoint.y + furnitures[i].distance_from_walls.vertical.secondPoint.y) / 2);

		}
		context.strokeStyle = "black";
		context.fillStyle = "black";

	}

	if (productPhase) {
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

		for (let i = 0; i < furnitures.length; ++i) {
			context.strokeStyle = "black";
			context.fillStyle = "black";
			furnitures[i].data.forEach(furniture => {
				context.beginPath();
				context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
				context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
				context.stroke();
				context.font = "15px Arial";
				context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
			});
			furnitures[i].products.forEach(product => {
				context.strokeStyle = "green";
				context.fillStyle = "green";
				context.beginPath();
				context.arc(product.x, product.y, 5, 0, 2 * Math.PI);
				if (product.name === '') {
					context.stroke();
				} else {
					context.fill();
				}
			});
			context.strokeStyle = "black";
			context.fillStyle = "black";
			furnitures[i].separators.forEach(s => {
				context.beginPath();
				context.moveTo(s.firstPoint.x, s.firstPoint.y);
				context.lineTo(s.secondPoint.x, s.secondPoint.y);
				context.stroke();
			});
		}
		context.strokeStyle = "black";
		context.fillStyle = "black";

	}

	if (routePhase) {
		// context.clearRect(0, 0, canvas.width, canvas.height);
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

		for (let i = 0; i < furnitures.length; ++i) {
			context.strokeStyle = "black";
			context.fillStyle = "black";
			furnitures[i].data.forEach(furniture => {
				context.beginPath();
				context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
				context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
				context.stroke();
				context.font = "15px Arial";
				context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
			});
			furnitures[i].products.forEach(product => {
				context.strokeStyle = "green";
				context.fillStyle = "green";
				context.beginPath();
				context.arc(product.x, product.y, 5, 0, 2 * Math.PI);
				if (product.name === '') {
					context.stroke();
				} else {
					context.fill();
				}
			});
		}

		context.beginPath();
		context.moveTo(prevX, prevY);
		context.lineTo(currX, currY);
		context.strokeStyle = "black";
		context.lineWidth = 2;
		context.stroke();
		context.closePath();

		context.strokeStyle = "black";
		context.fillStyle = "black";

	}

	if (drawAll) {
		context.clearRect(0, 0, canvas.width, canvas.height);
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

		for (let i = 0; i < furnitures.length; ++i) {
			context.strokeStyle = "black";
			context.fillStyle = "black";
			furnitures[i].data.forEach(furniture => {
				context.beginPath();
				context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
				context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
				context.stroke();
				context.font = "15px Arial";
				context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
			});
			furnitures[i].products.forEach(product => {
				context.strokeStyle = "green";
				context.fillStyle = "green";
				context.beginPath();
				context.arc(product.x, product.y, 5, 0, 2 * Math.PI);
				if (product.name === '') {
					context.stroke();
				} else {
					context.fill();
				}
			});
		}

		routes.forEach(route => {
			context.beginPath();
			context.moveTo(route.firstPoint.x, route.firstPoint.y);
			context.lineTo(route.secondPoint.x, route.secondPoint.y);
			context.stroke();
		});

		context.strokeStyle = "black";
		context.fillStyle = "black";
	}
}

init();