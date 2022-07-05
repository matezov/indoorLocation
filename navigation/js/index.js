const div = document.getElementById("divMapMaker");
const canvas = document.querySelector("#mapMaker");
const context = canvas.getContext("2d");
context.canvas.width = div.clientWidth;
context.canvas.height = div.clientHeight;

let room = new Room();
let phase;

function init() {
	draw();
	phase = Phase.drawing;
}

function getMousePosition(canvas, e) {

    let rect = canvas.getBoundingClientRect();

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

let selected; // gráf csúcsainak összekötéséhez a rajzolásnál

canvas.onclick = function (e) {

    let mousePosition = getMousePosition(canvas, e);

    // Falakra való kattintás
	if (phase == Phase.squaring || phase == Phase.beacon) {
		for (let i = 0; i < room.walls.length; ++i) {
			if (room.walls[i].firstPoint.x === room.walls[i].secondPoint.x
				&& room.walls[i].firstPoint.y > room.walls[i].secondPoint.y) {
				if (mousePosition.x > room.walls[i].firstPoint.x - 5 && mousePosition.x < room.walls[i].secondPoint.x + 5 &&
					mousePosition.y < room.walls[i].firstPoint.y && mousePosition.y > room.walls[i].secondPoint.y) {
					if (phase == Phase.squaring) {
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
                            room.walls[i].setSize(parseFloat(size));
                            room.walls[i].setDirection(Direction.North.get());
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert("Hibás méret!");
						}
					}
					if (phase == Phase.beacon) {
						room.setBeacon(i, mousePosition);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			} else if (room.walls[i].firstPoint.x === room.walls[i].secondPoint.x
				&& room.walls[i].firstPoint.y < room.walls[i].secondPoint.y) {
				if (mousePosition.x > room.walls[i].firstPoint.x - 5 && mousePosition.x < room.walls[i].secondPoint.x + 5 &&
					mousePosition.y > room.walls[i].firstPoint.y && mousePosition.y < room.walls[i].secondPoint.y) {
					if (phase == Phase.squaring) {
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
                            room.walls[i].setSize(parseFloat(size));
                            room.walls[i].setDirection(Direction.South.get());
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
					}
					if (phase == Phase.beacon) {
						room.setBeacon(i, mousePosition);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			} else if (room.walls[i].firstPoint.y === room.walls[i].secondPoint.y
				&& room.walls[i].firstPoint.x < room.walls[i].secondPoint.x) {
				if (mousePosition.x > room.walls[i].firstPoint.x && mousePosition.x < room.walls[i].secondPoint.x &&
					mousePosition.y > room.walls[i].firstPoint.y - 5 && mousePosition.y < room.walls[i].secondPoint.y + 5) {
					if (phase == Phase.squaring) {
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
                            room.walls[i].setSize(parseFloat(size));
                            room.walls[i].setDirection(Direction.East.get());
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
					}
					if (phase == Phase.beacon) {
						room.setBeacon(i, mousePosition);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			} else if (room.walls[i].firstPoint.y === room.walls[i].secondPoint.y
				&& room.walls[i].firstPoint.x > room.walls[i].secondPoint.x) {
				if (mousePosition.x < room.walls[i].firstPoint.x && mousePosition.x > room.walls[i].secondPoint.x &&
					mousePosition.y > room.walls[i].firstPoint.y - 5 && mousePosition.y < room.walls[i].secondPoint.y + 5) {
					if (phase == Phase.squaring) {
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
                            room.walls[i].setSize(parseFloat(size));
                            room.walls[i].setDirection(Direction.West.get());
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
					}
					if (phase == Phase.beacon) {
						room.setBeacon(i, mousePosition);
						context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
					}
				}
			}
		}
	}

	if (phase == Phase.beacon) {
		for (let i = 0; i < room.furnitures.length; ++i) {
			for (let j = 0; j < room.furnitures[i].data.length; ++j) {
				if (room.furnitures[i].data[j].firstPoint.x === room.furnitures[i].data[j].secondPoint.x
					&& room.furnitures[i].data[j].firstPoint.y > room.furnitures[i].data[j].secondPoint.y) {
					if (mousePosition.x > room.furnitures[i].data[j].firstPoint.x - 5 && mousePosition.x < room.furnitures[i].data[j].secondPoint.x + 5 &&
						mousePosition.y < room.furnitures[i].data[j].firstPoint.y && mousePosition.y > room.furnitures[i].data[j].secondPoint.y) {
							room.setBeaconOnFurniture(i, j, mousePosition);
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
					}
				} else if (room.furnitures[i].data[j].firstPoint.x === room.furnitures[i].data[j].secondPoint.x
					&& room.furnitures[i].data[j].firstPoint.y < room.furnitures[i].data[j].secondPoint.y) {
					if (mousePosition.x > room.furnitures[i].data[j].firstPoint.x - 5 && mousePosition.x < room.furnitures[i].data[j].secondPoint.x + 5 &&
						mousePosition.y > room.furnitures[i].data[j].firstPoint.y && mousePosition.y < room.furnitures[i].data[j].secondPoint.y) {
							room.setBeaconOnFurniture(i, j, mousePosition);
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
					}
				} else if (room.furnitures[i].data[j].firstPoint.y === room.furnitures[i].data[j].secondPoint.y
					&& room.furnitures[i].data[j].firstPoint.x < room.furnitures[i].data[j].secondPoint.x) {
					if (mousePosition.x > room.furnitures[i].data[j].firstPoint.x && mousePosition.x < room.furnitures[i].data[j].secondPoint.x &&
						mousePosition.y > room.furnitures[i].data[j].firstPoint.y - 5 && mousePosition.y < room.furnitures[i].data[j].secondPoint.y + 5) {
							room.setBeaconOnFurniture(i, j, mousePosition);
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
					}
				} else if (room.furnitures[i].data[j].firstPoint.y === room.furnitures[i].data[j].secondPoint.y
					&& room.furnitures[i].data[j].firstPoint.x > room.furnitures[i].data[j].secondPoint.x) {
					if (mousePosition.x < room.furnitures[i].data[j].firstPoint.x && mousePosition.x > room.furnitures[i].data[j].secondPoint.x &&
						mousePosition.y > room.furnitures[i].data[j].firstPoint.y - 5 && mousePosition.y < room.furnitures[i].data[j].secondPoint.y + 5) {
							room.setBeaconOnFurniture(i, j, mousePosition);
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
					}
				}
			}
		}
	}

    if (phase == Phase.furnitureSizing) {
		for (let i = 0; i < room.furnitures.length; ++i) {
			if (!room.furnitures[i].scaled) {
			let b = false;
			for (let j = 0; j < room.furnitures[i].data.length; ++j) {
				if (room.furnitures[i].data[j].firstPoint.x === room.furnitures[i].data[j].secondPoint.x
					&& room.furnitures[i].data[j].firstPoint.y > room.furnitures[i].data[j].secondPoint.y) {
					if (mousePosition.x > room.furnitures[i].data[j].firstPoint.x - 5 && mousePosition.x < room.furnitures[i].data[j].secondPoint.x + 5 &&
						mousePosition.y < room.furnitures[i].data[j].firstPoint.y && mousePosition.y > room.furnitures[i].data[j].secondPoint.y) {
						if (phase != Phase.furnitureSizing) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							room.furnitures[i].data[j].size = parseFloat(size);
							room.furnitures[i].data[j].direction = Direction.North.get();
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				} else if (room.furnitures[i].data[j].firstPoint.x === room.furnitures[i].data[j].secondPoint.x
					&& room.furnitures[i].data[j].firstPoint.y < room.furnitures[i].data[j].secondPoint.y) {
					if (mousePosition.x > room.furnitures[i].data[j].firstPoint.x - 5 && mousePosition.x < room.furnitures[i].data[j].secondPoint.x + 5 &&
						mousePosition.y > room.furnitures[i].data[j].firstPoint.y && mousePosition.y < room.furnitures[i].data[j].secondPoint.y) {
						if (phase != Phase.furnitureSizing) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							room.furnitures[i].data[j].size = parseFloat(size);
							room.furnitures[i].data[j].direction = Direction.South.get();
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				} else if (room.furnitures[i].data[j].firstPoint.y === room.furnitures[i].data[j].secondPoint.y
					&& room.furnitures[i].data[j].firstPoint.x < room.furnitures[i].data[j].secondPoint.x) {
					if (mousePosition.x > room.furnitures[i].data[j].firstPoint.x && mousePosition.x < room.furnitures[i].data[j].secondPoint.x &&
						mousePosition.y > room.furnitures[i].data[j].firstPoint.y - 5 && mousePosition.y < room.furnitures[i].data[j].secondPoint.y + 5) {
						if (phase != Phase.furnitureSizing) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							room.furnitures[i].data[j].size = parseFloat(size);
							room.furnitures[i].data[j].direction = Direction.East.get();
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				} else if (room.furnitures[i].data[j].firstPoint.y === room.furnitures[i].data[j].secondPoint.y
					&& room.furnitures[i].data[j].firstPoint.x > room.furnitures[i].data[j].secondPoint.x) {
					if (mousePosition.x < room.furnitures[i].data[j].firstPoint.x && mousePosition.x > room.furnitures[i].data[j].secondPoint.x &&
						mousePosition.y > room.furnitures[i].data[j].firstPoint.y - 5 && mousePosition.y < room.furnitures[i].data[j].secondPoint.y + 5) {
						if (phase != Phase.furnitureSizing) return;
						let size = prompt("Méret:");
						if (parseFloat(size) > 0) {
							room.furnitures[i].data[j].size = parseFloat(size);
							room.furnitures[i].data[j].direction = Direction.West.get();
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
						} else {
							alert('Hibás méret!');
						}
						b = true;
					}
				}
			}
			const point = new Point(mousePosition.x, mousePosition.y);
			if (!b && room.pointOnWall(point, room.furnitures[i].distance_from_walls.horizontal)) {
				let size = prompt("Méret:");
				if (parseFloat(size) >= 0) {
					room.furnitures[i].distance_from_walls.horizontal.dist = parseFloat(size);
					context.clearRect(0, 0, canvas.width, canvas.height);
					draw();
				} else {
					alert('Hibás méret!');
				}
				draw();
				b = true;
			}
			if (!b && room.pointOnWall(point, room.furnitures[i].distance_from_walls.vertical)) {
				let size = prompt("Méret:");
				if (parseFloat(size) >= 0) {
					room.furnitures[i].distance_from_walls.vertical.dist = parseFloat(size);
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

	if (phase == Phase.product) {
		for (let i = 0; i < room.furnitures.length; ++i) {
			const point = {x: mousePosition.x, y: mousePosition.y};
			if (room.inObject(point, room.furnitures[i].data)) {
				room.furnitures[i].setProduct(point);
				draw();
			}
		}
	}

	if (phase == Phase.route) {
		if (mousePosition.y > canvas.height/*  * 0.9 */) return;
		let b = false;
		const point = {x: mousePosition.x, y: mousePosition.y};
		let p;
		let ind;
		for (let i = 0; i < room.graph.addition.length; ++i) {
			let coordinate = room.graph.addition[i].coordinate;
			if (point.x - 10 < coordinate.x && point.x + 10 > coordinate.x &&
				point.y - 10 < coordinate.y && point.y + 10 > coordinate.y) {
					b = true;
					p = room.graph.adjacencyList[i];
					ind = i;
			}
		}

		if (b) {
			if (selected !== undefined) {
				const point_a = room.graph.addition[selected].coordinate;
				const point_b = room.graph.addition[ind].coordinate;
				const distance = getDistance(point_a, point_b);
				room.graph.addEdge(selected, ind, distance);
				selected = undefined;
				draw();
			} else {
				selected = ind;
				draw();
			}
		} else {
            if (room.inObject(point, room.walls)) {
                let flag = false;
                for (let i = 0; i < room.furnitures.length; ++i) {
                    if (room.inObject(point, room.furnitures[i].data)) {
                        flag = true;
                    }
                }
                if (!flag) {
                    const nearestWall = room.searchNearestWallsForPeak(point);
                    room.graph.addVertex(point, nearestWall);
                    draw();
                } else {
                    alert('Berendezésen nem lehet!');
                }                
            } else {
                alert('Szobán belül kell, hogy legyen!');
            }
			
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
		room.setName(name);
		download(JSON.stringify(room), name + '.json','text/plain');
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
    switch (phase) {
            case Phase.drawing:
                if (room.walls.length < 4) {
                    alert('Kevés fal lett rajzolva (' + room.walls.length + ' db)!');
                    return;
                }
                let vh = room.searchNextWall();
                if (!vh) {
                    clear();
                    return;
                }
                while (!room.isAnySameDirection()) {
                    room.mergeSameDirections();
                }
                if (room.walls.length < 4) {
                    alert('Kevés fal lett rajzolva (' + room.walls.length + ' db)!');
                    return;
                } else if (room.walls.length % 2 === 1) {
                    alert('Páratlan a falak száma, rajzold újra!');
                    prevX = undefined, prevY = undefined;
                    currX = undefined, currY = undefined;
                    clear();
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                    return;
                }
                room.squaring();
                phase = Phase.squaring;
				prevX = undefined, prevY = undefined;
                currX = undefined, currY = undefined;
                draw();
            break;
        case Phase.squaring:
                let ok = room.scalingToWindowSize(canvas.width, canvas.height);
				if (ok) {
					if (confirm('Akarsz hozzáadni berendezést?')) {
						context.clearRect(0, 0, canvas.width, canvas.height);
						phase = Phase.furnishing;
					} else {
						context.clearRect(0, 0, canvas.width, canvas.height);
						phase = Phase.route;
					}
					draw();	
				} else {
					phase = Phase.squaring;
				}
            break;
        case Phase.furnishing:
                if (furniture.data.length > 0) {
                    if (confirm('Hozzáadod a felrajzolt objektumot?')) {
                        if (furniture.data.length > 0) {
                            if (furniture.data.length < 4) {
                                alert('Kevés oldala lett megrajzolva (' + furniture.data.length + ' db)!');
                                context.clearRect(0, 0, canvas.width, canvas.height);
							    draw();
                                return;
                            }
                            let vh = furniture.searchNextWall();
                            if (!vh) {
                                drawingCoords = [];
                                prevX = undefined, prevY = undefined;
                                currX = undefined, currY = undefined;
                                furniture = new Furniture('', [], null, null);
                                context.clearRect(0, 0, canvas.width, canvas.height);
							    draw();
                                return;
                            }
                            while (!furniture.isAnySameDirection()) {
                                furniture.mergeSameDirections();
                            }
                            furniture.squareFurniture(room.walls); //room.squareFurniture(furniture);
                            if (furniture.data.length <= 0) return;
                            room.placeSomething(furniture);
                            prevX = undefined, prevY = undefined;
                            currX = undefined, currY = undefined;
                            furniture = new Furniture('', [], null, null);
							phase = Phase.furnitureSizing;
							context.clearRect(0, 0, canvas.width, canvas.height);
							draw();
                        }
                        return;
                    } else {
                        furniture = new Furniture('', [], null, null);
                        context.clearRect(0, 0, canvas.width, canvas.height);
						draw();
                    }
                } else {
                    if (confirm('Végeztél a berendezések hozzáadásával?')) {
                        prevX = undefined, prevY = undefined;
                        currX = undefined, currY = undefined;
                        if (room.furnitures.length > 0) {
                            phase = Phase.product;
                        } else {
                            phase = Phase.route;
                        }
                    } else {
					    phase = Phase.furnishing;
                    }
                }
				draw();
            break;
        case Phase.furnitureSizing:
                let b_ = room.scaleFurnitures();
                if (b_) {
                    if (confirm('Végeztél a berendezések hozzáadásával?')) {
                        phase = Phase.product;
                        prevX = undefined, prevY = undefined;
                        currX = undefined, currY = undefined;
                    } else {
                        phase = Phase.furnishing;
                    }
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    draw();
                }
            break;
        case Phase.product:
                phase = Phase.route;
                draw();
            break;
        case Phase.route:
                prevX = undefined, prevY = undefined;
                currX = undefined, currY = undefined;
                phase = Phase.beacon;
                draw();
            break;
		case Phase.beacon:
                let b = false;
                room.beacons.forEach(beacon => {
                    if (beacon.distance <= 0) {
                        b = true;
                        return;
                    }
                });
                if (b) {
                    alert('Nincs megadva az összes jeladó pozíciója!');
                    return;
                }
                room.scaleBeacons();
                prevX = undefined, prevY = undefined;
                currX = undefined, currY = undefined;
				phase = Phase.final;
                draw();
            break;
        case Phase.final:
                save();
				draw();
            break;
    }
}

function back() {
    switch (phase) {
        case Phase.drawing:
				clear();
				context.clearRect(0, 0, canvas.width, canvas.height);
				draw();
            break;
        case Phase.squaring:
				context.clearRect(0, 0, canvas.width, canvas.height);
				drawingCoords = [];
				clear();
				phase = Phase.drawing;
				draw();
            break;
        case Phase.furnishing:
				context.clearRect(0, 0, canvas.width, canvas.height);
				furniture = new Furniture('', [], null, null);
				drawingCoords = [];
				if (room.furnitures.length === 0) {
					phase = Phase.drawing;
				} else {
					room.furnitures.splice(-1, 1);
				}
				draw();
            break;
        case Phase.furnitureSizing:
				phase = Phase.furnishing;
				draw();
            break;
        case Phase.product:
				context.clearRect(0, 0, canvas.width, canvas.height);
				phase = Phase.furnishing;
				draw();
            break;
        case Phase.route:
				room.graph = new Graph();
				phase = Phase.product;
				draw();
            break;
		case Phase.beacon:
				if (room.beacons.length === 0) {
					drawingCoords = [];
					phase = Phase.product;
				} else {
					room.beacons.splice(-1,1);
				}
				draw();
            break;
        case Phase.final:
				phase = Phase.route;
				draw();
            break;
    }
}

function clear() {
	prevX = undefined, prevY = undefined;
    currX = undefined, currY = undefined;
    drawingCoords = [];
	furniture = new Furniture('', [], null, null);
    room.clear();
	phase = Phase.drawing;
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

/* Egér eseménykezelők rajzoláshoz  */
canvas.addEventListener("mousemove", function (e) {
	if (phase == Phase.drawing || phase == Phase.furnishing) {
		paintCoord('move', e);
	}
}, false);
canvas.addEventListener("mousedown", function (e) {
	if (phase == Phase.drawing || phase == Phase.furnishing) {
		paintCoord('down', e);
	}
}, false);
canvas.addEventListener("mouseup", function (e) {
	if (phase == Phase.drawing || phase == Phase.furnishing) {
		paintCoord('up', e);
	}
}, false);
canvas.addEventListener("mouseout", function (e) {
	if (phase == Phase.drawing || phase == Phase.furnishing) {
		paintCoord('out', e);
	}
}, false);

/* Érintés eseménykezelők rajzoláshoz */
canvas.addEventListener("touchmove", function (e) {
	if (phase == Phase.drawing || phase == Phase.furnishing) {
		paintCoord2('move', e);
	}
}, false);
canvas.addEventListener("touchstart", function (e) {
	if (phase == Phase.drawing || phase == Phase.furnishing) {
		paintCoord2('down', e);
	}
}, false);
canvas.addEventListener("touchend", function (e) {
	if (phase == Phase.drawing || phase == Phase.furnishing) {
		paintCoord2('up', e);
	}
}, false);
canvas.addEventListener("touchcancel", function (e) {
	if (phase == Phase.drawing || phase == Phase.furnishing) {
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
let furniture = new Furniture('', [], null, null);

/* Egérhez */
function paintCoord(ms, e) {
    let mousePosition = getMousePosition(canvas, e);
	if (phase !== Phase.drawing && phase !== Phase.furnishing && phase !== Phase.route) return;
	if (ms === 'down') {
		prevX = currX;
		prevY = currY;
		currX = mousePosition.x - canvas.offsetLeft;
		currY = mousePosition.y - canvas.offsetTop;

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
			currX = mousePosition.x - canvas.offsetLeft;
			currY = mousePosition.y - canvas.offsetTop;
			secondPoint = new Point(currX, currY);
            drawingCoords.push(new Point(currX, currY));
			if (phase == Phase.drawing) {
				room.addWall(new Wall(firstPoint, secondPoint, 0, Direction.undefinedDirection));
                room.takeApart(drawingCoords);
			}
			if (phase == Phase.furnishing) {
				furniture.data.push(new Wall(firstPoint, secondPoint, 0, Direction.undefinedDirection));
                furniture.takeApart(drawingCoords);
			}
			
			drawingCoords = [];
			fPB = false;
		}
		if (ms === 'out' || currY > canvas.height) {
			drawingCoords = [];
			fPB = false;
		}
		flag = false;
	}
	if (ms === 'move') {
		if (flag) {
			prevX = currX;
			prevY = currY;
			currX = mousePosition.x - canvas.offsetLeft;
			currY = mousePosition.y - canvas.offsetTop;
			drawingCoords.push(new Point(currX, currY));
			draw();
		}
	}
}

/* Érintéshez */
function paintCoord2(ms, e) {
    let mousePosition = getMousePosition(canvas, e.touches[0]);
    if (phase !== Phase.drawing && phase !== Phase.furnishing) return;
	if (ms === 'down') {
		prevX = currX;
		prevY = currY;
		currX = mousePosition.x - canvas.offsetLeft;
		currY = mousePosition.y - canvas.offsetTop;

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
			currX = mousePosition.x - canvas.offsetLeft;
			currY = mousePosition.y - canvas.offsetTop;
			secondPoint = new Point(currX, currY);
			if (phase == Phase.drawing) {
				room.addWall(new Wall(firstPoint, secondPoint, 0, Direction.undefinedDirection));
			}
			if (phase == Phase.furnishing) {
				furniture.data.push(new Wall(firstPoint, secondPoint, 0, Direction.undefinedDirection));
			}
			drawingCoords.push(new Point(currX, currY));
            if (phase == Phase.furnishing) {
                furniture.takeApart(drawingCoords);
            } else {
                room.takeApart(drawingCoords);
            }
			drawingCoords = [];
			fPB = false;
		}
		if (ms === 'out' || currY > canvas.height) {
			drawingCoords = [];
			fPB = false;
		}
		flag = false;
	}
	if (ms === 'move') {
		if (flag) {
			prevX = currX;
			prevY = currY;
			currX = mousePosition.x - canvas.offsetLeft;
			currY = mousePosition.y - canvas.offsetTop;
			drawingCoords.push(new Point(currX, currY));
			draw();
		}
	}
}

const draw = function (e) {
    switch (phase) {
        case Phase.drawing:
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
                if (room.walls.length < 4) return;
                context.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = 0; i < room.walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(room.walls[i].firstPoint.x, room.walls[i].firstPoint.y);
                    context.lineTo(room.walls[i].secondPoint.x, room.walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(room.walls[i].size, (room.walls[i].firstPoint.x + room.walls[i].secondPoint.x) / 2, (room.walls[i].firstPoint.y + room.walls[i].secondPoint.y) / 2)
                }
            break;
        case Phase.furnishing:

                for (let i = 0; i < room.walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(room.walls[i].firstPoint.x, room.walls[i].firstPoint.y);
                    context.lineTo(room.walls[i].secondPoint.x, room.walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(room.walls[i].size, (room.walls[i].firstPoint.x + room.walls[i].secondPoint.x) / 2, (room.walls[i].firstPoint.y + room.walls[i].secondPoint.y) / 2)
                }

                for (let i = 0; i < room.furnitures.length; ++i) {
                    room.furnitures[i].data.forEach(f => {
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

                for (let i = 0; i < room.walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(room.walls[i].firstPoint.x, room.walls[i].firstPoint.y);
                    context.lineTo(room.walls[i].secondPoint.x, room.walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(room.walls[i].size, (room.walls[i].firstPoint.x + room.walls[i].secondPoint.x) / 2, (room.walls[i].firstPoint.y + room.walls[i].secondPoint.y) / 2)
                }

                for (let i = 0; i < room.furnitures.length; ++i) {
                    context.strokeStyle = "black";
                    context.fillStyle = "black";
                    room.furnitures[i].data.forEach(furniture => {
                        context.beginPath();
                        context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
                        context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
                        context.stroke();
                        context.font = "15px Arial";
                        context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
                    });
                    if (!room.furnitures[i].scaled) {
                        context.beginPath();
                        context.setLineDash([5, 10]);
                        context.moveTo(room.furnitures[i].distance_from_walls.horizontal.firstPoint.x, room.furnitures[i].distance_from_walls.horizontal.firstPoint.y);
                        context.lineTo(room.furnitures[i].distance_from_walls.horizontal.secondPoint.x, room.furnitures[i].distance_from_walls.horizontal.secondPoint.y);
                        context.stroke();

                        context.font = "15px Arial";
                        context.fillText(room.furnitures[i].distance_from_walls.horizontal.dist, (room.furnitures[i].distance_from_walls.horizontal.firstPoint.x + room.furnitures[i].distance_from_walls.horizontal.secondPoint.x) / 2, (room.furnitures[i].distance_from_walls.horizontal.firstPoint.y + room.furnitures[i].distance_from_walls.horizontal.secondPoint.y) / 2);

                        context.beginPath();
                        context.moveTo(room.furnitures[i].distance_from_walls.vertical.firstPoint.x,room.furnitures[i].distance_from_walls.vertical.firstPoint.y);
                        context.lineTo(room.furnitures[i].distance_from_walls.vertical.secondPoint.x,room.furnitures[i].distance_from_walls.vertical.secondPoint.y);
                        context.stroke();
                        context.setLineDash([]);

                        context.font = "15px Arial";
                        context.fillText(room.furnitures[i].distance_from_walls.vertical.dist, (room.furnitures[i].distance_from_walls.vertical.firstPoint.x + room.furnitures[i].distance_from_walls.vertical.secondPoint.x) / 2, (room.furnitures[i].distance_from_walls.vertical.firstPoint.y + room.furnitures[i].distance_from_walls.vertical.secondPoint.y) / 2);
                    }
                }
                context.strokeStyle = "black";
                context.fillStyle = "black";
            break;
        case Phase.product:
				context.clearRect(0, 0, canvas.width, canvas.height);

				for (let i = 0; i < room.walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(room.walls[i].firstPoint.x, room.walls[i].firstPoint.y);
                    context.lineTo(room.walls[i].secondPoint.x, room.walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(room.walls[i].size, (room.walls[i].firstPoint.x + room.walls[i].secondPoint.x) / 2, (room.walls[i].firstPoint.y + room.walls[i].secondPoint.y) / 2)
                }

				for (let i = 0; i < room.furnitures.length; ++i) {
                    context.strokeStyle = "black";
                    context.fillStyle = "black";
                    room.furnitures[i].data.forEach(furniture => {
                        context.beginPath();
                        context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
                        context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
                        context.stroke();
                        context.font = "15px Arial";
                        context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
                    });
                }
				context.strokeStyle = "black";
				context.fillStyle = "black";
            break;
        case Phase.route:
                context.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = 0; i < room.walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(room.walls[i].firstPoint.x, room.walls[i].firstPoint.y);
                    context.lineTo(room.walls[i].secondPoint.x, room.walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(room.walls[i].size, (room.walls[i].firstPoint.x + room.walls[i].secondPoint.x) / 2, (room.walls[i].firstPoint.y + room.walls[i].secondPoint.y) / 2)
                }

                for (let i = 0; i < room.furnitures.length; ++i) {
                    context.strokeStyle = "black";
                    context.fillStyle = "black";
                    room.furnitures[i].data.forEach(furniture => {
                        context.beginPath();
                        context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
                        context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
                        context.stroke();
                        context.font = "15px Arial";
                        context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
                    });
                }

				for (let i = 0; i < room.graph.addition.length; ++i) {
					context.fillStyle = "brown";
                    context.strokeStyle = "brown";
                    context.beginPath();
                    context.arc(room.graph.addition[i].coordinate.x, room.graph.addition[i].coordinate.y, 5, 0, 2 * Math.PI);
                    context.stroke();

                    if (selected !== undefined && i === selected) {
                        context.fill();
                    }

					for (let j = 0; j < room.graph.adjacencyList[i.toString()].length; ++j) {
						context.beginPath();
						context.moveTo(room.graph.addition[i].coordinate.x, room.graph.addition[i].coordinate.y);
						let index = room.graph.adjacencyList[i.toString()][j].node;
						context.lineTo(room.graph.addition[index].coordinate.x, room.graph.addition[index].coordinate.y);
						context.stroke();
					}
				}
                context.strokeStyle = "black";
                context.fillStyle = "black";
            break;
		case Phase.beacon:
                context.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = 0; i < room.walls.length; ++i) {
                    context.beginPath();
                    context.moveTo(room.walls[i].firstPoint.x, room.walls[i].firstPoint.y);
                    context.lineTo(room.walls[i].secondPoint.x, room.walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(room.walls[i].size, (room.walls[i].firstPoint.x + room.walls[i].secondPoint.x) / 2, (room.walls[i].firstPoint.y + room.walls[i].secondPoint.y) / 2)
                }

				for (let i = 0; i < room.furnitures.length; ++i) {
                    room.furnitures[i].data.forEach(f => {
                        context.beginPath();
                        context.moveTo(f.firstPoint.x, f.firstPoint.y);
                        context.lineTo(f.secondPoint.x, f.secondPoint.y);
                        context.stroke();
                    });
                }

                for (let i = 0; i < room.beacons.length; ++i) {
                    context.strokeStyle = "red";
                    context.fillStyle = "red";
                    context.beginPath();
                    context.arc(room.beacons[i].x, room.beacons[i].y, 5, 0, 2 * Math.PI);
                    context.stroke();
                    if (room.beacons[i].distance > 0) {
                        context.fill();
                        context.font = "15px Arial";
                        context.fillStyle = "black";
						if (room.beacons[i].furnitureOrWall === 'wall') {
							if (room.walls[room.beacons[i].wallIndex].direction == Direction.North.get() ||  room.walls[room.beacons[i].wallIndex].direction == Direction.West.get()) {
								context.beginPath();
								context.moveTo(room.walls[room.beacons[i].wallIndex].secondPoint.x, room.walls[room.beacons[i].wallIndex].secondPoint.y);
								context.lineTo(room.beacons[i].x, room.beacons[i].y);
								context.stroke();
								if (room.walls[room.beacons[i].wallIndex].direction == Direction.North.get()) {
									context.fillText(room.walls[room.beacons[i].wallIndex].size -room. beacons[i].distance, room.beacons[i].x + 5, room.beacons[i].y);
								} else {
									context.fillText(room.walls[room.beacons[i].wallIndex].size - room.beacons[i].distance, room.beacons[i].x, room.beacons[i].y - 5);
								}
							} else {
								context.beginPath();
								context.moveTo(room.walls[room.beacons[i].wallIndex].firstPoint.x, room.walls[room.beacons[i].wallIndex].firstPoint.y);
								context.lineTo(room.beacons[i].x, room.beacons[i].y);
								context.stroke();
								if (room.walls[room.beacons[i].wallIndex].direction == Direction.South.get()) {
									context.fillText(room.beacons[i].distance,room. beacons[i].x + 5, room.beacons[i].y);
								} else {
									context.fillText(room.beacons[i].distance, room.beacons[i].x, room.beacons[i].y - 5);
								}
							}
						} else {
							if (room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].direction == Direction.North.get() ||  room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].direction == Direction.West.get()) {
								context.beginPath();
								context.moveTo(room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].secondPoint.x, room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].secondPoint.y);
								context.lineTo(room.beacons[i].x, room.beacons[i].y);
								context.stroke();
								if (room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].direction == Direction.North.get()) {
									context.fillText(room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].size -room. beacons[i].distance, room.beacons[i].x + 5, room.beacons[i].y);
								} else {
									context.fillText(room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].size - room.beacons[i].distance, room.beacons[i].x, room.beacons[i].y - 5);
								}
							} else {
								context.beginPath();
								context.moveTo(room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].firstPoint.x, room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].firstPoint.y);
								context.lineTo(room.beacons[i].x, room.beacons[i].y);
								context.stroke();
								if (room.furnitures[room.beacons[i].furnitureIndex].data[room.beacons[i].wallIndex].direction == Direction.South.get()) {
									context.fillText(room.beacons[i].distance,room. beacons[i].x + 5, room.beacons[i].y);
								} else {
									context.fillText(room.beacons[i].distance, room.beacons[i].x, room.beacons[i].y - 5);
								}
							}
						}
                    } else {
                        context.stroke();
                    }
                }
                context.strokeStyle = "black";
                context.fillStyle = "black";
            break;
        case Phase.final:
				context.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = 0; i < room.walls.length; ++i) {
					context.strokeStyle = "black";
                    context.fillStyle = "black";
                    context.beginPath();
                    context.moveTo(room.walls[i].firstPoint.x, room.walls[i].firstPoint.y);
                    context.lineTo(room.walls[i].secondPoint.x, room.walls[i].secondPoint.y);
                    context.stroke();
                    context.font = "15px Arial";
                    context.fillText(room.walls[i].size, (room.walls[i].firstPoint.x + room.walls[i].secondPoint.x) / 2, (room.walls[i].firstPoint.y + room.walls[i].secondPoint.y) / 2)
                }

				for (let i = 0; i < room.furnitures.length; ++i) {
                    context.strokeStyle = "black";
                    context.fillStyle = "black";
                    room.furnitures[i].data.forEach(furniture => {
                        context.beginPath();
                        context.moveTo(furniture.firstPoint.x, furniture.firstPoint.y);
                        context.lineTo(furniture.secondPoint.x, furniture.secondPoint.y);
                        context.stroke();
                        context.font = "15px Arial";
                        context.fillText(furniture.size, (furniture.firstPoint.x + furniture.secondPoint.x) / 2, (furniture.firstPoint.y + furniture.secondPoint.y) / 2)
                    });
                }

				for (let i = 0; i < room.beacons.length; ++i) {
                    context.strokeStyle = "red";
                    context.fillStyle = "red";
                    context.beginPath();
                    context.arc(room.beacons[i].x, room.beacons[i].y, 5, 0, 2 * Math.PI);
                    context.stroke();
				}

            break;
    }
}

init();