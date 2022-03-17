const canvas = document.querySelector("#mapMaker");
const context = canvas.getContext("2d");
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

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
	x: canvas.width * 0.01,
	y: canvas.height - canvas.height / 10 - canvas.height * 0.01
}

let selected;

canvas.onclick = function (e) {
    // Middle button
    if (e.layerX > mButton.x && e.layerX < mButton.x + mButton.width &&
		e.layerY > mButton.y && e.layerY < mButton.y + mButton.height) {
            if (drawingManager.getPhase() == Phase.drawing) {
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
            context.clearRect(0, 0, canvas.width, canvas.height);
		    clear();
	}

	// Left button
	if (e.layerX > backButton.x && e.layerX < backButton.x + backButton.width &&
		e.layerY > backButton.y && e.layerY < backButton.y + backButton.height) {
		    back();
	}

    // Falakra való kattintás
	if (drawingManager.getPhase() == Phase.squaring || drawingManager.getPhase() == Phase.beacon) {
		for (let i = 0; i < drawingManager.getRoom().walls.length; ++i) {
			if (drawingManager.getRoom().walls[i].firstPoint.x === drawingManager.getRoom().walls[i].secondPoint.x
				&& drawingManager.getRoom().walls[i].firstPoint.y > drawingManager.getRoom().walls[i].secondPoint.y) {
				if (e.layerX > drawingManager.getRoom().walls[i].firstPoint.x - 5 && e.layerX < drawingManager.getRoom().walls[i].secondPoint.x + 5 &&
					e.layerY < drawingManager.getRoom().walls[i].firstPoint.y && e.layerY > drawingManager.getRoom().walls[i].secondPoint.y) {
					if (drawingManager.getPhase() == Phase.squaring) {
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
                            drawingManager.setWallSize(i, parseFloat(size));
                            drawingManager.setWallDirection(i, Direction.North);
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert("Hibás méret!");
						}
					}
					if (drawingManager.getPhase() == Phase.beacon) {
						drawingManager.setBeacon(i, e);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			} else if (drawingManager.getRoom().walls[i].firstPoint.x === drawingManager.getRoom().walls[i].secondPoint.x
				&& drawingManager.getRoom().walls[i].firstPoint.y < drawingManager.getRoom().walls[i].secondPoint.y) {
				if (e.layerX > drawingManager.getRoom().walls[i].firstPoint.x - 5 && e.layerX < drawingManager.getRoom().walls[i].secondPoint.x + 5 &&
					e.layerY > drawingManager.getRoom().walls[i].firstPoint.y && e.layerY < drawingManager.getRoom().walls[i].secondPoint.y) {
					if (drawingManager.getPhase() == Phase.squaring) {
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
                            drawingManager.setWallSize(i, parseFloat(size));
                            drawingManager.setWallDirection(i, Direction.South);
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
					}
					if (drawingManager.getPhase() == Phase.beacon) {
						drawingManager.setBeacon(i, e);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			} else if (drawingManager.getRoom().walls[i].firstPoint.y === drawingManager.getRoom().walls[i].secondPoint.y
				&& drawingManager.getRoom().walls[i].firstPoint.x < drawingManager.getRoom().walls[i].secondPoint.x) {
				if (e.layerX > drawingManager.getRoom().walls[i].firstPoint.x && e.layerX < drawingManager.getRoom().walls[i].secondPoint.x &&
					e.layerY > drawingManager.getRoom().walls[i].firstPoint.y - 5 && e.layerY < drawingManager.getRoom().walls[i].secondPoint.y + 5) {
					if (drawingManager.getPhase() == Phase.squaring) {
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
                            drawingManager.setWallSize(i, parseFloat(size));
                            drawingManager.setWallDirection(i, Direction.East);
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
					}
					if (drawingManager.getPhase() == Phase.beacon) {
						drawingManager.setBeacon(i, e);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			} else if (drawingManager.getRoom().walls[i].firstPoint.y === drawingManager.getRoom().walls[i].secondPoint.y
				&& drawingManager.getRoom().walls[i].firstPoint.x > drawingManager.getRoom().walls[i].secondPoint.x) {
				if (e.layerX < drawingManager.getRoom().walls[i].firstPoint.x && e.layerX > drawingManager.getRoom().walls[i].secondPoint.x &&
					e.layerY > drawingManager.getRoom().walls[i].firstPoint.y - 5 && e.layerY < drawingManager.getRoom().walls[i].secondPoint.y + 5) {
					if (drawingManager.getPhase() == Phase.squaring) {
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
                            drawingManager.setWallSize(i, parseFloat(size));
                            drawingManager.setWallDirection(i, Direction.West);
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
					}
					if (drawingManager.getPhase() == Phase.beacon) {
						drawingManager.setBeacon(i, e);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			}
		}
	}

    if (drawingManager.getPhase() == Phase.furnitureSizing) {
		for (let i = 0; i < drawingManager.getRoom().furnitures.length; ++i) {
			if (!drawingManager.getRoom().furnitures[i].scaled) {
			let b = false;
			for (let j = 0; j < drawingManager.getRoom().furnitures[i].data.length; ++j) {
				if (drawingManager.getRoom().furnitures[i].data[j].firstPoint.x === drawingManager.getRoom().furnitures[i].data[j].secondPoint.x
					&& drawingManager.getRoom().furnitures[i].data[j].firstPoint.y > drawingManager.getRoom().furnitures[i].data[j].secondPoint.y) {
					if (e.layerX > drawingManager.getRoom().furnitures[i].data[j].firstPoint.x - 5 && e.layerX < drawingManager.getRoom().furnitures[i].data[j].secondPoint.x + 5 &&
						e.layerY < drawingManager.getRoom().furnitures[i].data[j].firstPoint.y && e.layerY > drawingManager.getRoom().furnitures[i].data[j].secondPoint.y) {
						if (drawingManager.getPhase() != Phase.furnitureSizing) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							drawingManager.getRoom().furnitures[i].data[j].size = size;
							drawingManager.getRoom().furnitures[i].data[j].direction = Direction.North;
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				} else if (drawingManager.getRoom().furnitures[i].data[j].firstPoint.x === drawingManager.getRoom().furnitures[i].data[j].secondPoint.x
					&& drawingManager.getRoom().furnitures[i].data[j].firstPoint.y < drawingManager.getRoom().furnitures[i].data[j].secondPoint.y) {
					if (e.layerX > drawingManager.getRoom().furnitures[i].data[j].firstPoint.x - 5 && e.layerX < drawingManager.getRoom().furnitures[i].data[j].secondPoint.x + 5 &&
						e.layerY > drawingManager.getRoom().furnitures[i].data[j].firstPoint.y && e.layerY < drawingManager.getRoom().furnitures[i].data[j].secondPoint.y) {
						if (drawingManager.getPhase() != Phase.furnitureSizing) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							drawingManager.getRoom().furnitures[i].data[j].size = size;
							drawingManager.getRoom().furnitures[i].data[j].direction = Direction.South;
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				} else if (drawingManager.getRoom().furnitures[i].data[j].firstPoint.y === drawingManager.getRoom().furnitures[i].data[j].secondPoint.y
					&& drawingManager.getRoom().furnitures[i].data[j].firstPoint.x < drawingManager.getRoom().furnitures[i].data[j].secondPoint.x) {
					if (e.layerX > drawingManager.getRoom().furnitures[i].data[j].firstPoint.x && e.layerX < drawingManager.getRoom().furnitures[i].data[j].secondPoint.x &&
						e.layerY > drawingManager.getRoom().furnitures[i].data[j].firstPoint.y - 5 && e.layerY < drawingManager.getRoom().furnitures[i].data[j].secondPoint.y + 5) {
						if (drawingManager.getPhase() != Phase.furnitureSizing) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							drawingManager.getRoom().furnitures[i].data[j].size = size;
							drawingManager.getRoom().furnitures[i].data[j].direction = Direction.East;
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				} else if (drawingManager.getRoom().furnitures[i].data[j].firstPoint.y === drawingManager.getRoom().furnitures[i].data[j].secondPoint.y
					&& drawingManager.getRoom().furnitures[i].data[j].firstPoint.x > drawingManager.getRoom().furnitures[i].data[j].secondPoint.x) {
					if (e.layerX < drawingManager.getRoom().furnitures[i].data[j].firstPoint.x && e.layerX > drawingManager.getRoom().furnitures[i].data[j].secondPoint.x &&
						e.layerY > drawingManager.getRoom().furnitures[i].data[j].firstPoint.y - 5 && e.layerY < drawingManager.getRoom().furnitures[i].data[j].secondPoint.y + 5) {
						if (drawingManager.getPhase() != Phase.furnitureSizing) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							drawingManager.getRoom().furnitures[i].data[j].size = size;
							drawingManager.getRoom().furnitures[i].data[j].direction = Direction.West;
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				}
			}
			const point = new Point(e.layerX, e.layerY);
			if (!b && drawingManager.pointOnWall(point, drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal)) {
				let size = prompt("Méret:");
				if (parseFloat(size) >= 0) {
					drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.dist = size;
					context.clearRect(0, 0, canvas.width, canvas.height);
					draw();
				} else {
					alert('Hibás méret!');
				}
				draw();
				b = true;
			}
			if (!b && drawingManager.pointOnWall(point, drawingManager.getRoom().furnitures[i].distance_from_walls.vertical)) {
				let size = prompt("Méret:");
				if (parseFloat(size) >= 0) {
					drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.dist = size;
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

	}

	if (drawingManager.getPhase() == Phase.product) {
		for (let i = 0; i < drawingManager.getRoom().furnitures.length; ++i) {
			const point = {x: e.layerX, y: e.layerY};
			if (drawingManager.inObject(point, drawingManager.getRoom().furnitures[i].data)) {
				setProduct(i, e);
				draw();
			}
		}
	}

	if (drawingManager.getPhase() == Phase.route) {
		if (e.clientY > canvas.height * 0.9) return;
		let b = false;
		const point = {x: e.layerX, y: e.layerY};
		let p;
		let ind;
		for (let i = 0; i < drawingManager.getRoom().graph.addition.length; ++i) {
			let coordinate = drawingManager.getRoom().graph.addition[i].coordinate;
			if (point.x - 10 < coordinate.x &&  point.x + 10 > coordinate.x &&
				point.y - 10 < coordinate.y &&  point.y + 10 > coordinate.y) {
					b = true;
					p = drawingManager.getRoom().graph.adjacencyList[i];
					ind = i;
				}
		}

		if (b) {
			if (selected !== undefined) {
				const point_a = drawingManager.getRoom().graph.addition[selected].coordinate;
				const point_b = drawingManager.getRoom().graph.addition[ind].coordinate;
				const distance = getDistance(point_a, point_b);
				drawingManager.getRoom().graph.addEdge(selected, ind, distance);
				selected = undefined;
				draw();
			} else {
				selected = ind;
				draw();
			}
		} else {
			drawingManager.getRoom().graph.addVertex(point);
			draw();
		}
	}
}

function getDistance(point1, point2) {
	const a = point1.x - point2.x;
	const b = point1.y - point2.y;
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function save() {
	if (confirm('Menti az alaprajzot?')) {
		let name = prompt('Alaprajz neve:');
		drawingManager.getRoom().setName(name);
		let room = drawingManager.getRoom();
		download(JSON.stringify(room),'floorPlan.json','text/plain');
	}
}

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

const next = function() {
    switch (drawingManager.getPhase()) {
            case Phase.drawing:
                console.log('squaring');
                drawingManager.searchNextWall();
                while (!drawingManager.isAnySameDirection()) {
                    drawingManager.mergeSameDirections();
                }
                if (drawingManager.getRoom().walls.length < 4) {
                    alert('Kevés fal lett rajzolva!');
                    return;
                }
                if (drawingManager.getRoom().walls.length % 2 === 1) {
                    alert('Páratlan a falak száma!');
                    return;
                }
                drawingManager.squaring();
                drawingManager.setPhase(Phase.squaring);
                console.log(drawingManager.getPhase());
                draw();
            break;
        case Phase.squaring:
                drawingManager.scalingToWindowSize();
                drawingManager.setPhase(Phase.beacon);
                console.log('beacon');
                draw();
            break;
        case Phase.beacon:
                let b = false;
                drawingManager.getRoom().beacons.forEach(beacon => {
                    if (beacon.pos <= 0) {
                        b = true;
                        return;
                    }
                });
                console.log('beacon');
                if (b) {
                    alert('Nincs megadva az összes jeladó pozíciója!');
                    return;
                }
                drawingManager.scalingBeacons();
                drawingManager.setPhase(Phase.furnishing);
                prevX = undefined, prevY = undefined;
                currX = undefined, currY = undefined;
                if (!confirm('Akarsz hozzáadni berendezést?')) {
                    drawingManager.setPhase(Phase.route);
                    console.log('furnishingPhase');
                }
                draw();
            break;
        case Phase.furnishing:
                if (furniture.length > 0) {
                    if (confirm('Hozzáadod a felrajzolt objektumot?')) {
                        if (furniture.length > 0) {
                            furniture = drawingManager.squareFurniture(furniture);
                            if (furniture.length <= 0) return;
                            drawingManager.placeSomething(furniture);
                            draw();
                            prevX = undefined, prevY = undefined;
                            currX = undefined, currY = undefined;
                            furniture = [];
							drawingManager.setPhase(Phase.furnitureSizing)
                        }
                        return;
                    }
                }
				draw();
            break;
        case Phase.furnitureSizing:
                drawingManager.scaleFurnitures();
                if (confirm('Végeztél a berendezések hozzáadásával?')) {
					drawingManager.setPhase(Phase.product)
                    prevX = undefined, prevY = undefined;
                    currX = undefined, currY = undefined;
                    console.log('furnitureSizingPhase');
                } else {
					drawingManager.setPhase(Phase.furnishing)
                }
                draw();
                console.log('productPhase');
            break;
        case Phase.product:
                drawingManager.setPhase(Phase.route);
                draw();
            break;
        case Phase.route:
                prevX = undefined, prevY = undefined;
                currX = undefined, currY = undefined;
                drawingManager.setPhase(Phase.final);
                draw();
            break;
        case Phase.final:
                save();
				draw();
            break;
    }
}

function back() {
    switch (drawingManager.getPhase()) {
        case Phase.drawing:
				// TODO menu
				drawingManager.setPhase(Phase.drawing);
				context.clearRect(0, 0, canvas.width, canvas.height);
				draw();
            break;
        case Phase.squaring:
				context.clearRect(0, 0, canvas.width, canvas.height);
				draw();
            break;
        case Phase.beacon:
				if (drawingManager.getRoom().beacons.length === 0) {
					drawingManager.setPhase(Phase.drawing);
				} else {
					drawingManager.getRoom().beacons.splice(-1,1);
				}
				draw();
            break;
        case Phase.furnishing:
				context.clearRect(0, 0, canvas.width, canvas.height);
				furniture = [];
				//furnitures = [];
				if (drawingManager.getRoom().furnitures.length === 0) {
					drawingManager.setPhase(Phase.beacon);
				} else {
					drawingManager.getRoom().furnitures.splice(-1, 1);
				}
				draw();
            break;
        case Phase.furnitureSizing:
				drawingManager.setPhase(Phase.furnishing);
				draw();
            break;
        case Phase.product:
				context.clearRect(0, 0, canvas.width, canvas.height);
				drawingManager.setPhase(Phase.furnishing);
				draw();
            break;
        case Phase.route:
				drawingManager.getRoom().graph = new Graph();
				drawingManager.setPhase(Phase.product);
				draw();
            break;
        case Phase.final:
				drawingManager.setPhase(Phase.route);
				draw();
            break;
    }
}

function clear() {
    drawingManager.init();
    draw();
}

/* Egér eseménykezelők rajzoláshoz  */
canvas.addEventListener("mousemove", function (e) {
	if (drawingManager.getPhase() == Phase.drawing || drawingManager.getPhase() == Phase.furnishing) {
		paintCoord('move', e);
	}
}, false);
canvas.addEventListener("mousedown", function (e) {
	if (drawingManager.getPhase() == Phase.drawing || drawingManager.getPhase() == Phase.furnishing) {
		paintCoord('down', e);
	}
}, false);
canvas.addEventListener("mouseup", function (e) {
	if (drawingManager.getPhase() == Phase.drawing || drawingManager.getPhase() == Phase.furnishing) {
		paintCoord('up', e);
	}
}, false);
canvas.addEventListener("mouseout", function (e) {
	if (drawingManager.getPhase() == Phase.drawing || drawingManager.getPhase() == Phase.furnishing) {
		paintCoord('out', e);
	}
}, false);

/* Érintés eseménykezelők rajzoláshoz */
canvas.addEventListener("touchmove", function (e) {
	if (drawingManager.getPhase() == Phase.drawing || drawingManager.getPhase() == Phase.furnishing) {
		paintCoord2('move', e);
	}
}, false);
canvas.addEventListener("touchstart", function (e) {
	if (drawingManager.getPhase() == Phase.drawing || drawingManager.getPhase() == Phase.furnishing) {
		paintCoord2('down', e);
	}
}, false);
canvas.addEventListener("touchend", function (e) {
	if (drawingManager.getPhase() == Phase.drawing || drawingManager.getPhase() == Phase.furnishing) {
		paintCoord2('up', e);
	}
}, false);
canvas.addEventListener("touchcancel", function (e) {
	if (drawingManager.getPhase() == Phase.drawing || drawingManager.getPhase() == Phase.furnishing) {
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
	if (e.clientY > canvas.height * 0.9) return;
	if (drawingManager.getPhase() !== Phase.drawing && drawingManager.getPhase() !== Phase.furnishing && drawingManager.getPhase() !== Phase.route) return;
	if (ms === 'down') {
		prevX = currX;
		prevY = currY;
		currX = e.clientX - canvas.offsetLeft;
		currY = e.clientY - canvas.offsetTop;

		drawingCoords.push(new Point(currX, currY));

		if (!fPB) {
			firstPoint = new Point(currX, currY);
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
			secondPoint = new Point(currX, currY);
			if (drawingManager.getPhase() == Phase.drawing) {
				drawingManager.getRoom().addWall(new Wall(firstPoint, secondPoint, 0, Direction.undefinedDirection));
			}
			if (drawingManager.getPhase() == Phase.furnishing) {
				furniture.push({ name: '', firstPoint, secondPoint, size: 0, direction: '' });
				//drawingManager.getRoom().addFurniture({ name: '', firstPoint, secondPoint, size: 0, direction: '' });
			}
			drawingCoords.push(new Point(currX, currY));
			drawingManager.takeApart(drawingCoords);
			drawingCoords = [];
			fPB = false;
		}
		if (ms === 'out' || currY > canvas.height * 0.9) {
			drawingCoords = [];
			if (drawingManager.getPhase() == Phase.drawing) {
				drawingManager.getRoom().walls.splice(-1, 1);
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
			drawingCoords.push(new Point(currX, currY));
			draw();
		}
	}
}

/* Érintéshez */
function paintCoord2(ms, e) {
	if (e.touches[0].clientY > canvas.height * 0.9) return;
    if (drawingManager.getPhase() !== Phase.drawing && drawingManager.getPhase() !== Phase.furnishing) return;
	if (ms === 'down') {
		prevX = currX;
		prevY = currY;
		currX = e.touches[0].clientX - canvas.offsetLeft;
		currY = e.touches[0].clientY - canvas.offsetTop;

		drawingCoords.push(new Point(currX, currY));

		if (!fPB) {
			firstPoint = new Point(currX, currY);
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
			secondPoint = new Point(currX, currY);
			if (drawingManager.getPhase() == Phase.drawing) {
				drawingManager.getRoom().addWall(firstPoint, secondPoint, 0, Direction.undefinedDirection);
			}
			if (drawingManager.getPhase() == Phase.furnishing) {
				furniture.push({ name: '', firstPoint, secondPoint, size: 0, direction: '' });
				//drawingManager.getRoom().addFurniture({ name: '', firstPoint, secondPoint, size: 0, direction: '' });
			}
			drawingCoords.push(new Point(currX, currY));
			drawingManager.takeApart(drawingCoords);
			drawingCoords = [];
			fPB = false;
		}
		if (ms === 'out' || currY > canvas.height * 0.9) {
			drawingCoords = [];
			if (drawingManager.getPhase() == Phase.drawing) {
				drawingManager.getRoom().walls.splice(-1, 1);
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
			drawingCoords.push(new Point(currX, currY));
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

const draw = function (e) {
    switch (drawingManager.getPhase()) {
        case Phase.drawing:
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
                break;
        case Phase.squaring:
                context.clearRect(0, 0, canvas.width, canvas.height);
                imgMB.src = "svg_files/next.svg";
                imgBB.src = "svg_files/arrow-left.svg";
                imgDB.src = "svg_files/trash-fill.svg";
                if (drawingManager.getRoom().walls.length < 4) return;
                let h = (canvas.height - mButton.height - mButton.y);
                context.clearRect(0, 0, canvas.width, h);

                for (let i = 0; i < drawingManager.getRoom().walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(drawingManager.getRoom().walls[i].firstPoint.x, drawingManager.getRoom().walls[i].firstPoint.y);
                    context.lineTo(drawingManager.getRoom().walls[i].secondPoint.x, drawingManager.getRoom().walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(drawingManager.getRoom().walls[i].size, (drawingManager.getRoom().walls[i].firstPoint.x + drawingManager.getRoom().walls[i].secondPoint.x) / 2, (drawingManager.getRoom().walls[i].firstPoint.y + drawingManager.getRoom().walls[i].secondPoint.y) / 2)
                }
            break;
        case Phase.beacon:
                context.clearRect(0, 0, canvas.width, canvas.height);
                imgMB.src = "svg_files/next.svg";
                imgBB.src = "svg_files/arrow-left.svg";
                imgDB.src = "svg_files/trash-fill.svg";

                for (let i = 0; i < drawingManager.getRoom().walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(drawingManager.getRoom().walls[i].firstPoint.x, drawingManager.getRoom().walls[i].firstPoint.y);
                    context.lineTo(drawingManager.getRoom().walls[i].secondPoint.x, drawingManager.getRoom().walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(drawingManager.getRoom().walls[i].size, (drawingManager.getRoom().walls[i].firstPoint.x + drawingManager.getRoom().walls[i].secondPoint.x) / 2, (drawingManager.getRoom().walls[i].firstPoint.y + drawingManager.getRoom().walls[i].secondPoint.y) / 2)
                }

                for (let i = 0; i < drawingManager.getRoom().beacons.length; ++i) {
                    context.strokeStyle = "red";
                    context.fillStyle = "red";
                    context.beginPath();
                    context.arc(drawingManager.getRoom().beacons[i].x, drawingManager.getRoom().beacons[i].y, 5, 0, 2 * Math.PI);
                    context.stroke();
                    if (drawingManager.getRoom().beacons[i].pos > 0) {
                        context.fill();
                        context.font = "15px Arial";
                        context.fillStyle = "black";
                        if (drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].direction == Direction.North ||  drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].direction == Direction.West) {
                            context.beginPath();
                            context.moveTo(drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].secondPoint.x, drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].secondPoint.y);
                            context.lineTo(drawingManager.getRoom().beacons[i].x, drawingManager.getRoom().beacons[i].y);
                            context.stroke();
                            if (drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].direction == Direction.North) {
                                context.fillText(drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].size -drawingManager.getRoom(). beacons[i].pos, drawingManager.getRoom().beacons[i].x + 5, drawingManager.getRoom().beacons[i].y);
                            } else {
                                context.fillText(drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].size - drawingManager.getRoom().beacons[i].pos, drawingManager.getRoom().beacons[i].x, drawingManager.getRoom().beacons[i].y - 5);
                            }
                        } else {
                            context.beginPath();
                            context.moveTo(drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].firstPoint.x, drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].firstPoint.y);
                            context.lineTo(drawingManager.getRoom().beacons[i].x, drawingManager.getRoom().beacons[i].y);
                            context.stroke();
                            if (drawingManager.getRoom().walls[drawingManager.getRoom().beacons[i].wall].direction == Direction.South) {
                                context.fillText(drawingManager.getRoom().beacons[i].pos,drawingManager.getRoom(). beacons[i].x + 5, drawingManager.getRoom().beacons[i].y);
                            } else {
                                context.fillText(drawingManager.getRoom().beacons[i].pos, drawingManager.getRoom().beacons[i].x, drawingManager.getRoom().beacons[i].y - 5);
                            }
                        }
                    } else {
                        context.stroke();
                    }
                }
                context.strokeStyle = "black";
                context.fillStyle = "black";
            break;
        case Phase.furnishing:
                imgMB.src = "svg_files/next.svg";
                imgBB.src = "svg_files/arrow-left.svg";
                imgDB.src = "svg_files/trash-fill.svg";

                for (let i = 0; i < drawingManager.getRoom().walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(drawingManager.getRoom().walls[i].firstPoint.x, drawingManager.getRoom().walls[i].firstPoint.y);
                    context.lineTo(drawingManager.getRoom().walls[i].secondPoint.x, drawingManager.getRoom().walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(drawingManager.getRoom().walls[i].size, (drawingManager.getRoom().walls[i].firstPoint.x + drawingManager.getRoom().walls[i].secondPoint.x) / 2, (drawingManager.getRoom().walls[i].firstPoint.y + drawingManager.getRoom().walls[i].secondPoint.y) / 2)
                }

                for (let i = 0; i < drawingManager.getRoom().furnitures.length; ++i) {
                    drawingManager.getRoom().furnitures[i].data.forEach(f => {
                        context.beginPath();
                        context.moveTo(f.firstPoint.x, f.firstPoint.y);
                        context.lineTo(f.secondPoint.x, f.secondPoint.y);
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
            break;
        case Phase.furnitureSizing:
                context.clearRect(0, 0, canvas.width, canvas.height);
                imgMB.src = "svg_files/next.svg";
                imgBB.src = "svg_files/arrow-left.svg";
                imgDB.src = "svg_files/trash-fill.svg";

                for (let i = 0; i < drawingManager.getRoom().walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(drawingManager.getRoom().walls[i].firstPoint.x, drawingManager.getRoom().walls[i].firstPoint.y);
                    context.lineTo(drawingManager.getRoom().walls[i].secondPoint.x, drawingManager.getRoom().walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(drawingManager.getRoom().walls[i].size, (drawingManager.getRoom().walls[i].firstPoint.x + drawingManager.getRoom().walls[i].secondPoint.x) / 2, (drawingManager.getRoom().walls[i].firstPoint.y + drawingManager.getRoom().walls[i].secondPoint.y) / 2)
                }

                for (let i = 0; i < drawingManager.getRoom().furnitures.length; ++i) {
                    context.strokeStyle = "black";
                    context.fillStyle = "black";
                    drawingManager.getRoom().furnitures[i].data.forEach(furniture => {
                        context.beginPath();
                        context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
                        context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
                        context.stroke();
                        context.font = "15px Arial";
                        context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
                    });
                    if (!drawingManager.getRoom().furnitures[i].scaled) {
                        context.beginPath();
                        context.setLineDash([5, 10]);
                        context.moveTo(drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.firstPoint.x, drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.firstPoint.y);
                        context.lineTo(drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.secondPoint.x, drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.secondPoint.y);
                        context.stroke();

                        context.font = "15px Arial";
                        context.fillText(drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.dist, (drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.firstPoint.x + drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.secondPoint.x) / 2, (drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.firstPoint.y + drawingManager.getRoom().furnitures[i].distance_from_walls.horizontal.secondPoint.y) / 2);

                        context.beginPath();
                        context.moveTo(drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.firstPoint.x,drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.firstPoint.y);
                        context.lineTo(drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.secondPoint.x,drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.secondPoint.y);
                        context.stroke();
                        context.setLineDash([]);

                        context.font = "15px Arial";
                        context.fillText(drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.dist, (drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.firstPoint.x + drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.secondPoint.x) / 2, (drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.firstPoint.y + drawingManager.getRoom().furnitures[i].distance_from_walls.vertical.secondPoint.y) / 2);
                    }
                }
                context.strokeStyle = "black";
                context.fillStyle = "black";
            break;
        case Phase.product:
				context.clearRect(0, 0, canvas.width, canvas.height);
				imgMB.src = "svg_files/next.svg";
				imgBB.src = "svg_files/arrow-left.svg";
				imgDB.src = "svg_files/trash-fill.svg";

				for (let i = 0; i < drawingManager.getRoom().walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(drawingManager.getRoom().walls[i].firstPoint.x, drawingManager.getRoom().walls[i].firstPoint.y);
                    context.lineTo(drawingManager.getRoom().walls[i].secondPoint.x, drawingManager.getRoom().walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(drawingManager.getRoom().walls[i].size, (drawingManager.getRoom().walls[i].firstPoint.x + drawingManager.getRoom().walls[i].secondPoint.x) / 2, (drawingManager.getRoom().walls[i].firstPoint.y + drawingManager.getRoom().walls[i].secondPoint.y) / 2)
                }

				for (let i = 0; i < drawingManager.getRoom().furnitures.length; ++i) {
                    context.strokeStyle = "black";
                    context.fillStyle = "black";
                    drawingManager.getRoom().furnitures[i].data.forEach(furniture => {
                        context.beginPath();
                        context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
                        context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
                        context.stroke();
                        context.font = "15px Arial";
                        context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
                    });
                    /* drawingManager.getRoom().furnitures[i].products.forEach(product => {
                        context.strokeStyle = "green";
                        context.fillStyle = "green";
                        context.beginPath();
                        context.arc(product.x, product.y, 5, 0, 2 * Math.PI);
                        if (product.name === '') {
                            context.stroke();
                        } else {
                            context.fill();
                        }
                    }); */
                }
/* 
				for (let i = 0; i < furnitures.length; ++i) {
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
				} */
				context.strokeStyle = "black";
				context.fillStyle = "black";
            break;
        case Phase.route:
                context.clearRect(0, 0, canvas.width, canvas.height);
                imgMB.src = "svg_files/next.svg";
                imgBB.src = "svg_files/arrow-left.svg";
                imgDB.src = "svg_files/trash-fill.svg";

                for (let i = 0; i < drawingManager.getRoom().walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(drawingManager.getRoom().walls[i].firstPoint.x, drawingManager.getRoom().walls[i].firstPoint.y);
                    context.lineTo(drawingManager.getRoom().walls[i].secondPoint.x, drawingManager.getRoom().walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(drawingManager.getRoom().walls[i].size, (drawingManager.getRoom().walls[i].firstPoint.x + drawingManager.getRoom().walls[i].secondPoint.x) / 2, (drawingManager.getRoom().walls[i].firstPoint.y + drawingManager.getRoom().walls[i].secondPoint.y) / 2)
                }

                for (let i = 0; i < drawingManager.getRoom().furnitures.length; ++i) {
                    context.strokeStyle = "black";
                    context.fillStyle = "black";
                    drawingManager.getRoom().furnitures[i].data.forEach(furniture => {
                        context.beginPath();
                        context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
                        context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
                        context.stroke();
                        context.font = "15px Arial";
                        context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
                    });
                    /* drawingManager.getRoom().furnitures[i].products.forEach(product => {
                        context.strokeStyle = "green";
                        context.fillStyle = "green";
                        context.beginPath();
                        context.arc(product.x, product.y, 5, 0, 2 * Math.PI);
                        if (product.name === '') {
                            context.stroke();
                        } else {
                            context.fill();
                        }
                    }); */
                }


				for (let i = 0; i < drawingManager.getRoom().graph.addition.length; ++i) {
					context.fillStyle = "brown";
                    context.strokeStyle = "brown";
                    context.beginPath();
                    context.arc(drawingManager.getRoom().graph.addition[i].coordinate.x, drawingManager.getRoom().graph.addition[i].coordinate.y, 5, 0, 2 * Math.PI);
                    context.stroke();

                    if (selected !== undefined && i === selected) {
                        context.fill();
                    }

					for (let j = 0; j < drawingManager.getRoom().graph.adjacencyList[i.toString()].length; ++j) {
						context.beginPath();
						context.moveTo(drawingManager.getRoom().graph.addition[i].coordinate.x, drawingManager.getRoom().graph.addition[i].coordinate.y);
						let index = drawingManager.getRoom().graph.adjacencyList[i.toString()][j].node;
						context.lineTo(drawingManager.getRoom().graph.addition[index].coordinate.x, drawingManager.getRoom().graph.addition[index].coordinate.y);
						context.stroke();
					}
				}
                context.strokeStyle = "black";
                context.fillStyle = "black";
            break;
        case Phase.final:
            break;
    }
}

draw();