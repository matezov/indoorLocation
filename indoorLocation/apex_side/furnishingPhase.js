/* felhelyezi az obj.-ot a szobába */
function placeSomething() {
    let name_prompt = prompt('Objektum neve:');

    let nearest_walls = searchNearestWalls();

    nearest_walls.horizontal.firstPoint = {x: (furniture[nearest_walls.horizontal.furniture_index].firstPoint.x + furniture[nearest_walls.horizontal.furniture_index].secondPoint.x) / 2, y: furniture[nearest_walls.horizontal.furniture_index].firstPoint.y };
    nearest_walls.horizontal.secondPoint = {x: (furniture[nearest_walls.horizontal.furniture_index].firstPoint.x + furniture[nearest_walls.horizontal.furniture_index].secondPoint.x) / 2, y: coords[nearest_walls.horizontal.wall_index].firstPoint.y};
    nearest_walls.horizontal.dist = 0;

    nearest_walls.vertical.firstPoint = {x: furniture[nearest_walls.vertical.furniture_index].firstPoint.x, y: (furniture[nearest_walls.vertical.furniture_index].firstPoint.y + furniture[nearest_walls.vertical.furniture_index].secondPoint.y) / 2};
    nearest_walls.vertical.secondPoint = {x: coords[nearest_walls.vertical.wall_index].firstPoint.x, y: (furniture[nearest_walls.vertical.furniture_index].firstPoint.y + furniture[nearest_walls.vertical.furniture_index].secondPoint.y) / 2};
    nearest_walls.vertical.dist = 0;
    furnitures.push({name: name_prompt ,data: furniture, products: [], separators: [], info: {direction: '', start: {x: 0, y: 0}, end: {x: 0, y: 0}}, distance_from_walls: nearest_walls});
}

/* Megkeresi a legközelebbi függőleges és vízszintes falat az objektumhoz */
function searchNearestWalls() {

    let nearest_wall_horizontal = [];
    let nearest_wall_vertical = [];

    for (let i = 0; i < furniture.length; ++i) {
        let indH = 0;
        let indV = 0;
        let distH = getDistance({x: 0, y: coords[indH].firstPoint.y}, {x: 0, y: furniture[i].firstPoint.y});
        let distV = getDistance({x: coords[indV].firstPoint.x, y: 0}, {x: furniture[i].firstPoint.x, y: 0});
        for (let j = 1; j < coords.length; ++j) {
            if (getDirection(furniture[i]) === 'vertical' && (coords[j].direction === 'North' || coords[j].direction === 'South')  &&
                isNextToItVertically(coords[j], furniture[i]) === true) {
                if (distV > getDistance({x: coords[j].firstPoint.x, y: 0}, {x: furniture[i].firstPoint.x, y: 0})) {
                        indV = j;
                        distV = getDistance({x: coords[j].firstPoint.x, y: 0}, {x: furniture[i].firstPoint.x, y: 0});
                }
            }
            if (getDirection(furniture[i]) === 'horizontal' && (coords[j].direction === 'East' || coords[j].direction === 'West')  &&
                isNextToItHorizontally(coords[j], furniture[i]) === true ) {
                if (distH > getDistance({x: 0, y: coords[j].firstPoint.y}, {x: 0, y: furniture[i].firstPoint.y})) {
                        indH = j;
                        distH = getDistance({x: 0, y: coords[j].firstPoint.y}, {x: 0, y: furniture[i].firstPoint.y});
                        
                }
            }
        }
        if (getDirection(furniture[i]) === 'vertical') {
            nearest_wall_vertical.push({wall_index: indV, furniture_index: i, dist: distV, firstPoint: {x: -1, y: -1}, secondPoint: {x: -1, y: -1}});
        } else {
            nearest_wall_horizontal.push({wall_index: indH, furniture_index: i, dist: distH, firstPoint: {x: -1, y: -1}, secondPoint: {x: -1, y: -1}});
        }
    }

    let nwh = nearest_wall_horizontal[0];
    for (let i = 1; i < nearest_wall_horizontal.length; ++i) {
        if (nwh.dist > nearest_wall_horizontal[i].dist) {
            nwh = nearest_wall_horizontal[i];
        }
    }

    let nwv = nearest_wall_vertical[0];
    for (let i = 1; i < nearest_wall_vertical.length; ++i) {
        if (nwv.dist > nearest_wall_vertical[i].dist) {
            nwv = nearest_wall_vertical[i];
        }
    }

    return {horizontal: nwh, vertical: nwv};
}

