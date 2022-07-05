class Furniture {

    constructor(name, data, info, distance_from_walls) {
        this.name = name;
        this.data = data;
        this.products = []
        this.separators = [];
        this.info = info;
        this.distance_from_walls = distance_from_walls;
        this.scaled = false;
    }

    getName() { return this.name; }
    getData() { return this.data; }
    getProducts() { return this.products; }
    getSeparators() { return this.separators; }
    getInfo() { return this.info; }
    getDistanceFromWalls() { return this.distance_from_walls; }
    
    setName(name) { this.name = name; }
    setDistanceFromWalls(distance_from_walls) { this.distance_from_walls = distance_from_walls; }
    addProduct(product) { this.products.push(product); }
    addSeparator(separator) { this.separators.push(separator); }

    takeApart(drawingcoords) {
        if (drawingcoords.length <= 10) return;
        
        let breakPoints = [];
        let direction;
        if (Math.abs(drawingcoords[0].x - drawingcoords[10].x) >
            Math.abs(drawingcoords[0].y - drawingcoords[10].y)) {
                direction = Direction.horizontal.get();
        } else {
            direction = Direction.vertical.get();
        }

        for (let i = 10; i < drawingcoords.length - 11; i += 10) {
            if (Math.abs(drawingcoords[i].x - drawingcoords[i + 10].x) >
                Math.abs(drawingcoords[i].y - drawingcoords[i + 10].y)) {
                    if (direction === Direction.vertical.get()) {
                        breakPoints.push(new Point(drawingcoords[i].x, drawingcoords[i].y));
                    }
                direction = Direction.horizontal.get();
            } else {
                if (direction === Direction.horizontal.get()) {
                    breakPoints.push(new Point(drawingcoords[i].x,drawingcoords[i].y))
                }
                direction = Direction.vertical.get();
            }
        }

        if (breakPoints.length < 1) return;

        
        this.data.splice(-1,1);
        this.data.push(new Wall(new Point(drawingcoords[0].x, drawingcoords[0].y), new Point(breakPoints[0].x, breakPoints[0].y), 0, Direction.undefinedDirection));
        for (let i = 0; i < breakPoints.length - 1; ++i) {
            this.data.push(new Wall(new Point(breakPoints[i].x, breakPoints[i].y), new Point(breakPoints[i + 1].x, breakPoints[i + 1].y),  0, Direction.undefinedDirection));
        }
        this.data.push(new Wall(new Point(breakPoints[breakPoints.length - 1].x, breakPoints[breakPoints.length - 1].y), new Point(drawingcoords[drawingcoords.length - 1].x, drawingcoords[drawingcoords.length - 1].y), 0, Direction.undefinedDirection));
        return this.data;
        
    }

    /* felhelezett berendezést kiegyenesíti */
    squareFurniture(roomWalls) {
        if (this.inRoom(this.data, roomWalls)) {
            if (this.data.length < 4) return;

            let direction;
            if (Math.abs(this.data[0].firstPoint.x - this.data[0].secondPoint.x) >
                Math.abs(this.data[0].firstPoint.y - this.data[0].secondPoint.y)) {
                direction = Direction.horizontal.get();
                this.data[0].secondPoint.y = this.data[0].firstPoint.y;
            } else {
                direction = Direction.vertical.get();
                this.data[0].secondPoint.x = this.data[0].firstPoint.x;
            }

            for (let i = 1; i < this.data.length; ++i) {
                if (direction === Direction.horizontal.get()) {
                    this.data[i].firstPoint = this.data[i - 1].secondPoint;
                    this.data[i].secondPoint.x = this.data[i].firstPoint.x;
                    direction = Direction.vertical.get();
                } else {
                    this.data[i].firstPoint = this.data[i - 1].secondPoint;
                    this.data[i].secondPoint.y = this.data[i].firstPoint.y;
                    direction = Direction.horizontal.get();
                }
            }

            if (direction === Direction.horizontal.get()) {
                this.data[this.data.length - 1].secondPoint.x = this.data[0].firstPoint.x;
                this.data[0].firstPoint.y = this.data[this.data.length - 1].secondPoint.y;
            } else {
                this.data[this.data.length - 1].secondPoint.y = this.data[0].firstPoint.y;
                this.data[0].firstPoint.x = this.data[this.data.length - 1].secondPoint.x;
            }
        } else {
            this.data = [];
        }

        return this.data;
    }

    inRoom(objcoords, roomWalls) {
        let b = true;

        objcoords.forEach(objCoord => {
            let topLeft = false, bottomLeft = false, topRigth = false, bottomRight = false;
            roomWalls.forEach(coord => {
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

    /* Arányosan átméretezi a berendezést */
    scaleFurniture(scale, walls) {
        if (!this.scaled) {
            let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
            this.data.forEach(f => {
                switch (f.direction) {
                    case Direction.North.get():
                        n += parseFloat(f.size);
                        break;
                    case Direction.East.get():
                        e += parseFloat(f.size);
                        break;
                    case Direction.South.get():
                        s += parseFloat(f.size);
                        break;
                    case Direction.West.get():
                        w += parseFloat(f.size);
                        break;
                }
            });

            let roomNorthSizes = 0;
            let roomSouthSizes = 0;
            let roomEastSizes = 0;
            let roomWestSizes = 0;
            for (let i = 0; i < walls.length; ++i) {
                if (walls[i].direction == Direction.North.get()) {
                    roomNorthSizes += walls[i].size;
                } else if (walls[i].direction == Direction.South.get()) {
                    roomSouthSizes += walls[i].size;
                } else if (walls[i].direction == Direction.East.get()) {
                    roomEastSizes += walls[i].size;
                } else if (walls[i].direction == Direction.West.get()) {
                    roomWestSizes += walls[i].size;
                }
            }

            if (n === 0 || s === 0 || e === 0 || w === 0) {
                alert("Legalább egy méret nem lett megadva!");
                return false;
            }

            if (e != w || n != s) {
                alert('Hibás méretek!');
                return false;
            }

            if (roomNorthSizes < n || roomEastSizes < e) {
                alert('A berendezés méretei nem lehetnek nagyobbak a szoba méreteinél!');
                return false;
            } else {
                if (roomNorthSizes < (parseInt(this.distance_from_walls.horizontal.dist) + n) || roomEastSizes < (parseInt(this.distance_from_walls.vertical.dist) + e)) {
                    alert('A berendezés nem lóghat ki a szobából!');
                    return false;
                }
            }

            const lor = this.leftOrRight(this.distance_from_walls.vertical);
            const vind = this.distance_from_walls.vertical.furniture_index;

            if (lor === 'left') {
                switch (this.data[vind].direction) {
                    case Direction.North.get():
                        this.data[vind].firstPoint.x = this.distance_from_walls.vertical.secondPoint.x + scale * this.distance_from_walls.vertical.dist;
                        this.data[vind].firstPoint.y = n * scale;
                        this.data[vind].secondPoint.x = this.data[vind].firstPoint.x;
                        this.data[vind].secondPoint.y = this.data[vind].firstPoint.y - scale * this.data[vind].size;
                        break; 
                    case Direction.South.get():
                        this.data[vind].firstPoint.x = this.distance_from_walls.vertical.secondPoint.x + scale * this.distance_from_walls.vertical.dist;
                        this.data[vind].firstPoint.y = 0;
                        this.data[vind].secondPoint.x = this.data[vind].firstPoint.x;
                        this.data[vind].secondPoint.y = this.data[vind].firstPoint.y + scale * this.data[vind].size;
                        break;
                }
            }
            if (lor === 'right') {
                switch (this.data[vind].direction) {
                    case Direction.North.get():
                        this.data[vind].firstPoint.x = this.distance_from_walls.vertical.secondPoint.x - scale * this.distance_from_walls.vertical.dist;
                        this.data[vind].firstPoint.y = n * scale;
                        this.data[vind].secondPoint.x = this.data[vind].firstPoint.x;
                        this.data[vind].secondPoint.y = this.data[vind].firstPoint.y - scale * this.data[vind].size;
                        break; 
                    case Direction.South.get():
                        this.data[vind].firstPoint.x = this.distance_from_walls.vertical.secondPoint.x - scale * this.distance_from_walls.vertical.dist;
                        this.data[vind].firstPoint.y = 0;
                        this.data[vind].secondPoint.x = this.data[vind].firstPoint.x;
                        this.data[vind].secondPoint.y = this.data[vind].firstPoint.y + scale * this.data[vind].size;
                        break;
                }
            }

         for (let j = vind + 1; j < this.data.length; ++j) {
                if (this.data[j].direction === Direction.North.get()) {
                    this.data[j].firstPoint = this.data[j - 1].secondPoint;
                    this.data[j].secondPoint.x = this.data[j].firstPoint.x
                    this.data[j].secondPoint.y = this.data[j].firstPoint.y - scale * this.data[j].size;
                } else if (this.data[j].direction === Direction.South.get()) {
                    this.data[j].firstPoint = this.data[j - 1].secondPoint;
                    this.data[j].secondPoint.x = this.data[j].firstPoint.x;
                    this.data[j].secondPoint.y = this.data[j].firstPoint.y + scale * this.data[j].size;
                } else if (this.data[j].direction === Direction.East.get()) {
                    this.data[j].firstPoint = this.data[j - 1].secondPoint;
                    this.data[j].secondPoint.x = this.data[j].firstPoint.x + scale * this.data[j].size;
                    this.data[j].secondPoint.y = this.data[j].firstPoint.y;
                } else if (this.data[j].direction === Direction.West.get()) {
                    this.data[j].firstPoint = this.data[j - 1].secondPoint;
                    this.data[j].secondPoint.x = this.data[j].firstPoint.x - scale * this.data[j].size;
                    this.data[j].secondPoint.y = this.data[j].firstPoint.y;
                }
            }
            for (let j = vind - 1; j >= 0; --j) {
                if (this.data[j].direction === Direction.North.get()) {
                    this.data[j].secondPoint = this.data[j + 1].firstPoint;
                    this.data[j].firstPoint.x = this.data[j].secondPoint.x
                    this.data[j].firstPoint.y = this.data[j].secondPoint.y + scale * this.data[j].size;
                } else if (this.data[j].direction === Direction.South.get()) {
                    this.data[j].secondPoint = this.data[j + 1].firstPoint;
                    this.data[j].firstPoint.x = this.data[j].secondPoint.x;
                    this.data[j].firstPoint.y = this.data[j].secondPoint.y - scale * this.data[j].size;
                } else if (this.data[j].direction === Direction.East.get()) {
                    this.data[j].secondPoint = this.data[j + 1].firstPoint;
                    this.data[j].firstPoint.x = this.data[j].secondPoint.x - scale * this.data[j].size;
                    this.data[j].firstPoint.y = this.data[j].secondPoint.y;
                } else if (this.data[j].direction === Direction.West.get()) {
                    this.data[j].secondPoint = this.data[j + 1].firstPoint;
                    this.data[j].firstPoint.x = this.data[j].secondPoint.x + scale * this.data[j].size;
                    this.data[j].firstPoint.y = this.data[j].secondPoint.y;
                }
            }
            this.data[this.data.length - 1].secondPoint = this.data[0].firstPoint;

            const tob = this.topOrBottom(this.distance_from_walls.horizontal);
            const hind = this.distance_from_walls.horizontal.furniture_index;
            if (tob === 'top') {
                const topY = this.distance_from_walls.horizontal.secondPoint.y + scale * this.distance_from_walls.horizontal.dist;
                for (let j = 0; j < this.data.length; ++j) {
                    this.data[j].firstPoint.y += topY;
                }
            }
            if (tob == 'bottom') {
                const topY = this.distance_from_walls.horizontal.secondPoint.y - scale * this.distance_from_walls.horizontal.dist - n * scale;
                for (let j = 0; j < this.data.length; ++j) {
                    this.data[j].firstPoint.y += topY;
                }
            }

            /* elválasztások a polcokon */
            if (w > n) {
                this.products = this.divideIntoPieces(w);
                let separations = [];
                let startPoint = this.topLeftCoordOfFurniture();
                let fp = new Point(startPoint.x, startPoint.y);
                let sp = new Point(startPoint.x, startPoint.y);
                let infostartpoint = {firstPoint: fp, secondPoint: sp};
                for (let k = 0; k < this.products.length; ++k) {
                    fp = new Point(startPoint.x + (k + 1) * scale, startPoint.y);
                    sp = new Point(startPoint.x + (k + 1) * scale, startPoint.y + n * scale);
                    separations.push( {firstPoint: fp, secondPoint: sp} );
                }
                fp = new Point(startPoint.x + (this.products.length + 1) * scale, startPoint.y);
                sp = new Point(startPoint.x + (this.products.length + 1) * scale, startPoint.y + n * scale);
                let infoendpoint = {firstPoint: fp, secondPoint: sp};
                this.info = {direction: Direction.horizontal.get(), start: infostartpoint, end: infoendpoint}
                this.separators = separations;
            } else {
                this.products = this.divideIntoPieces(n);
                let separations = [];
                let startPoint = this.topLeftCoordOfFurniture();
                let fp = new Point(startPoint.x, startPoint.y);
                let sp = new Point(startPoint.x + w * scale, startPoint.y);
                let infostartpoint = {firstPoint: fp, secondPoint: sp};
                for (let k = 0; k < this.products.length; ++k) {
                    fp = new Point(startPoint.x, startPoint.y + (k + 1) * scale);
                    sp = new Point(startPoint.x + w * scale, startPoint.y + (k + 1) * scale); 

                    separations.push( {firstPoint: fp, secondPoint: sp} );
                }
                fp = new Point(startPoint.x, startPoint.y + (this.products.length + 1) * scale); 
                sp = new Point(startPoint.x + w * scale, startPoint.y + (this.products.length + 1) * scale); 
                let infoendpoint = {firstPoint: fp, secondPoint: sp};
                this.info = {direction: Direction.vertical.get(), start: infostartpoint, end: infoendpoint}
                this.separators = separations;
            }
            this.scaled = true;
        }
        return true;
    }

    /* bal vagy jobb oldalon van e a legközelebbi fal */
    leftOrRight(coord) {
        return coord.firstPoint.x > coord.secondPoint.x ? 'left' : 'right';
    }

    /* felső vagy alsó oldalon van e a legközelebbi fal */
    topOrBottom(coord) {
        return coord.firstPoint.y > coord.secondPoint.y ? 'top' : 'bottom';
    }

    divideIntoPieces(size) {
        let productPlaces = [];

        for (let i = 0; i < size - 1; ++i) {
            productPlaces.push({stuffHere: []});
        }

        productPlaces.push({stuffHere: []});

        return productPlaces;
    }

    topLeftCoordOfFurniture() {
        let mostLeft = this.data[0].firstPoint.x < this.data[0].secondPoint.x ? this.data[0].firstPoint.x : this.data[0].secondPoint.x;
        for (let i = 1; i < this.data.length; ++i) {
            if (this.data[i].firstPoint.x < mostLeft) {
                mostLeft = this.data[i].firstPoint.x;
            }
            if (this.data[i].secondPoint.x < mostLeft) {
                mostLeft = this.data[i].secondPoint.x;
            }
        }
        let mostTop = this.data[0].firstPoint.y < this.data[0].secondPoint.y ? this.data[0].firstPoint.y : this.data[0].secondPoint.y;
        for (let i = 1; i < this.data.length; ++i) {
            if (this.data[i].firstPoint.y < mostLeft) {
                mostTop = this.data[i].firstPoint.y;
            }
            if (this.data[i].secondPoint.y < mostLeft) {
                mostTop = this.data[i].secondPoint.y;
            }
        }
        return new Point(mostLeft, mostTop);//{x: mostLeft, y: mostTop};
    }

    /* Ablakhoz igazítja a berendezéseket */
    reSizeFurniture(roomWalls, scale) {
            let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
            this.data.forEach(f => {
                switch (f.direction) {
                    case 'North':
                        n += parseFloat(f.size);
                        break;
                    case 'East':
                        e += parseFloat(f.size);
                        break;
                    case 'South':
                        s += parseFloat(f.size);
                        break;
                    case 'West':
                        w += parseFloat(f.size);
                        break;
                }
            });
    
            const lor = this.leftOrRight(this.distance_from_walls.vertical);
            const vind = this.distance_from_walls.vertical.furniture_index;
    
            if (lor === 'left') {
                switch (this.data[vind].direction) {
                    case 'North':
                        this.data[vind].firstPoint.x = roomWalls[this.distance_from_walls.vertical.wall_index].secondPoint.x + scale * this.distance_from_walls.vertical.dist;
                        this.data[vind].firstPoint.y = n * scale;
                        this.data[vind].secondPoint.x = this.data[vind].firstPoint.x;
                        this.data[vind].secondPoint.y = this.data[vind].firstPoint.y - scale * this.data[vind].size;
                        break; 
                    case 'South':
                        this.data[vind].firstPoint.x = roomWalls[this.distance_from_walls.vertical.wall_index].secondPoint.x + scale * this.distance_from_walls.vertical.dist;
                        this.data[vind].firstPoint.y = 0;
                        this.data[vind].secondPoint.x = this.data[vind].firstPoint.x;
                        this.data[vind].secondPoint.y = this.data[vind].firstPoint.y + scale * this.data[vind].size;
                        break;
                }
            } else if (lor === 'right') {
                switch (this.data[vind].direction) {
                    case 'North':
                        this.data[vind].firstPoint.x = roomWalls[this.distance_from_walls.vertical.wall_index].secondPoint.x - scale * this.distance_from_walls.vertical.dist;
                        this.data[vind].firstPoint.y = n * scale;
                        this.data[vind].secondPoint.x = this.data[vind].firstPoint.x;
                        this.data[vind].secondPoint.y = this.data[vind].firstPoint.y - scale * this.data[vind].size;
                        break; 
                    case 'South':
                        this.data[vind].firstPoint.x = roomWalls[this.distance_from_walls.vertical.wall_index].secondPoint.x - scale * this.distance_from_walls.vertical.dist;
                        this.data[vind].firstPoint.y = 0;
                        this.data[vind].secondPoint.x = this.data[vind].firstPoint.x;
                        this.data[vind].secondPoint.y = this.data[vind].firstPoint.y + scale * this.data[vind].size;
                        break;
                }
            }
    
           for (let j = vind + 1; j < this.data.length; ++j) {
                if (this.data[j].direction === 'North') {
                    this.data[j].firstPoint = this.data[j - 1].secondPoint;
                    this.data[j].secondPoint.x = this.data[j].firstPoint.x
                    this.data[j].secondPoint.y = this.data[j].firstPoint.y - scale * this.data[j].size;
                } else if (this.data[j].direction === 'South') {
                    this.data[j].firstPoint = this.data[j - 1].secondPoint;
                    this.data[j].secondPoint.x = this.data[j].firstPoint.x;
                    this.data[j].secondPoint.y = this.data[j].firstPoint.y + scale * this.data[j].size;
                } else if (this.data[j].direction === 'East') {
                    this.data[j].firstPoint = this.data[j - 1].secondPoint;
                    this.data[j].secondPoint.x = this.data[j].firstPoint.x + scale * this.data[j].size;
                    this.data[j].secondPoint.y = this.data[j].firstPoint.y;
                } else if (this.data[j].direction === 'West') {
                    this.data[j].firstPoint = this.data[j - 1].secondPoint;
                    this.data[j].secondPoint.x = this.data[j].firstPoint.x - scale * this.data[j].size;
                    this.data[j].secondPoint.y = this.data[j].firstPoint.y;
                }
            }
            for (let j = vind - 1; j >= 0; --j) {
                if (this.data[j].direction === 'North') {
                    this.data[j].secondPoint = this.data[j + 1].firstPoint;
                    this.data[j].firstPoint.x = this.data[j].secondPoint.x
                    this.data[j].firstPoint.y = this.data[j].secondPoint.y + scale * this.data[j].size;
                } else if (this.data[j].direction === 'South') {
                    this.data[j].secondPoint = this.data[j + 1].firstPoint;
                    this.data[j].firstPoint.x = this.data[j].secondPoint.x;
                    this.data[j].firstPoint.y = this.data[j].secondPoint.y - scale * this.data[j].size;
                } else if (this.data[j].direction === 'East') {
                    this.data[j].secondPoint = this.data[j + 1].firstPoint;
                    this.data[j].firstPoint.x = this.data[j].secondPoint.x - scale * this.data[j].size;
                    this.data[j].firstPoint.y = this.data[j].secondPoint.y;
                } else if (this.data[j].direction === 'West') {
                    this.data[j].secondPoint = this.data[j + 1].firstPoint;
                    this.data[j].firstPoint.x = this.data[j].secondPoint.x + scale * this.data[j].size;
                    this.data[j].firstPoint.y = this.data[j].secondPoint.y;
                }
            }
            this.data[this.data.length - 1].secondPoint = this.data[0].firstPoint;
    
            const tob = this.topOrBottom(this.distance_from_walls.horizontal);
            const hind = this.distance_from_walls.horizontal.furniture_index;
            if (tob === 'top') {
                const topY = roomWalls[this.distance_from_walls.horizontal.wall_index].secondPoint.y + scale * this.distance_from_walls.horizontal.dist;
    
                for (let j = 0; j < this.data.length; ++j) {
                    this.data[j].firstPoint.y += topY;
                }
            }
            if (tob == 'bottom') {
                const topY = roomWalls[this.distance_from_walls.horizontal.wall_index].secondPoint.y - scale * this.distance_from_walls.horizontal.dist - scale * n;
    
                for (let j = 0; j < this.data.length; ++j) {
                    this.data[j].firstPoint.y += topY;
                }
            }
    
            /* elválasztások a polcokon */
            if (w > n) {
                let separations = [];
                let startPoint = this.topLeftCoordOfFurniture(this);
                let fp = {x: startPoint.x, y: startPoint.y};
                let sp = {x: startPoint.x, y: startPoint.y + n * scale};
                let infostartpoint = {firstPoint: fp, secondPoint: sp};
                for (let k = 0; k < this.products.length; ++k) {
                    fp = {x: startPoint.x + (k + 1) * scale, y: startPoint.y};
                    sp = {x: startPoint.x + (k + 1) * scale, y: startPoint.y + n * scale};
                    separations.push({firstPoint: fp, secondPoint: sp});
                }
                fp = {x: startPoint.x + (this.products.length + 1) * scale, y: startPoint.y};
                sp = {x: startPoint.x + (this.products.length + 1) * scale, y: startPoint.y + n * scale};
                let infoendpoint = {firstPoint: fp, secondPoint: sp};
                this.info = {direction: 'horizontal', start: infostartpoint, end: infoendpoint}
                this.separators = separations;
            } else {
                let separations = [];
                let startPoint = this.topLeftCoordOfFurniture(this);
                let fp = {x: startPoint.x, y: startPoint.y};
                let sp = {x: startPoint.x + w * scale, y: startPoint.y};
                let infostartpoint = {firstPoint: fp, secondPoint: sp};
                for (let k = 0; k < this.products.length; ++k) {
                    fp = {x: startPoint.x, y: startPoint.y + (k + 1) * scale};
                    sp = {x: startPoint.x + w * scale, y: startPoint.y + (k + 1) * scale};
    
                    separations.push({firstPoint: fp, secondPoint: sp});
                }
                fp = {x: startPoint.x, y: startPoint.y + (this.products.length + 1) * scale};
                sp = {x: startPoint.x + w * scale, y: startPoint.y + (this.products.length + 1) * scale};
                let infoendpoint = {firstPoint: fp, secondPoint: sp};
                this.info = {direction: 'vertical', start: infostartpoint, end: infoendpoint}
                this.separators = separations;
            }
        
    }

    setProduct(point) {

        if (this.separators == 0) {
            const obj = [{firstPoint: this.info.start.firstPoint, secondPoint: this.info.start.secondPoint},
                { firstPoint: this.info.end.firstPoint, secondPoint: this.info.end.secondPoint }];
                if (this.inObject(point, obj)) {
                    let name = prompt('Név:');
                    if (name !== null) {
                        this.products[0].stuffHere.push(name);
                    }
                }
            return;
        }
    
        for (let i = 0; i < this.separators.length; ++i) {
            if (i === 0) {
                const obj = [{firstPoint: this.info.start.firstPoint, secondPoint: this.info.start.secondPoint},
                {firstPoint: this.separators[i].firstPoint, secondPoint: this.separators[i].secondPoint}];
                if (this.inObject(point, obj)) {
                    let name = prompt('Név:');
                    if (name !== null) {
                        this.products[i].stuffHere.push(name);
                    }
                }
            } else {
                const obj = [{firstPoint: this.separators[i - 1].firstPoint, secondPoint: this.separators[i - 1].secondPoint},
                {firstPoint: this.separators[i].firstPoint, secondPoint: this.separators[i].secondPoint}];
                if (this.inObject(point, obj)) {
                    let name = prompt('Név:');
                    if (name !== null) {
                        this.products[i].stuffHere.push(name);
                    }
                }
            }
        }
        const obj = [{ firstPoint: this.separators[this.separators.length - 1].firstPoint,
                        secondPoint: this.separators[this.separators.length - 1].secondPoint },
        { firstPoint: this.info.end.firstPoint, secondPoint: this.info.end.secondPoint }];
        if (this.inObject(point, obj)) {
            let name = prompt('Név:');
            if (name !== null) {
                this.products[this.separators.length - 1].stuffHere.push(name);
            }
        }
    }

    inObject(point, objCoord) {

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

    /* Visszaadja, hogy függőleges vagy vízszintes "irányba" mutat a fal vektora */
    getDirection(coord) {
        if (Math.abs(coord.firstPoint.x - coord.secondPoint.x) >
            Math.abs(coord.firstPoint.y - coord.secondPoint.y)) {
            return Direction.horizontal.get();
        } else {
            return Direction.vertical.get();
        }
    }

    #cycle_counter = 0;

    mergeTwoPoints(P1, P2, dir) {

        const minCoordX = Math.min(P1.firstPoint.x, P1.secondPoint.x, P2.firstPoint.x, P2.secondPoint.x);
        const maxCoordX = Math.max(P1.firstPoint.x, P1.secondPoint.x, P2.firstPoint.x, P2.secondPoint.x);
        const minCoordY = Math.min(P1.firstPoint.y, P1.secondPoint.y, P2.firstPoint.y, P2.secondPoint.y);
        const maxCoordY = Math.max(P1.firstPoint.y, P1.secondPoint.y, P2.firstPoint.y, P2.secondPoint.y);
        if (/* this.getDirection(P2) */ dir === Direction.horizontal.get()) {
            let wall = new Wall(new Point(minCoordX, minCoordY), new Point(maxCoordX, minCoordY), 0, Direction.undefinedDirection)
            return wall;
        } else {
            return new Wall(new Point(minCoordX, minCoordY), new Point(minCoordX, maxCoordY), 0, Direction.undefinedDirection);
        }
    }

    searchNextWall() {
        let tmp_walls = [];
        const basic_length = this.data.length;
        tmp_walls.push(new Wall(this.data[0].firstPoint, this.data[0].secondPoint, 0, this.data[0].direction));
        this.data.splice(0, 1);
        while (tmp_walls.length < basic_length) {
            const tmp_befPoint = tmp_walls[tmp_walls.length - 1].secondPoint;
            let tmp_curr = this.data[0];
            let tmp_index = 0;
            
            for (let i = 1; i < this.data.length; ++i) {
    
                let tmp_firstPointDistance = getDistance(tmp_curr.firstPoint, tmp_befPoint);
                let tmp_secondPointDistance = getDistance(tmp_curr.secondPoint, tmp_befPoint);
                const firstPointDistance = getDistance(this.data[i].firstPoint, tmp_befPoint);
                const secondPointDistance = getDistance(this.data[i].secondPoint, tmp_befPoint);
                let minDistance = tmp_firstPointDistance < tmp_secondPointDistance ? tmp_firstPointDistance : tmp_secondPointDistance;
    
                if (firstPointDistance < minDistance || secondPointDistance < minDistance) {
                    tmp_curr = this.data[i];
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
            
            this.data.splice(tmp_index, 1);
        }
        this.data = tmp_walls;

        let vert_ = 0;
        let hori_ = 0;
        for (let i = 0; i < this.data.length; ++i) {
            if (this.getDirection(this.data[i]) === Direction.horizontal.get()) {
                hori_ += 1;
            }
            if (this.getDirection(this.data[i]) === Direction.vertical.get()) {
                vert_ += 1;
            }
        }
        if (vert_ == 0) {
            alert('Nem lehet csak vízszintes oldala!');
            return false;
        }
        if (hori_ == 0) {
            alert('Nem lehet csak függőleges oldala!');
            return false;
        }
        return true;
    }

    mergeSameDirections() {

        let mergedcoords = [];
        let b = false;

        for (let i = 0; i < this.data.length - 1; ++i) {
            let dir = this.getDirection(this.data[i]);
            if (this.getDirection(this.data[i]) === this.getDirection(this.data[i + 1])) {
                mergedcoords.push(this.mergeTwoPoints(this.data[i], this.data[i + 1], dir));
                if ((i + 1) === this.data.length) {
                    b = true;
                }
                this.data.splice((i + 1), 1);
            } else {
                mergedcoords.push(this.data[i]);
            }
        }

        if (this.getDirection(this.data[this.data.length - 1]) === this.getDirection(this.data[0])) {
            let dir = this.getDirection(this.data[0]);
            mergedcoords.push(this.mergeTwoPoints(this.data[this.data.length - 1], this.data[0], dir));
            mergedcoords.splice(0, 1)
        } else {
            if (!b) {
                mergedcoords.push(this.data[this.data.length - 1]);
            } 
        }
        this.data = mergedcoords;
    }

    isAnySameDirection() {
        if (this.#cycle_counter === 100) {
            alert("Váratlan hiba, rajzold újra!");
            this.#cycle_counter = 0;
            return true;
        } else {++this.#cycle_counter;}

        for (let i = 0; i < this.data.length - 1; ++i) {
            if (this.getDirection(this.data[i]) === this.getDirection(this.data[i + 1])) {
                return false;
            }
        }

        if (this.getDirection(this.data[this.data.length - 1]) === this.getDirection(this.data[0])) {
            return false;
        }

        return true;
    }

}
