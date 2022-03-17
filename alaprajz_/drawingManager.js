const drawingManager = new (function() {

    let room;
    let phase;

    const init = function() {
        room = new Room();
        phase = Phase.drawing;
    }

    const getPhase = function() { return phase; }
    const getRoom = function() { return room; }

    const setPhase = function(phase_) { phase = phase_; }
    const setWallSize = function(index, size) { room.walls[index].setSize(size); }
    const setWallDirection = function(index, direction) { room.walls[index].setDirection(direction); }

    /* felhelyezi az obj.-ot a szobába */
    const placeSomething = function(furniture) {
        let name_prompt = prompt('Objektum neve:');
        let nearest_walls = searchNearestWalls();

        nearest_walls.horizontal.firstPoint = {x: (furniture[nearest_walls.horizontal.furniture_index].firstPoint.x + furniture[nearest_walls.horizontal.furniture_index].secondPoint.x) / 2, y: furniture[nearest_walls.horizontal.furniture_index].firstPoint.y };
        nearest_walls.horizontal.secondPoint = {x: (furniture[nearest_walls.horizontal.furniture_index].firstPoint.x + furniture[nearest_walls.horizontal.furniture_index].secondPoint.x) / 2, y: room.walls[nearest_walls.horizontal.wall_index].firstPoint.y};
        nearest_walls.horizontal.dist = 0;

        nearest_walls.vertical.firstPoint = {x: furniture[nearest_walls.vertical.furniture_index].firstPoint.x, y: (furniture[nearest_walls.vertical.furniture_index].firstPoint.y + furniture[nearest_walls.vertical.furniture_index].secondPoint.y) / 2};
        nearest_walls.vertical.secondPoint = {x: room.walls[nearest_walls.vertical.wall_index].firstPoint.x, y: (furniture[nearest_walls.vertical.furniture_index].firstPoint.y + furniture[nearest_walls.vertical.furniture_index].secondPoint.y) / 2};
        nearest_walls.vertical.dist = 0;
        room.addFurniture(new Furniture(name_prompt, furniture, {direction: Direction.undefinedDirection, start: {x: 0, y: 0}, end: {x: 0, y: 0}}, nearest_walls, false));
        //room.furnitures.push(new Furniture(name_prompt, furniture, {direction: Direction.undefinedDirection, start: {x: 0, y: 0}, end: {x: 0, y: 0}}, nearest_walls, false));
        //room.furnitures.push({name: name_prompt ,data: furniture, products: [], separators: [], info: {direction: '', start: {x: 0, y: 0}, end: {x: 0, y: 0}}, distance_from_walls: nearest_walls, scaled: false});
    }

    /* Megkeresi a legközelebbi függőleges és vízszintes falat az objektumhoz */
    const searchNearestWalls = function() {

        let nearest_wall_horizontal = [];
        let nearest_wall_vertical = [];

        for (let i = 0; i < furniture.length; ++i) {
            let indH;
            let indV;
            let distH;
            let distV;
            if (getDirection(furniture[0]) === Direction.vertical) {
                indH = 1;
                indV = 0;
                distH = getDistance({x: 0, y: room.walls[indH].firstPoint.y}, {x: 0, y: furniture[i].firstPoint.y});
                distV = getDistance({x: room.walls[indV].firstPoint.x, y: 0}, {x: furniture[i].firstPoint.x, y: 0});
            } else {
                indH = 0;
                indV = 1;
                distH = getDistance({x: 0, y: room.walls[indH].firstPoint.y}, {x: 0, y: furniture[i].firstPoint.y});
                distV = getDistance({x: room.walls[indV].firstPoint.x, y: 0}, {x: furniture[i].firstPoint.x, y: 0});
            }
            
            for (let j = 2; j < room.walls.length; ++j) {
                if (getDirection(furniture[i]) === Direction.vertical && (room.walls[j].direction === Direction.North || room.walls[j].direction === Direction.South)  &&
                    isNextToItVertically(room.walls[j], furniture[i]) === true) {
                    if (distV > getDistance({x: room.walls[j].firstPoint.x, y: 0}, {x: furniture[i].firstPoint.x, y: 0})) {
                            indV = j;
                            distV = getDistance({x: room.walls[j].firstPoint.x, y: 0}, {x: furniture[i].firstPoint.x, y: 0});
                    }
                } else if (getDirection(furniture[i]) === Direction.horizontal && (room.walls[j].direction === Direction.East || room.walls[j].direction === Direction.West)  &&
                    isNextToItHorizontally(room.walls[j], furniture[i]) === true ) {
                    if (distH > getDistance({x: 0, y: room.walls[j].firstPoint.y}, {x: 0, y: furniture[i].firstPoint.y})) {
                            indH = j;
                            distH = getDistance({x: 0, y: room.walls[j].firstPoint.y}, {x: 0, y: furniture[i].firstPoint.y});
                    }
                }
            }
            if (getDirection(furniture[i]) === Direction.vertical) {
                nearest_wall_vertical.push({wall_index: indV, furniture_index: i, dist: distV, firstPoint: new Point(-1, -1), secondPoint: new Point(-1, -1)});
            } else {
                nearest_wall_horizontal.push({wall_index: indH, furniture_index: i, dist: distH, firstPoint: new Point(-1, -1), secondPoint: new Point(-1, -1)});
            }
        }

        let nwh = nearest_wall_horizontal[0];
        for (let i = 1; i < nearest_wall_horizontal.length; ++i) {
            if (nwh.dist > nearest_wall_horizontal[i].dist) {
                nwh = nearest_wall_horizontal[i];
            }
        }

        let nwv = nearest_wall_vertical[0];
        for (let i = 1; i < nearest_wall_vertical.length; ++i) {
            if (nwv.dist > nearest_wall_vertical[i].dist) {
                nwv = nearest_wall_vertical[i];
            }
        }

        return {horizontal: nwh, vertical: nwv};
    }

    /* megnézi teljese terjerdelmében mellette van e egy függőleges fal */
    const isNextToItVertically = function(room_wall, furniture_wall) {
        let mincoordY = room_wall.firstPoint.y < room_wall.secondPoint.y ? room_wall.firstPoint.y : room_wall.secondPoint.y;
        let maxcoordY = room_wall.firstPoint.y > room_wall.secondPoint.y ? room_wall.firstPoint.y : room_wall.secondPoint.y;

        let b = false;

        if (furniture_wall.firstPoint.y >= mincoordY && 
            furniture_wall.secondPoint.y >= mincoordY && 
            furniture_wall.firstPoint.y <= maxcoordY && 
            furniture_wall.secondPoint.y <= maxcoordY) {
                b = true;
        }
        return b;
    }

    /* megnézi teljese terjerdelmében mellette van e egy vízszintes fal */
    const isNextToItHorizontally = function(room_wall, furniture_wall) {
        let mincoordX = room_wall.firstPoint.x < room_wall.secondPoint.x ? room_wall.firstPoint.x : room_wall.secondPoint.x;
        let maxcoordX = room_wall.firstPoint.x > room_wall.secondPoint.x ? room_wall.firstPoint.x : room_wall.secondPoint.x;
        
        let b = false;

        if (furniture_wall.firstPoint.x >= mincoordX && 
            furniture_wall.secondPoint.x >= mincoordX && 
            furniture_wall.firstPoint.x <= maxcoordX && 
            furniture_wall.secondPoint.x <= maxcoordX) {
                b = true;
        }
        return b;
    }

    /* Szobán belül lett e megrajzolva */
    const inRoom = function(objcoords) {
        let b = true;

        objcoords.forEach(objCoord => {
            let topLeft = false, bottomLeft = false, topRigth = false, bottomRight = false;
            room.walls.forEach(coord => {
                let mincoordX = coord.firstPoint.x < coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
                let maxcoordX = coord.firstPoint.x > coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
                let mincoordY = coord.firstPoint.y < coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
                let maxcoordY = coord.firstPoint.y > coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
                /* bal felso pontja */
                if (objCoord.firstPoint.x > mincoordX && objCoord.firstPoint.y > mincoordY &&
                    objCoord.secondPoint.x > mincoordX && objCoord.secondPoint.y > mincoordY) {
                        topLeft = true;
                }
                /* bal also pontja */
                if (objCoord.firstPoint.x > mincoordX && objCoord.firstPoint.y < maxcoordY &&
                    objCoord.secondPoint.x > mincoordX && objCoord.secondPoint.y < maxcoordY) {
                        bottomLeft = true;
                }
                /* jobb felso pontja */
                if (objCoord.firstPoint.x < maxcoordX && objCoord.firstPoint.y > mincoordY &&
                    objCoord.secondPoint.x < maxcoordX && objCoord.secondPoint.y > mincoordY) {
                        topRigth = true;
                }
                /* jobb also pontja */
                if (objCoord.firstPoint.x < maxcoordX && objCoord.firstPoint.y < maxcoordY &&
                    objCoord.secondPoint.x < maxcoordX && objCoord.secondPoint.y < maxcoordY) {
                        bottomRight = true;
                }
            });
            if (bottomLeft === false || bottomRight === false|| topLeft === false || topRigth === false) {
                b = false;
            }
        });

        return b;
    }

    /* felhelezett berendezéseket kiegyenesíti */
    const squareFurniture = function(furniture) {
        if (inRoom(furniture)) {
            if (furniture.length < 4) return;

            let direction;
            if (Math.abs(furniture[0].firstPoint.x - furniture[0].secondPoint.x) >
                Math.abs(furniture[0].firstPoint.y - furniture[0].secondPoint.y)) {
                direction = Direction.horizontal;
                furniture[0].secondPoint.y = furniture[0].firstPoint.y;
            } else {
                direction = Direction.vertical;
                furniture[0].secondPoint.x = furniture[0].firstPoint.x;
            }

            for (let i = 1; i < furniture.length; ++i) {
                if (direction === Direction.horizontal) {
                    furniture[i].firstPoint = furniture[i - 1].secondPoint;
                    furniture[i].secondPoint.x = furniture[i].firstPoint.x;
                    direction = Direction.vertical;
                } else {
                    furniture[i].firstPoint = furniture[i - 1].secondPoint;
                    furniture[i].secondPoint.y = furniture[i].firstPoint.y;
                    direction = Direction.horizontal;
                }
            }

            if (direction === Direction.horizontal) {
                furniture[furniture.length - 1].secondPoint.x = furniture[0].firstPoint.x;
                furniture[0].firstPoint.y = furniture[furniture.length - 1].secondPoint.y;
            } else {
                furniture[furniture.length - 1].secondPoint.y = furniture[0].firstPoint.y;
                furniture[0].firstPoint.x = furniture[furniture.length - 1].secondPoint.x;
            }
        } else {
            alert('Szobán belül rajzold meg!');
            furniture = [];
            context.clearRect(0, 0, canvas.width, canvas.height);
            draw();
        }

        return furniture;
    }

    /* Arányosan felrajzolja a berendezéseket */
    const scaleFurnitures = function() {

        for (let i = 0; i < room.furnitures.length; ++i) {
            if (!room.furnitures[i].scaled) {
            let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
            room.furnitures[i].data.forEach(f => {
                switch (f.direction) {
                    case Direction.North:
                        n += parseFloat(f.size);
                        break;
                    case Direction.East:
                        e += parseFloat(f.size);
                        break;
                    case Direction.South:
                        s += parseFloat(f.size);
                        break;
                    case Direction.West:
                        w += parseFloat(f.size);
                        break;
                }
            });

            const lor = leftOrRight(room.furnitures[i].distance_from_walls.vertical);
            const vind = room.furnitures[i].distance_from_walls.vertical.furniture_index;

            if (lor === 'left') {
                switch (room.furnitures[i].data[vind].direction) {
                    case Direction.North:
                        room.furnitures[i].data[vind].firstPoint.x = room.furnitures[i].distance_from_walls.vertical.secondPoint.x + scale_permanent * room.furnitures[i].distance_from_walls.vertical.dist;
                        room.furnitures[i].data[vind].firstPoint.y = n * scale_permanent;
                        room.furnitures[i].data[vind].secondPoint.x = room.furnitures[i].data[vind].firstPoint.x;
                        room.furnitures[i].data[vind].secondPoint.y = room.furnitures[i].data[vind].firstPoint.y - scale_permanent * room.furnitures[i].data[vind].size;
                        break; 
                    case Direction.South:
                        room.furnitures[i].data[vind].firstPoint.x = room.furnitures[i].distance_from_walls.vertical.secondPoint.x + scale_permanent * room.furnitures[i].distance_from_walls.vertical.dist;
                        room.furnitures[i].data[vind].firstPoint.y = 0;
                        room.furnitures[i].data[vind].secondPoint.x = room.furnitures[i].data[vind].firstPoint.x;
                        room.furnitures[i].data[vind].secondPoint.y = room.furnitures[i].data[vind].firstPoint.y + scale_permanent * room.furnitures[i].data[vind].size;
                        break;
                }
            }
            if (lor === 'right') {
                switch (room.furnitures[i].data[vind].direction) {
                    case Direction.North:
                        room.furnitures[i].data[vind].firstPoint.x = room.furnitures[i].distance_from_walls.vertical.secondPoint.x - scale_permanent * room.furnitures[i].distance_from_walls.vertical.dist;
                        room.furnitures[i].data[vind].firstPoint.y = n * scale_permanent;
                        room.furnitures[i].data[vind].secondPoint.x = room.furnitures[i].data[vind].firstPoint.x;
                        room.furnitures[i].data[vind].secondPoint.y = room.furnitures[i].data[vind].firstPoint.y - scale_permanent * room.furnitures[i].data[vind].size;
                        break; 
                    case Direction.South:
                        room.furnitures[i].data[vind].firstPoint.x = room.furnitures[i].distance_from_walls.vertical.secondPoint.x - scale_permanent * room.furnitures[i].distance_from_walls.vertical.dist;
                        room.furnitures[i].data[vind].firstPoint.y = 0;
                        room.furnitures[i].data[vind].secondPoint.x = room.furnitures[i].data[vind].firstPoint.x;
                        room.furnitures[i].data[vind].secondPoint.y = room.furnitures[i].data[vind].firstPoint.y + scale_permanent * room.furnitures[i].data[vind].size;
                        break;
                }
            }

        for (let j = vind + 1; j < room.furnitures[i].data.length; ++j) {
                if (room.furnitures[i].data[j].direction === Direction.North) {
                    room.furnitures[i].data[j].firstPoint = room.furnitures[i].data[j - 1].secondPoint;
                    room.furnitures[i].data[j].secondPoint.x = room.furnitures[i].data[j].firstPoint.x
                    room.furnitures[i].data[j].secondPoint.y = room.furnitures[i].data[j].firstPoint.y - scale_permanent * room.furnitures[i].data[j].size;
                } else if (room.furnitures[i].data[j].direction === Direction.South) {
                    room.furnitures[i].data[j].firstPoint = room.furnitures[i].data[j - 1].secondPoint;
                    room.furnitures[i].data[j].secondPoint.x = room.furnitures[i].data[j].firstPoint.x;
                    room.furnitures[i].data[j].secondPoint.y = room.furnitures[i].data[j].firstPoint.y + scale_permanent * room.furnitures[i].data[j].size;
                } else if (room.furnitures[i].data[j].direction === Direction.East) {
                    room.furnitures[i].data[j].firstPoint = room.furnitures[i].data[j - 1].secondPoint;
                    room.furnitures[i].data[j].secondPoint.x = room.furnitures[i].data[j].firstPoint.x + scale_permanent * room.furnitures[i].data[j].size;
                    room.furnitures[i].data[j].secondPoint.y = room.furnitures[i].data[j].firstPoint.y;
                } else if (room.furnitures[i].data[j].direction === Direction.West) {
                    room.furnitures[i].data[j].firstPoint = room.furnitures[i].data[j - 1].secondPoint;
                    room.furnitures[i].data[j].secondPoint.x = room.furnitures[i].data[j].firstPoint.x - scale_permanent * room.furnitures[i].data[j].size;
                    room.furnitures[i].data[j].secondPoint.y = room.furnitures[i].data[j].firstPoint.y;
                }
            }
            for (let j = vind - 1; j >= 0; --j) {
                if (room.furnitures[i].data[j].direction === Direction.North) {
                    room.furnitures[i].data[j].secondPoint = room.furnitures[i].data[j + 1].firstPoint;
                    room.furnitures[i].data[j].firstPoint.x = room.furnitures[i].data[j].secondPoint.x
                    room.furnitures[i].data[j].firstPoint.y = room.furnitures[i].data[j].secondPoint.y + scale_permanent * room.furnitures[i].data[j].size;
                } else if (room.furnitures[i].data[j].direction === Direction.South) {
                    room.furnitures[i].data[j].secondPoint = room.furnitures[i].data[j + 1].firstPoint;
                    room.furnitures[i].data[j].firstPoint.x = room.furnitures[i].data[j].secondPoint.x;
                    room.furnitures[i].data[j].firstPoint.y = room.furnitures[i].data[j].secondPoint.y - scale_permanent * room.furnitures[i].data[j].size;
                } else if (room.furnitures[i].data[j].direction === Direction.East) {
                    room.furnitures[i].data[j].secondPoint = room.furnitures[i].data[j + 1].firstPoint;
                    room.furnitures[i].data[j].firstPoint.x = room.furnitures[i].data[j].secondPoint.x - scale_permanent * room.furnitures[i].data[j].size;
                    room.furnitures[i].data[j].firstPoint.y = room.furnitures[i].data[j].secondPoint.y;
                } else if (room.furnitures[i].data[j].direction === Direction.West) {
                    room.furnitures[i].data[j].secondPoint = room.furnitures[i].data[j + 1].firstPoint;
                    room.furnitures[i].data[j].firstPoint.x = room.furnitures[i].data[j].secondPoint.x + scale_permanent * room.furnitures[i].data[j].size;
                    room.furnitures[i].data[j].firstPoint.y = room.furnitures[i].data[j].secondPoint.y;
                }
            }
            room.furnitures[i].data[room.furnitures[i].data.length - 1].secondPoint = room.furnitures[i].data[0].firstPoint;

            const tob = topOrBottom(room.furnitures[i].distance_from_walls.horizontal);
            const hind = room.furnitures[i].distance_from_walls.horizontal.furniture_index;
            if (tob === 'top') {
                const topY = room.furnitures[i].distance_from_walls.horizontal.secondPoint.y + scale_permanent * room.furnitures[i].distance_from_walls.horizontal.dist;
                for (let j = 0; j < room.furnitures[i].data.length; ++j) {
                    room.furnitures[i].data[j].firstPoint.y += topY;
                    //furnitures[i].data[j].secondPoint.y = room.furnitures[i].data[vind].secondPoint.y + topY; //??????????? miért csinálja meg e nélkül ????? TODO
                }
            }
            if (tob == 'bottom') {
                const topY = room.furnitures[i].distance_from_walls.horizontal.secondPoint.y - scale_permanent * room.furnitures[i].distance_from_walls.horizontal.dist - n * scale_permanent;
                for (let j = 0; j < room.furnitures[i].data.length; ++j) {
                    room.furnitures[i].data[j].firstPoint.y += topY;
                    //furnitures[i].data[vind].secondPoint.y = room.furnitures[i].data[vind].secondPoint.y + topY; ??????????? miért csinálja meg e nélkül ????? TODO
                }
            }

            /* elválasztások a polcokon */
            if (w > n) {
                room.furnitures[i].products = divideIntoPieces(room.furnitures[i], w);
                let separations = [];
                let startPoint = topLeftCoordOfFurniture(room.furnitures[i]);
                let fp = new Point(startPoint.x, startPoint.y);
                let sp = new Point(startPoint.x, startPoint.y);
                let infostartpoint = new Point(fp, startPoint.y + n * scale_permanent);
                for (let k = 0; k < room.furnitures[i].products.length; ++k) {
                    fp = new Point(startPoint.x + (k + 1) * scale_permanent, startPoint.y);
                    sp = new Point(startPoint.x + (k + 1) * scale_permanent, startPoint.y + n * scale_permanent);
                    separations.push( new Point(fp, sp) );
                }
                fp = new Point(startPoint.x + (room.furnitures[i].products.length + 1) * scale_permanent, startPoint.y);
                sp = new Point(startPoint.x + (room.furnitures[i].products.length + 1) * scale_permanent, startPoint.y + n * scale_permanent);
                let infoendpoint = new Point(fp, sp);
                room.furnitures[i].info = {direction: Direction.horizontal, start: infostartpoint, end: infoendpoint}
                room.furnitures[i].separators = separations;
            } else {
                room.furnitures[i].products = divideIntoPieces(room.furnitures[i], n);
                let separations = [];
                let startPoint = topLeftCoordOfFurniture(room.furnitures[i]);
                let fp = new Point(startPoint.x, startPoint.y);
                let sp = new Point(startPoint.x + w * scale_permanent, startPoint.y);
                let infostartpoint = new Point(fp, sp);
                for (let k = 0; k < room.furnitures[i].products.length; ++k) {
                    fp = new Point(startPoint.x, startPoint.y + (k + 1) * scale_permanent);
                    sp = new Point(startPoint.x + w * scale_permanent, startPoint.y + (k + 1) * scale_permanent); 

                    separations.push( new Point(fp, sp) );
                }
                fp = new Point(startPoint.x, startPoint.y + (room.furnitures[i].products.length + 1) * scale_permanent); 
                sp = new Point(startPoint.x + w * scale_permanent, startPoint.y + (room.furnitures[i].products.length + 1) * scale_permanent); 
                let infoendpoint = new Point(fp, sp);
                room.furnitures[i].info = {direction: Direction.vertical, start: infostartpoint, end: infoendpoint}
                room.furnitures[i].separators = separations;
            }
            room.furnitures[i].scaled = true;
        }
        }
    }

    /* felhelyezi az adott indexű falra a "jeladót" vagy jeladóra kattintás esetén meg lehet adni a méretét*/
    const setBeacon = function(index, e) {
        let size = 0;
        
        for (let i = 0; i < room.beacons.length; ++i) {
            if (e.layerX > room.beacons[i].x - 15 && e.layerX < room.beacons[i].x + 15
                && e.layerY > room.beacons[i].y - 15 && e.layerY < room.beacons[i].y + 15
                && room.beacons[i].wall === index) {
                size = parseFloat(prompt('Add meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
                while (size >= room.walls[index].size || room.walls[index].size <= 0) {
                    alert('Hibás méret!');
                    size = parseFloat(prompt('Add meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
                }
                switch (room.walls[index].direction) {
                    case Direction.North:
                        size = room.walls[index].size - size;
                        break;
                    case Direction.West:
                        size = room.walls[index].size - size;
                        break;
                }
                room.beacons[i].pos = size;
                return;
            }
        }
        let beaconID = prompt('Add meg a jeladó azonosítóját!');
        /* Beacon(x, y, wallIndexVertical, verticalWallDistance, wallIndexHorizontal, horizontalWallDistance, id) */
        room.beacons.push(/* new Beacon(e.clientX, e.clientY) */{ x: e.clientX, y: e.clientY, wall: index, pos: size, id: beaconID });
        console.log(room.beacons)
        draw();
    }

    /* Arányosan rajzolja fel a jeladókat */
    const scalingBeacons = function() {
        for (let i = 0; i < room.walls.length; ++i) {
            for (let j = 0; j < room.beacons.length; ++j) {
                if (room.beacons[j].wall === i) {
                    switch (room.walls[i].direction) {
                        case Direction.North:
                            room.beacons[j].x = room.walls[i].firstPoint.x;
                            room.beacons[j].y = room.walls[i].firstPoint.y - room.beacons[j].pos * scale_permanent;
                            break;
                        case Direction.South:
                            room.beacons[j].x = room.walls[i].firstPoint.x;
                            room.beacons[j].y = room.walls[i].firstPoint.y + room.beacons[j].pos * scale_permanent;
                            break;
                        case Direction.East:
                            room.beacons[j].x = room.walls[i].firstPoint.x + room.beacons[j].pos * scale_permanent;
                            room.beacons[j].y = room.walls[i].firstPoint.y;
                            break;
                        case Direction.West:
                            room.beacons[j].x = room.walls[i].firstPoint.x - room.beacons[j].pos * scale_permanent;
                            room.beacons[j].y = room.walls[i].firstPoint.y;
                            break;
                    }
                }
            }
        }
    }

    const topLeftCoordOfFurniture = function(furniture) {
        let mostLeft = furniture.data[0].firstPoint.x < furniture.data[0].secondPoint.x ? furniture.data[0].firstPoint.x : furniture.data[0].secondPoint.x;
        for (let i = 1; i < furniture.data.length; ++i) {
            if (furniture.data[i].firstPoint.x < mostLeft) {
                mostLeft = furniture.data[i].firstPoint.x;
            }
            if (furniture.data[i].secondPoint.x < mostLeft) {
                mostLeft = furniture.data[i].secondPoint.x;
            }
        }
        let mostTop = furniture.data[0].firstPoint.y < furniture.data[0].secondPoint.y ? furniture.data[0].firstPoint.y : furniture.data[0].secondPoint.y;
        for (let i = 1; i < furniture.data.length; ++i) {
            if (furniture.data[i].firstPoint.y < mostLeft) {
                mostTop = furniture.data[i].firstPoint.y;
            }
            if (furniture.data[i].secondPoint.y < mostLeft) {
                mostTop = furniture.data[i].secondPoint.y;
            }
        }
        return {x: mostLeft, y: mostTop};
    }

    /* bal vagy jobb oldalon van e a legközelebbi fal */
    function leftOrRight(coord) {
        if (coord.firstPoint.x > coord.secondPoint.x) {
            return 'left';
        } else {
            return 'right';
        }
    }
    /* felső vagy alsó oldalon van e a legközelebbi fal */
    function topOrBottom(coord) {
        if (coord.firstPoint.y > coord.secondPoint.y) {
            return 'top';
        } else {
            return 'bottom';
        }
    }

    function divideIntoPieces(furniture, size) {
        let productPlaces = [];

        for (let i = 0; i < size - 1; ++i) {
            productPlaces.push({stuffHere: []});
        }

        return productPlaces;
    }


    const searchNextWall = function() {

        let tmp_walls = [];
        const basic_length = room.walls.length;
        tmp_walls.push(new Wall(room.walls[0].firstPoint, room.walls[0].secondPoint, 0, room.walls[0].direction));
        room.walls.splice(0, 1);
        while (tmp_walls.length < basic_length) {
            const tmp_befPoint = tmp_walls[tmp_walls.length - 1].secondPoint;
            let tmp_curr = room.walls[0];
            let tmp_index = 0;
            
            for (let i = 1; i < room.walls.length; ++i) {
    
                let tmp_firstPointDistance = getDistance(tmp_curr.firstPoint, tmp_befPoint);
                let tmp_secondPointDistance = getDistance(tmp_curr.secondPoint, tmp_befPoint);
                const firstPointDistance = getDistance(room.walls[i].firstPoint, tmp_befPoint);
                const secondPointDistance = getDistance(room.walls[i].secondPoint, tmp_befPoint);
                let minDistance = tmp_firstPointDistance < tmp_secondPointDistance ? tmp_firstPointDistance : tmp_secondPointDistance;
    
                if (firstPointDistance < minDistance || secondPointDistance < minDistance) {
                    tmp_curr = room.walls[i];
                    tmp_index = i;
                }
            }
    
            const tmp_firstPoint = tmp_curr.firstPoint;
            const tmp_secondPoint = tmp_curr.secondPoint;
            const tmp_firstPointDistance2 = getDistance(tmp_firstPoint, tmp_befPoint);
            const tmp_secondPointDistance2 = getDistance(tmp_secondPoint, tmp_befPoint);
    
            if (tmp_firstPointDistance2 <= tmp_secondPointDistance2) {
                tmp_walls.push(new Wall(tmp_firstPoint, tmp_secondPoint, 0, Direction.undefinedDirection));
            } else {
                tmp_walls.push(new Wall(tmp_secondPoint, tmp_firstPoint, 0, Direction.undefinedDirection));
            }
            
            room.walls.splice(tmp_index, 1);
        }
    
        room.walls = tmp_walls;
    }


    /* Két pont közötti távolságot számolja ki */
    const getDistance = function(point1, point2) {
        const a = point1.x - point2.x;
        const b = point1.y - point2.y;
        return Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
    }

    /* Szétszedi azokat a falakat, amik "egyben" lettek felrajzolva, de derékszög van bennük */
    const takeApart = function(drawingcoords) {
        if (drawingcoords.length <= 10) return;
        
        let breakPoints = [];
        let direction;
        if (Math.abs(drawingcoords[0].x - drawingcoords[10].x) >
            Math.abs(drawingcoords[0].y - drawingcoords[10].y)) {
                direction = Direction.horizontal;
        } else {
            direction = Direction.vertical;
        }

        for (let i = 10; i < drawingcoords.length - 11; i += 10) {
            if (Math.abs(drawingcoords[i].x - drawingcoords[i + 10].x) >
                Math.abs(drawingcoords[i].y - drawingcoords[i + 10].y)) {
                    if (direction === Direction.vertical) {
                        breakPoints.push(new Point(drawingcoords[i].x, drawingcoords[i].y));
                    }
                direction = Direction.horizontal;
            } else {
                if (direction === Direction.horizontal) {
                    breakPoints.push(new Point(drawingcoords[i].x,drawingcoords[i].y))
                }
                direction = Direction.vertical;
            }
        }

        if (breakPoints.length < 1) return;

        if (phase == Phase.drawing) {
            room.walls.splice(-1,1);
            room.addWall(new Wall(new Point(drawingcoords[0].x, drawingcoords[0].y), new Point(breakPoints[0].x, breakPoints[0].y), 0, Direction.undefinedDirection));
            for (let i = 0; i < breakPoints.length - 1; ++i) {
                room.addWall(new Wall(new Point(breakPoints[i].x, breakPoints[i].y), new Point(breakPoints[i + 1].x, breakPoints[i + 1].y),  0, Direction.undefinedDirection));
            }
            room.addWall(new Wall(new Point(breakPoints[breakPoints.length - 1].x, breakPoints[breakPoints.length - 1].y), new Point(drawingcoords[drawingcoords.length - 1].x, drawingcoords[drawingcoords.length - 1].y), 0, Direction.undefinedDirection));
        }
        if (phase == Phase.furnishing) {
            furniture.splice(-1,1);
            furniture.push({firstPoint: new Point(drawingcoords[0].x, drawingcoords[0].y), secondPoint: new Point(breakPoints[0].x, breakPoints[0].y), size: 0, direction: Direction.undefinedDirection });
            for (let i = 0; i < breakPoints.length - 1; ++i) {
                furniture.push({firstPoint: new Point(breakPoints[i].x, breakPoints[i].y), secondPoint: new Point(breakPoints[i + 1].x, breakPoints[i + 1].y), size: 0, direction: Direction.undefinedDirection });
            }
            furniture.push({firstPoint: new Point(breakPoints[breakPoints.length - 1].x, breakPoints[breakPoints.length - 1].y), secondPoint: new Point(drawingcoords[drawingcoords.length - 1].x, drawingcoords[drawingcoords.length - 1].y), size: 0, direction: Direction.undefinedDirection });
        }
        
    }

    /* Visszaadja, hogy függőleges vagy vízszintes "irányba" mutat a fal vektora */
    const getDirection = function(coord) {
        if (Math.abs(coord.firstPoint.x - coord.secondPoint.x) >
            Math.abs(coord.firstPoint.y - coord.secondPoint.y)) {
            return Direction.horizontal;
        } else {
            return Direction.vertical;
        }
    }

    /* Összeolvaszt két pontot TODO */
    const mergeTwoPoints = function(P1, P2) {

        const minCoordX = Math.min(P1.firstPoint.x, P1.secondPoint.x, P2.firstPoint.x, P2.secondPoint.x);
        const maxCoordX = Math.max(P1.firstPoint.x, P1.secondPoint.x, P2.firstPoint.x, P2.secondPoint.x);
        const minCoordY = Math.min(P1.firstPoint.y, P1.secondPoint.y, P2.firstPoint.y, P2.secondPoint.y);
        const maxCoordY = Math.max(P1.firstPoint.y, P1.secondPoint.y, P2.firstPoint.y, P2.secondPoint.y);

        if (getDirection(P2) === Direction.horizontal) {
            return {
                firstPoint: new Point(minCoordX, minCoordY),
                secondPoint: new Point(maxCoordX, minCoordY),
                size: 0,
                direction: Direction.undefinedDirection
            }
        } else {
            return {
                firstPoint: new Point(minCoordX, minCoordY),
                secondPoint: new Point(minCoordX, maxCoordY),
                size: 0,
                direction: Direction.undefinedDirection
            }
        }
    }

    let cycle_counter = 0;

    /* Egybeolvassza az egymás melletti "egyirányú" falakat TODO */
    const mergeSameDirections = function() {

        let mergedcoords = [];
        let b = false;

        for (let i = 0; i < room.walls.length - 1; ++i) {
            let dir = getDirection(room.walls[i]);
            if (getDirection(room.walls[i]) === getDirection(room.walls[i + 1])) {
                
                mergedcoords.push(mergeTwoPoints(room.walls[i], room.walls[i + 1], dir));
                if ((i + 1) === room.walls.length) {
                    b = true;
                }
                room.walls.splice((i + 1), 1)
            } else {
                mergedcoords.push(room.walls[i]);
            }
        }

        if (getDirection(room.walls[room.walls.length - 1]) === getDirection(room.walls[0])) {
            let dir = getDirection(room.walls[0]);
            mergedcoords.push(mergeTwoPoints(room.walls[room.walls.length - 1], room.walls[0], dir));
            mergedcoords.splice(0, 1)
        } else {
            if (!b) {
                mergedcoords.push(room.walls[room.walls.length - 1]);
            } 
        }
        room.walls = mergedcoords;
    }

    /* Vissza adja van e két egymásra nem merőleges fal egymás után */
    const isAnySameDirection = function() {
        if (cycle_counter === 10) {
            alert("Váratlan hiba, rajzold újra! (Kattints a törlés gombra.)");
            cycle_counter = 0;
            return true;
        }
        else {++cycle_counter;}

        /* 0 ------ (length - 1) */
        for (let i = 0; i < room.walls.length - 1; ++i) {
            if (getDirection(room.walls[i]) === getDirection(room.walls[i + 1])) {
                return false;
            }
        }

        /*  */
        if (getDirection(room.walls[room.walls.length - 1]) === getDirection(room.walls[0])) {
            return false;
        }

        return true;
    }

    const searchNearestWallsForPeak = function(pos) {

        let distH;
        let distV;
        let mostLeft;
        let mostTop;
    
        if (room.walls[0].direction === Direction.vertical) {
            distH = getDistance({ x: 0, y: room.walls[1].firstPoint.y }, { x: 0, y: pos.y });
            distV = getDistance({ x: room.walls[0].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
            mostLeft = {wallindex: 0, distance: distV / scale_permanent};
            mostTop = {wallindex: 1, distance: distH / scale_permanent}; 
        } else {
            distH = getDistance({ x: 0, y: room.walls[0].firstPoint.y }, { x: 0, y: pos.y });
            distV = getDistance({ x: room.walls[1].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
            mostLeft = {wallindex: 1, distance: distV / scale_permanent};
            mostTop = {wallindex: 0, distance: distH / scale_permanent}; 
        }
    
        for (let i = 2; i < room.walls.length; ++i) {
            if (room.walls[i].direction === Direction.vertical) {
                if (room.walls[i].firstPoint.x < room.walls[mostLeft.wallindex].firstPoint.x) {
                    distV = getDistance({ x: room.walls[i].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
                    mostLeft = {wallindex: i, distance: distV / scale_permanent};
                }
            } else if (room.walls[i].direction === Direction.horizontal) {
                if (room.walls[i].firstPoint.y < room.walls[mostTop.wallindex].firstPoint.y) {
                    distV = getDistance({ x: room.walls[i].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
                    mostLeft = {wallindex: i, distance: distV / scale_permanent};
                }
            }
        }
    
        return {hw: mostTop, vw: mostLeft};   
    
    }

    
    const pointOnWall = function(point, wall) {
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
        if (bottomLeft === false || bottomRight === false|| topLeft === false || topRigth === false) {
            b = false;
        }
        return b;
    }

    /* Arányosan rajzolja fel az alaprajzot a balfelső sarokhoz, majd középre helyezi*/
    const scalingToWindowSize = function() {
        let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
        room.walls.forEach(coord => {
            switch (coord.direction) {
                case Direction.North:
                    n += coord.size;
                    break;
                case Direction.East:
                    e += coord.size;
                    break;
                case Direction.South:
                    s += coord.size;
                    break;
                case Direction.West:
                    w += coord.size;
                    break;
            }
        });
        if (n === 0 || s === 0 || e === 0 || w === 0) {
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
        let mostLeft = room.walls[0];
        let mlIndex = 0;

        let index = 0;
        room.walls.forEach(coord => {
            if (coord.firstPoint.x < mostLeft.firstPoint.x || coord.secondPoint.x < mostLeft.firstPoint.x ||
                coord.firstPoint.x < mostLeft.secondPoint.x || coord.secondPoint.x < mostLeft.secondPoint.x) {
                mostLeft = coord;
                mlIndex = index;
            }
            ++index;
        });

        switch (room.walls[mlIndex].direction) {
            case Direction.North:
                room.walls[mlIndex].firstPoint.x = canvas.width * 0.025;
                room.walls[mlIndex].firstPoint.y = 0;
                room.walls[mlIndex].secondPoint.x = room.walls[mlIndex].firstPoint.x;
                room.walls[mlIndex].secondPoint.y = room.walls[mlIndex].firstPoint.y - scale * room.walls[mlIndex].size;
                break; 
            case Direction.South:
                room.walls[mlIndex].firstPoint.x = canvas.width * 0.025;
                room.walls[mlIndex].firstPoint.y = 0;
                room.walls[mlIndex].secondPoint.x = room.walls[mlIndex].firstPoint.x;
                room.walls[mlIndex].secondPoint.y = room.walls[mlIndex].firstPoint.y + scale * room.walls[mlIndex].size;
                break;
            case Direction.East:
                room.walls[mlIndex].secondPoint.x = canvas.width * 0.025;
                room.walls[mlIndex].secondPoint.y = 0;
                room.walls[mlIndex].firstPoint.x = room.walls[mlIndex].secondPoint.x + scale * room.walls[mlIndex].size;
                room.walls[mlIndex].firstPoint.y = room.walls[mlIndex].secondPoint.y;
                break;
            case Direction.West:
                room.walls[mlIndex].firstPoint.x = canvas.width * 0.025;
                room.walls[mlIndex].firstPoint.y = 0;
                room.walls[mlIndex].secondPoint.x = room.walls[mlIndex].firstPoint.x + scale * room.walls[mlIndex].size;
                room.walls[mlIndex].secondPoint.y = room.walls[mlIndex].firstPoint.y;
                break;
        }
        for (let i = mlIndex + 1; i < room.walls.length; ++i) {
            if (room.walls[i].direction === Direction.North) {
                room.walls[i].firstPoint = room.walls[i - 1].secondPoint;
                room.walls[i].secondPoint.x = room.walls[i].firstPoint.x
                room.walls[i].secondPoint.y = room.walls[i].firstPoint.y - scale * room.walls[i].size;
            } else if (room.walls[i].direction === Direction.South) {
                room.walls[i].firstPoint = room.walls[i - 1].secondPoint;
                room.walls[i].secondPoint.x = room.walls[i].firstPoint.x;
                room.walls[i].secondPoint.y = room.walls[i].firstPoint.y + scale * room.walls[i].size;
            } else if (room.walls[i].direction === Direction.East) {
                room.walls[i].firstPoint = room.walls[i - 1].secondPoint;
                room.walls[i].secondPoint.x = room.walls[i].firstPoint.x + scale * room.walls[i].size;
                room.walls[i].secondPoint.y = room.walls[i].firstPoint.y;
            } else if (room.walls[i].direction === Direction.West) {
                room.walls[i].firstPoint = room.walls[i - 1].secondPoint;
                room.walls[i].secondPoint.x = room.walls[i].firstPoint.x - scale * room.walls[i].size;
                room.walls[i].secondPoint.y = room.walls[i].firstPoint.y;
            }
        }
        for (let i = mlIndex - 1; i >= 0; --i) {
            if (room.walls[i].direction === Direction.North) {
                room.walls[i].secondPoint = room.walls[i + 1].firstPoint;
                room.walls[i].firstPoint.x = room.walls[i].secondPoint.x
                room.walls[i].firstPoint.y = room.walls[i].secondPoint.y + scale * room.walls[i].size;
            } else if (room.walls[i].direction === Direction.South) {
                room.walls[i].secondPoint = room.walls[i + 1].firstPoint;
                room.walls[i].firstPoint.x = room.walls[i].secondPoint.x;
                room.walls[i].firstPoint.y = room.walls[i].secondPoint.y - scale * room.walls[i].size;
            } else if (room.walls[i].direction === Direction.East) {
                room.walls[i].secondPoint = room.walls[i + 1].firstPoint;
                room.walls[i].firstPoint.x = room.walls[i].secondPoint.x - scale * room.walls[i].size;
                room.walls[i].firstPoint.y = room.walls[i].secondPoint.y;
            } else if (room.walls[i].direction === Direction.West) {
                room.walls[i].secondPoint = room.walls[i + 1].firstPoint;
                room.walls[i].firstPoint.x = room.walls[i].secondPoint.x + scale * room.walls[i].size;
                room.walls[i].firstPoint.y = room.walls[i].secondPoint.y;
            }
        }
        room.walls[room.walls.length - 1].secondPoint = room.walls[0].firstPoint;

        let topPos = room.walls[0];

        index = 0;
        room.walls.forEach(coord => {
            if (coord.firstPoint.y < topPos.firstPoint.y || coord.secondPoint.y < topPos.firstPoint.y ||
                coord.firstPoint.y < topPos.secondPoint.y || coord.secondPoint.y < topPos.secondPoint.y) {
                topPos = coord;
            }
            ++index;
        });

        const topY = topPos.firstPoint.y < topPos.secondPoint.y ?
            (Math.abs(topPos.firstPoint.y) + canvas.height * 0.85 * 0.0375) : (Math.abs(topPos.secondPoint.y) + canvas.height * 0.85 * 0.0375);

        for (let i = 0; i < room.walls.length; ++i) {
            room.walls[i].firstPoint.y = room.walls[i].firstPoint.y + topY;
            //room.walls[i].secondPoint.y = room.walls[i].secondPoint.y + topY;
        }

        // Középre igazítás
        let toSlide;
        if (stmp1 < stmp2) {
            toSlide = (stmp2 * e - scale * e) / 2;
            for (let i = 0; i < room.walls.length; ++i) {
                room.walls[i].firstPoint.x = room.walls[i].firstPoint.x + toSlide;
            }
        } else {
            toSlide = (stmp1 * s - stmp2 * s) / 2;
            for (let i = 0; i < room.walls.length; ++i) {
                room.walls[i].firstPoint.y = room.walls[i].firstPoint.y + toSlide;
            }
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    /* falak "szögesítése", kiegyenesítése */
    const squaring = function() {
        if (room.walls.length < 4) return;

        let direction;
        if (Math.abs(room.walls[0].firstPoint.x - room.walls[0].secondPoint.x) >
            Math.abs(room.walls[0].firstPoint.y - room.walls[0].secondPoint.y)) {
            direction = Direction.horizontal;
            room.walls[0].secondPoint.y = room.walls[0].firstPoint.y;
        } else {
            direction = Direction.vertical;
            room.walls[0].secondPoint.x = room.walls[0].firstPoint.x;
        }

        for (let i = 1; i < room.walls.length; ++i) {
            if (direction === Direction.horizontal) {
                room.walls[i].firstPoint = room.walls[i - 1].secondPoint;
                room.walls[i].secondPoint.x = room.walls[i].firstPoint.x;
                direction = Direction.vertical;
            } else {
                room.walls[i].firstPoint = room.walls[i - 1].secondPoint;
                room.walls[i].secondPoint.y = room.walls[i].firstPoint.y;
                direction = Direction.horizontal;
            }
        }

        if (direction === Direction.horizontal) {
            room.walls[room.walls.length - 1].secondPoint.x = room.walls[0].firstPoint.x;
            room.walls[0].firstPoint.y = room.walls[room.walls.length - 1].secondPoint.y;
        } else {
            room.walls[room.walls.length - 1].secondPoint.y = room.walls[0].firstPoint.y;
            room.walls[0].firstPoint.x = room.walls[room.walls.length - 1].secondPoint.x;
        }

        phase = Phase.squaring;
    }

    const inObject = function(point, objCoord) {

        let b = true;
    
        let topLeft = false, bottomLeft = false, topRigth = false, bottomRight = false;
            objCoord.forEach(coord => {
                let mincoordX = coord.firstPoint.x < coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
                let maxcoordX = coord.firstPoint.x > coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
                let mincoordY = coord.firstPoint.y < coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
                let maxcoordY = coord.firstPoint.y > coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
                /* bal felso pontja */
                if (point.x > mincoordX && point.y > mincoordY) {
                        topLeft = true;
                }
                /* bal also pontja */
                if (point.x > mincoordX && point.y < maxcoordY) {
                        bottomLeft = true;
                }
                /* jobb felso pontja */
                if (point.x < maxcoordX && point.y > mincoordY) {
                        topRigth = true;
                }
                /* jobb also pontja */
                if (point.x < maxcoordX && point.y < maxcoordY) {
                        bottomRight = true;
                }
            });
            if (bottomLeft === false || bottomRight === false|| topLeft === false || topRigth === false) {
                b = false;
            }
    
        return b;
    }

    return {

        init: function() { return init() },

        setPhase: function(phase_) { return setPhase(phase_) },
        setWallSize: function(index, size) { return setWallSize(index, size) },
        setWallDirection: function(index, direction) { return setWallDirection(index, direction) },

        getPhase: function() { return getPhase() },  
        getRoom: function() { return getRoom() },
        
        setBeacon: function(index, e) { return setBeacon(index, e) },
        scalingBeacons: function() { return scalingBeacons() },

        takeApart: function(drawingcoords) { return takeApart(drawingcoords) },
        searchNextWall: function() { return searchNextWall() },
        scalingToWindowSize: function() { return scalingToWindowSize() },
        mergeSameDirections: function() { return mergeSameDirections() },
        isAnySameDirection: function() { return isAnySameDirection() },
        squaring: function() { return squaring() }, 

        pointOnWall: function(point, wall) { return pointOnWall(point, wall) }, /* Megadja, hogy egy pont rajta van e az adott falon */
        getDirection: function(coord) { return getDirection(coord) }, /* Visszaadja, hogy függőleges vagy vízszintes e az egyenes */
        scaleFurnitures: function() { return scaleFurnitures() }, /* Arányosan rajzolja fel a berendezéseket */
        squareFurniture: function(furniture) { return squareFurniture(furniture) },

        placeSomething: function(furniture) { return placeSomething(furniture) },
        inObject: function(point, objCoord) { return inObject(point, objCoord) },
    
    
    }
})();

drawingManager.init();