/* megnézi teljese terjerdelmében mellette van e egy függőleges fal */
function isNextToItVertically(room_wall, furniture_wall) {
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
function isNextToItHorizontally(room_wall, furniture_wall) {
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
function inRoom(objCoords) {
    let b = true;

    objCoords.forEach(objCoord => {
        let topLeft = false, bottomLeft = false, topRigth = false, bottomRight = false;
        coords.forEach(coord => {
            let mincoordX = coord.firstPoint.x < coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
            let maxcoordX = coord.firstPoint.x > coord.secondPoint.x ? coord.firstPoint.x : coord.secondPoint.x;
            let mincoordY = coord.firstPoint.y < coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
            let maxcoordY = coord.firstPoint.y > coord.secondPoint.y ? coord.firstPoint.y : coord.secondPoint.y;
            /* bal felso pontja */
            if (objCoord.firstPoint.x > mincoordX && objCoord.firstPoint.y > mincoordY &&
                objCoord.secondPoint.x > mincoordX && objCoord.secondPoint.y > mincoordY) {
                    topLeft = true;
            }
            /* bal also pontja */
            if (objCoord.firstPoint.x > mincoordX && objCoord.firstPoint.y < maxcoordY &&
                objCoord.secondPoint.x > mincoordX && objCoord.secondPoint.y < maxcoordY) {
                    bottomLeft = true;
            }
            /* jobb felso pontja */
            if (objCoord.firstPoint.x < maxcoordX && objCoord.firstPoint.y > mincoordY &&
                objCoord.secondPoint.x < maxcoordX && objCoord.secondPoint.y > mincoordY) {
                    topRigth = true;
            }
            /* jobb also pontja */
            if (objCoord.firstPoint.x < maxcoordX && objCoord.firstPoint.y < maxcoordY &&
                objCoord.secondPoint.x < maxcoordX && objCoord.secondPoint.y < maxcoordY) {
                    bottomRight = true;
            }
        });
        if (bottomLeft === false || bottomRight === false|| topLeft === false || topRigth === false) {
            b = false;
        }
    });

    return b;
}

/* felhelezett berendezéseket kiegyenesíti */
function squareFurniture() {
    if (inRoom(furniture)) {
        if (furniture.length < 4) return;

        let direction;
        if (Math.abs(furniture[0].firstPoint.x - furniture[0].secondPoint.x) >
            Math.abs(furniture[0].firstPoint.y - furniture[0].secondPoint.y)) {
            direction = 'horizontal';
            furniture[0].secondPoint.y = furniture[0].firstPoint.y;
        } else {
            direction = 'vertical';
            furniture[0].secondPoint.x = furniture[0].firstPoint.x;
        }

        for (let i = 1; i < furniture.length; ++i) {
            if (direction === 'horizontal') {
                furniture[i].firstPoint = furniture[i - 1].secondPoint;
                furniture[i].secondPoint.x = furniture[i].firstPoint.x;
                direction = 'vertical';
            } else {
                furniture[i].firstPoint = furniture[i - 1].secondPoint;
                furniture[i].secondPoint.y = furniture[i].firstPoint.y;
                direction = 'horizontal';
            }
        }

        if (direction === 'horizontal') {
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
}

/* scale_permanent -> in mapMaker.js */
/* Arányosan felrajzolja a berendezéseket */
function scaleFurnitures() {

    for (let i = 0; i < furnitures.length; ++i) {

        let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
        furnitures[i].data.forEach(f => {
            switch (f.direction) {
                case 'North':
                    n += parseInt(f.size);
                    break;
                case 'East':
                    e += parseInt(f.size);
                    break;
                case 'South':
                    s += parseInt(f.size);
                    break;
                case 'West':
                    w += parseInt(f.size);
                    break;
            }
        });

        const lor = leftOrRight(furnitures[i].distance_from_walls.vertical);
        const vind = furnitures[i].distance_from_walls.vertical.furniture_index;

        if (lor === 'left') {
            switch (furnitures[i].data[vind].direction) {
                case 'North':
                    furnitures[i].data[vind].firstPoint.x = furnitures[i].distance_from_walls.vertical.secondPoint.x + scale_permanent * furnitures[i].distance_from_walls.vertical.dist;
                    furnitures[i].data[vind].firstPoint.y = n * scale_permanent;
                    furnitures[i].data[vind].secondPoint.x = furnitures[i].data[vind].firstPoint.x;
                    furnitures[i].data[vind].secondPoint.y = furnitures[i].data[vind].firstPoint.y - scale_permanent * furnitures[i].data[vind].size;
                    break; 
                case 'South':
                    furnitures[i].data[vind].firstPoint.x = furnitures[i].distance_from_walls.vertical.secondPoint.x + scale_permanent * furnitures[i].distance_from_walls.vertical.dist;
                    furnitures[i].data[vind].firstPoint.y = 0;
                    furnitures[i].data[vind].secondPoint.x = furnitures[i].data[vind].firstPoint.x;
                    furnitures[i].data[vind].secondPoint.y = furnitures[i].data[vind].firstPoint.y + scale_permanent * furnitures[i].data[vind].size;
                    break;
            }
        }
        if (lor === 'right') {
            switch (furnitures[i].data[vind].direction) {
                case 'North':
                    furnitures[i].data[vind].firstPoint.x = furnitures[i].distance_from_walls.vertical.secondPoint.x - scale_permanent * furnitures[i].distance_from_walls.vertical.dist;
                    furnitures[i].data[vind].firstPoint.y = n * scale_permanent;
                    furnitures[i].data[vind].secondPoint.x = furnitures[i].data[vind].firstPoint.x;
                    furnitures[i].data[vind].secondPoint.y = furnitures[i].data[vind].firstPoint.y - scale_permanent * furnitures[i].data[vind].size;
                    break; 
                case 'South':
                    furnitures[i].data[vind].firstPoint.x = furnitures[i].distance_from_walls.vertical.secondPoint.x - scale_permanent * furnitures[i].distance_from_walls.vertical.dist;
                    furnitures[i].data[vind].firstPoint.y = 0;
                    furnitures[i].data[vind].secondPoint.x = furnitures[i].data[vind].firstPoint.x;
                    furnitures[i].data[vind].secondPoint.y = furnitures[i].data[vind].firstPoint.y + scale_permanent * furnitures[i].data[vind].size;
                    break;
            }
        }

       for (let j = vind + 1; j < furnitures[i].data.length; ++j) {
            if (furnitures[i].data[j].direction === 'North') {
                furnitures[i].data[j].firstPoint = furnitures[i].data[j - 1].secondPoint;
                furnitures[i].data[j].secondPoint.x = furnitures[i].data[j].firstPoint.x
                furnitures[i].data[j].secondPoint.y = furnitures[i].data[j].firstPoint.y - scale_permanent * furnitures[i].data[j].size;
            } else if (furnitures[i].data[j].direction === 'South') {
                furnitures[i].data[j].firstPoint = furnitures[i].data[j - 1].secondPoint;
                furnitures[i].data[j].secondPoint.x = furnitures[i].data[j].firstPoint.x;
                furnitures[i].data[j].secondPoint.y = furnitures[i].data[j].firstPoint.y + scale_permanent * furnitures[i].data[j].size;
            } else if (furnitures[i].data[j].direction === 'East') {
                furnitures[i].data[j].firstPoint = furnitures[i].data[j - 1].secondPoint;
                furnitures[i].data[j].secondPoint.x = furnitures[i].data[j].firstPoint.x + scale_permanent * furnitures[i].data[j].size;
                furnitures[i].data[j].secondPoint.y = furnitures[i].data[j].firstPoint.y;
            } else if (furnitures[i].data[j].direction === 'West') {
                furnitures[i].data[j].firstPoint = furnitures[i].data[j - 1].secondPoint;
                furnitures[i].data[j].secondPoint.x = furnitures[i].data[j].firstPoint.x - scale_permanent * furnitures[i].data[j].size;
                furnitures[i].data[j].secondPoint.y = furnitures[i].data[j].firstPoint.y;
            }
        }
        for (let j = vind - 1; j >= 0; --j) {
            if (furnitures[i].data[j].direction === 'North') {
                furnitures[i].data[j].secondPoint = furnitures[i].data[j + 1].firstPoint;
                furnitures[i].data[j].firstPoint.x = furnitures[i].data[j].secondPoint.x
                furnitures[i].data[j].firstPoint.y = furnitures[i].data[j].secondPoint.y + scale_permanent * furnitures[i].data[j].size;
            } else if (furnitures[i].data[j].direction === 'South') {
                furnitures[i].data[j].secondPoint = furnitures[i].data[j + 1].firstPoint;
                furnitures[i].data[j].firstPoint.x = furnitures[i].data[j].secondPoint.x;
                furnitures[i].data[j].firstPoint.y = furnitures[i].data[j].secondPoint.y - scale_permanent * furnitures[i].data[j].size;
            } else if (furnitures[i].data[j].direction === 'East') {
                furnitures[i].data[j].secondPoint = furnitures[i].data[j + 1].firstPoint;
                furnitures[i].data[j].firstPoint.x = furnitures[i].data[j].secondPoint.x - scale_permanent * furnitures[i].data[j].size;
                furnitures[i].data[j].firstPoint.y = furnitures[i].data[j].secondPoint.y;
            } else if (furnitures[i].data[j].direction === 'West') {
                furnitures[i].data[j].secondPoint = furnitures[i].data[j + 1].firstPoint;
                furnitures[i].data[j].firstPoint.x = furnitures[i].data[j].secondPoint.x + scale_permanent * furnitures[i].data[j].size;
                furnitures[i].data[j].firstPoint.y = furnitures[i].data[j].secondPoint.y;
            }
        }
        furnitures[i].data[furnitures[i].data.length - 1].secondPoint = furnitures[i].data[0].firstPoint;

        const tob = topOrBottom(furnitures[i].distance_from_walls.horizontal);
        const hind = furnitures[i].distance_from_walls.horizontal.furniture_index;
        if (tob === 'top') {
            const topY = furnitures[i].distance_from_walls.horizontal.secondPoint.y + scale_permanent * furnitures[i].distance_from_walls.horizontal.dist;
            for (let j = 0; j < furnitures[i].data.length; ++j) {
                furnitures[i].data[j].firstPoint.y += topY;
                //furnitures[i].data[j].secondPoint.y = furnitures[i].data[vind].secondPoint.y + topY; //??????????? miért csinálja meg e nélkül ????? TODO
            }
        }
        if (tob == 'bottom') {
            const topY = furnitures[i].distance_from_walls.horizontal.secondPoint.y - scale_permanent * furnitures[i].distance_from_walls.horizontal.dist - n * scale_permanent;
            for (let j = 0; j < furnitures[i].data.length; ++j) {
                furnitures[i].data[j].firstPoint.y += topY;
                //furnitures[i].data[vind].secondPoint.y = furnitures[i].data[vind].secondPoint.y + topY; ??????????? miért csinálja meg e nélkül ????? TODO
            }
        }

        /* elválasztások a polcokon */
        if (w > n) {
            furnitures[i].products = divideIntoPieces(furnitures[i], w);
            let separations = [];
            let startPoint = topLeftCoordOfFurniture(furnitures[i]);
            let fp = {x: startPoint.x, y: startPoint.y};
            let sp = {x: startPoint.x, y: startPoint.y + n * scale_permanent};
            let infostartpoint = {firstPoint: fp, secondPoint: sp};
            for (let k = 0; k < furnitures[i].products.length; ++k) {
                fp = {x: startPoint.x + (k + 1) * scale_permanent, y: startPoint.y};
                sp = {x: startPoint.x + (k + 1) * scale_permanent, y: startPoint.y + n * scale_permanent};
                separations.push({firstPoint: fp, secondPoint: sp});
            }
            fp = {x: startPoint.x + (furnitures[i].products.length + 1) * scale_permanent, y: startPoint.y};
            sp = {x: startPoint.x + (furnitures[i].products.length + 1) * scale_permanent, y: startPoint.y + n * scale_permanent};
            let infoendpoint = {firstPoint: fp, secondPoint: sp};
            furnitures[i].info = {direction: 'horizontal', start: infostartpoint, end: infoendpoint}
            furnitures[i].separators = separations;
        } else {    
            furnitures[i].products = divideIntoPieces(furnitures[i], n);
            let separations = [];
            let startPoint = topLeftCoordOfFurniture(furnitures[i]);
            let fp = {x: startPoint.x, y: startPoint.y};
            let sp = {x: startPoint.x + w * scale_permanent, y: startPoint.y};
            let infostartpoint = {firstPoint: fp, secondPoint: sp};
            for (let k = 0; k < furnitures[i].products.length; ++k) {
                fp = {x: startPoint.x, y: startPoint.y + (k + 1) * scale_permanent};
                sp = {x: startPoint.x + w * scale_permanent, y: startPoint.y + (k + 1) * scale_permanent};

                separations.push({firstPoint: fp, secondPoint: sp});
            }
            fp = {x: startPoint.x, y: startPoint.y + (furnitures[i].products.length + 1) * scale_permanent};
            sp = {x: startPoint.x + w * scale_permanent, y: startPoint.y + (furnitures[i].products.length + 1) * scale_permanent};
            let infoendpoint = {firstPoint: fp, secondPoint: sp};
            furnitures[i].info = {direction: 'vertical', start: infostartpoint, end: infoendpoint}
            furnitures[i].separators = separations;
        }
    }
}

function topLeftCoordOfFurniture(furniture) {
    let mostLeft = furniture.data[0].firstPoint.x < furniture.data[0].secondPoint.x ? furniture.data[0].firstPoint.x : furniture.data[0].secondPoint.x;
    for (let i = 1; i < furniture.data.length; ++i) {
        if (furniture.data[i].firstPoint.x < mostLeft) {
            mostLeft = furniture.data[i].firstPoint.x;
        }
        if (furniture.data[i].secondPoint.x < mostLeft) {
            mostLeft = furniture.data[i].secondPoint.x;
        }
    }
    let mostTop = furniture.data[0].firstPoint.y < furniture.data[0].secondPoint.y ? furniture.data[0].firstPoint.y : furniture.data[0].secondPoint.y;
    for (let i = 1; i < furniture.data.length; ++i) {
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

    for (let i = 0; i < size - 1; ++i) {
        productPlaces.push({stuffHere: []});
    }

    return productPlaces;
}
