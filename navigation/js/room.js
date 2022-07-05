class Room {
    
    constructor() {
        this.name = "";
        this.walls = new Array();
        this.beacons = new Array();
        this.furnitures = new Array();
        this.graph = new Graph();
        this.scale = 0;
    }

    setName(name) { this.name = name; }
    addWall(wall) { this.walls.push(wall); }
    addBeacon(beacon) { this.beacons.push(beacon); }
    addFurniture(furniture) { this.furnitures.push(furniture); }

    getName() { return this.name; }
    getWalls() { return this.walls; }
    getBeacons() { return this.beacons; }
    getfurnitures() { return this.furnitures; }

    getWall(index) { return this.walls[index]; }
    getBeacon(index) { return this.beacons[index]; }
    getFurniture(index) { return this.furnitures[index]; }

    scaleFurnitures() {
        let flag = true;
        this.furnitures.forEach( furniture => {
            let b = furniture.scaleFurniture(this.scale, this.walls);
            if (!b) {
                flag = false;
            }
        });
        return flag;
    }
    reSizeFurnitures() { this.furnitures.forEach( furniture => { furniture.reSizeFurniture(this.walls, this.scale); } ); }

    scaleGraph() {
        for (let i = 0; i < this.graph.addition.length; ++i) {
            this.graph.addition[i].coordinate.x = this.walls[plan.graph.addition[i].nearestWall.vw.wallindex].firstPoint.x + this.scale * this.graph.addition[i].nearestWall.vw.distance;
            this.graph.addition[i].coordinate.y = this.walls[plan.graph.addition[i].nearestWall.hw.wallindex].firstPoint.y + this.scale * this.graph.addition[i].nearestWall.hw.distance;
        }
    }

    reSize(cWidth, cHeight) {
        this.scalePlan(cWidth, cHeight);
        this.reSizeFurnitures();
        this.scaleBeacons();
        this.scaleGraph();
    }

    clear() {
        this.name = "";
        this.walls = new Array();
        this.beacons = new Array();
        this.furnitures = new Array();
        this.graph = new Graph();
        this.scale = 0;
        this.#cycle_counter = 0;
    }

    scaleBeacons() {
        this.beacons.forEach(beacon => {
            if (beacon.furnitureOrWall == 'wall') {
                beacon.scale(this.walls, this.scale);
            } else if (beacon.furnitureOrWall == 'furniture') {
                for (let i = 0; i < this.furnitures.length; ++i) {
                    
                    if (beacon.furnitureIndex == i) {
                        beacon.scale(this.furnitures[i].data, this.scale);
                    }
                }
            }
        });
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
                if (point.x >= mincoordX && point.y > mincoordY) {
                        topLeft = true;
                }
                /* bal also pontja */
                if (point.x >= mincoordX && point.y < maxcoordY) {
                        bottomLeft = true;
                }
                /* jobb felso pontja */
                if (point.x <= maxcoordX && point.y > mincoordY) {
                        topRigth = true;
                }
                /* jobb also pontja */
                if (point.x <= maxcoordX && point.y < maxcoordY) {
                        bottomRight = true;
                }
            });
            if (bottomLeft === false || bottomRight === false|| topLeft === false || topRigth === false) {
                b = false;
            }
    
        return b;
    }

    /* felhelyezi az adott indexű falra a "jeladót" vagy jeladóra kattintás esetén meg lehet adni a méretét*/
    setBeacon(index, mousePosition) {
        let size = 0;
        
        for (let i = 0; i < this.beacons.length; ++i) {
            if (mousePosition.x > this.beacons[i].x - 15 && mousePosition.x < this.beacons[i].x + 15
                && mousePosition.y > this.beacons[i].y - 15 && mousePosition.y < this.beacons[i].y + 15
                && this.beacons[i].furnitureOrWall === 'wall' && this.beacons[i].wallIndex === index) {
                size = parseFloat(prompt('Add meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
                if (parseFloat(size) > this.walls[index].size || parseFloat(size < 0)) {
                    alert('Hibás méret!');
                    return;
                }
                /* this.walls[index].size <= 0 */
                /* while (size > this.walls[index].size ||  size < 0) {
                    alert('Hibás méret!');
                    size = parseFloat(prompt('Add meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
                } */
                switch (this.walls[index].direction) {
                    case Direction.North.get():
                        size = this.walls[index].size - size;
                        break;
                    case Direction.West.get():
                        size = this.walls[index].size - size;
                        break;
                }
                this.beacons[i].distance = size;
                return;
            }
        }
        let beaconID = prompt('Add meg a jeladó azonosítóját!');
        this.beacons.push(new Beacon(mousePosition.x, mousePosition.y, 'wall', index, size, beaconID));
        draw();
    }

    /* felhelyezi az adott indexű falra a "jeladót" vagy jeladóra kattintás esetén meg lehet adni a méretét*/
    setBeaconOnFurniture(findex, windex, mousePosition) {
        let distance = 0;
        
        for (let i = 0; i < this.beacons.length; ++i) {
            if (mousePosition.x > this.beacons[i].x - 15 && mousePosition.x < this.beacons[i].x + 15
                && mousePosition.y > this.beacons[i].y - 15 && mousePosition.y < this.beacons[i].y + 15
                && this.beacons[i].furnitureOrWall === 'furniture' && this.beacons[i].furnitureIndex === findex && this.beacons[i].wallIndex === windex) {
                    distance = parseFloat(prompt('Add meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
                if (parseFloat(distance) > this.furnitures[findex].data[windex].size || parseFloat(distance < 0)) {
                    alert('Hibás méret!');
                    return;
                }
                /* this.furnitures[findex].data[windex].size <= 0 */
                /* while (distance > this.furnitures[findex].data[windex].size ||  distance < 0) {
                    alert('Hibás méret!');
                    distance = parseFloat(prompt('Add meg a jeladó távolságát a felső vagy a bal sarokhoz viszonyítva:'));
                } */
                switch (this.furnitures[findex].data[windex].direction) {
                    case Direction.North.get():
                        distance = this.furnitures[findex].data[windex].size - distance;
                        break;
                    case Direction.West.get():
                        distance = this.furnitures[findex].data[windex].size - distance;
                        break;
                }
                this.beacons[i].distance = distance;
                return;
            }
        }

        
        let beaconID = prompt('Add meg a jeladó azonosítóját!');
        if (beaconID === '' || beaconID === undefined) {
            alert('Nem lehet üres!');
            return;
        }
        let newbeacon = new Beacon(mousePosition.x, mousePosition.y, 'furniture', windex, distance, beaconID);
        newbeacon.setFurnitureIndex(findex);
        this.addBeacon(newbeacon);
    }

    /* felhelyezi az berendezest a szobaba */
    placeSomething(furniture) {
        let name_prompt = prompt('Add meg az objektum nevét!');;
        let nearest_walls = this.searchNearestWalls(furniture.data);

        nearest_walls.horizontal.firstPoint = {x: (furniture.data[nearest_walls.horizontal.furniture_index].firstPoint.x + furniture.data[nearest_walls.horizontal.furniture_index].secondPoint.x) / 2, y: furniture.data[nearest_walls.horizontal.furniture_index].firstPoint.y };
        nearest_walls.horizontal.secondPoint = {x: (furniture.data[nearest_walls.horizontal.furniture_index].firstPoint.x + furniture.data[nearest_walls.horizontal.furniture_index].secondPoint.x) / 2, y: this.walls[nearest_walls.horizontal.wall_index].firstPoint.y};
        nearest_walls.horizontal.dist = 0;

        nearest_walls.vertical.firstPoint = {x: furniture.data[nearest_walls.vertical.furniture_index].firstPoint.x, y: (furniture.data[nearest_walls.vertical.furniture_index].firstPoint.y + furniture.data[nearest_walls.vertical.furniture_index].secondPoint.y) / 2};
        nearest_walls.vertical.secondPoint = {x: this.walls[nearest_walls.vertical.wall_index].firstPoint.x, y: (furniture.data[nearest_walls.vertical.furniture_index].firstPoint.y + furniture.data[nearest_walls.vertical.furniture_index].secondPoint.y) / 2};
        nearest_walls.vertical.dist = 0;
        furniture.setName(name_prompt);
        furniture.setDistanceFromWalls(nearest_walls);
        this.addFurniture(furniture);
        //this.addFurniture(new Furniture(name_prompt, furniture, null/* {direction: Direction.undefinedDirection, start: {x: 0, y: 0}, end: {x: 0, y: 0}} */, nearest_walls, false));
    }

    /* falak "szögesítése", kiegyenesítése */
    squaring() {
        if (this.walls.length < 4) return;

        let direction;
        if (Math.abs(this.walls[0].firstPoint.x - this.walls[0].secondPoint.x) >
            Math.abs(this.walls[0].firstPoint.y - this.walls[0].secondPoint.y)) {
            direction = Direction.horizontal.get();
            this.walls[0].secondPoint.y = this.walls[0].firstPoint.y;
        } else {
            direction = Direction.vertical.get();
            this.walls[0].secondPoint.x = this.walls[0].firstPoint.x;
        }

        for (let i = 1; i < this.walls.length; ++i) {
            if (direction === Direction.horizontal.get()) {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.x = this.walls[i].firstPoint.x;
                direction = Direction.vertical.get();
            } else {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.y = this.walls[i].firstPoint.y;
                direction = Direction.horizontal.get();
            }
        }

        if (direction === Direction.horizontal.get()) {
            this.walls[this.walls.length - 1].secondPoint.x = this.walls[0].firstPoint.x;
            this.walls[0].firstPoint.y = this.walls[this.walls.length - 1].secondPoint.y;
        } else {
            this.walls[this.walls.length - 1].secondPoint.y = this.walls[0].firstPoint.y;
            this.walls[0].firstPoint.x = this.walls[this.walls.length - 1].secondPoint.x;
        }
    }

    /* Arányosan rajzolja fel az alaprajzot a balfelső sarokhoz, majd középre helyezi*/
    scalingToWindowSize(cWidth, cHeight) {
        let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
        this.walls.forEach(wall => {
            switch (wall.direction) {
                case Direction.North.get():
                    n += wall.size;
                    break;
                case Direction.East.get():
                    e += wall.size;
                    break;
                case Direction.South.get():
                    s += wall.size;
                    break;
                case Direction.West.get():
                    w += wall.size;
                    break;
            }
        });

        if ((n > 0 || s > 0) && e === 0 && w === 0) {
            alert("Nem lehet mindegyik fal függőleges!");
            return false;
        }

        if (n === 0 || s === 0 || e === 0 || w === 0) {
            alert("Legalább egy méret nem lett megadva!");
            return false;
        }
        if (n !== s || e !== w) {
            alert("Hibás méretek!");
            return false;
        }

        const stmp1 = cHeight * 0.95 / s;
        const stmp2 = cWidth * 0.95 / e;
        //const scale = stmp1 < stmp2 ? stmp1 : stmp2;
        this.scale = stmp1 < stmp2 ? stmp1 : stmp2;

        // most left position
        let mostLeft = this.walls[0];
        let mlIndex = 0;

        let index = 0;
        this.walls.forEach(coord => {
            if (coord.firstPoint.x < mostLeft.firstPoint.x || coord.secondPoint.x < mostLeft.firstPoint.x ||
                coord.firstPoint.x < mostLeft.secondPoint.x || coord.secondPoint.x < mostLeft.secondPoint.x) {
                mostLeft = coord;
                mlIndex = index;
            }
            ++index;
        });

        switch (this.walls[mlIndex].direction) {
            case Direction.North.get():
                this.walls[mlIndex].firstPoint.x = cWidth * 0.025;
                this.walls[mlIndex].firstPoint.y = 0;
                this.walls[mlIndex].secondPoint.x = this.walls[mlIndex].firstPoint.x;
                this.walls[mlIndex].secondPoint.y = this.walls[mlIndex].firstPoint.y - this.scale * this.walls[mlIndex].size;
                break; 
            case Direction.South.get():
                this.walls[mlIndex].firstPoint.x = cWidth * 0.025;
                this.walls[mlIndex].firstPoint.y = 0;
                this.walls[mlIndex].secondPoint.x = this.walls[mlIndex].firstPoint.x;
                this.walls[mlIndex].secondPoint.y = this.walls[mlIndex].firstPoint.y + this.scale * this.walls[mlIndex].size;
                break;
            case Direction.East.get():
                this.walls[mlIndex].secondPoint.x = cWidth * 0.025;
                this.walls[mlIndex].secondPoint.y = 0;
                this.walls[mlIndex].firstPoint.x = this.walls[mlIndex].secondPoint.x + this.scale * this.walls[mlIndex].size;
                this.walls[mlIndex].firstPoint.y = this.walls[mlIndex].secondPoint.y;
                break;
            case Direction.West.get():
                this.walls[mlIndex].firstPoint.x = cWidth * 0.025;
                this.walls[mlIndex].firstPoint.y = 0;
                this.walls[mlIndex].secondPoint.x = this.walls[mlIndex].firstPoint.x + this.scale * this.walls[mlIndex].size;
                this.walls[mlIndex].secondPoint.y = this.walls[mlIndex].firstPoint.y;
                break;
        }
        for (let i = mlIndex + 1; i < this.walls.length; ++i) {
            if (this.walls[i].direction === Direction.North.get()) {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.x = this.walls[i].firstPoint.x
                this.walls[i].secondPoint.y = this.walls[i].firstPoint.y - this.scale * this.walls[i].size;
            } else if (this.walls[i].direction === Direction.South.get()) {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.x = this.walls[i].firstPoint.x;
                this.walls[i].secondPoint.y = this.walls[i].firstPoint.y + this.scale * this.walls[i].size;
            } else if (this.walls[i].direction === Direction.East.get()) {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.x = this.walls[i].firstPoint.x + this.scale * this.walls[i].size;
                this.walls[i].secondPoint.y = this.walls[i].firstPoint.y;
            } else if (this.walls[i].direction === Direction.West.get()) {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.x = this.walls[i].firstPoint.x - this.scale * this.walls[i].size;
                this.walls[i].secondPoint.y = this.walls[i].firstPoint.y;
            }
        }
        for (let i = mlIndex - 1; i >= 0; --i) {
            if (this.walls[i].direction === Direction.North.get()) {
                this.walls[i].secondPoint = this.walls[i + 1].firstPoint;
                this.walls[i].firstPoint.x = this.walls[i].secondPoint.x
                this.walls[i].firstPoint.y = this.walls[i].secondPoint.y + this.scale * this.walls[i].size;
            } else if (this.walls[i].direction === Direction.South.get()) {
                this.walls[i].secondPoint = this.walls[i + 1].firstPoint;
                this.walls[i].firstPoint.x = this.walls[i].secondPoint.x;
                this.walls[i].firstPoint.y = this.walls[i].secondPoint.y - this.scale * this.walls[i].size;
            } else if (this.walls[i].direction === Direction.East.get()) {
                this.walls[i].secondPoint = this.walls[i + 1].firstPoint;
                this.walls[i].firstPoint.x = this.walls[i].secondPoint.x - this.scale * this.walls[i].size;
                this.walls[i].firstPoint.y = this.walls[i].secondPoint.y;
            } else if (this.walls[i].direction === Direction.West.get()) {
                this.walls[i].secondPoint = this.walls[i + 1].firstPoint;
                this.walls[i].firstPoint.x = this.walls[i].secondPoint.x + this.scale * this.walls[i].size;
                this.walls[i].firstPoint.y = this.walls[i].secondPoint.y;
            }
        }
        this.walls[this.walls.length - 1].secondPoint = this.walls[0].firstPoint;

        let topPos = this.walls[0];

        index = 0;
        this.walls.forEach(coord => {
            if (coord.firstPoint.y < topPos.firstPoint.y || coord.secondPoint.y < topPos.firstPoint.y ||
                coord.firstPoint.y < topPos.secondPoint.y || coord.secondPoint.y < topPos.secondPoint.y) {
                topPos = coord;
            }
            ++index;
        });

        const topY = topPos.firstPoint.y < topPos.secondPoint.y ?
            (Math.abs(topPos.firstPoint.y) + cHeight * 0.95 * 0.0375) : (Math.abs(topPos.secondPoint.y) + cHeight * 0.95 * 0.0375);

        for (let i = 0; i < this.walls.length; ++i) {
            this.walls[i].firstPoint.y = this.walls[i].firstPoint.y + topY;
            //this.walls[i].secondPoint.y = this.walls[i].secondPoint.y + topY;
        }

        // Középre igazítás
        let toSlide;
        if (stmp1 < stmp2) {
            toSlide = (stmp2 * e - this.scale * e) / 2;
            for (let i = 0; i < this.walls.length; ++i) {
                this.walls[i].firstPoint.x = this.walls[i].firstPoint.x + toSlide;
            }
        } else {
            toSlide = (stmp1 * s - stmp2 * s) / 2;
            for (let i = 0; i < this.walls.length; ++i) {
                this.walls[i].firstPoint.y = this.walls[i].firstPoint.y + toSlide;
            }
        }
        context.clearRect(0, 0, cWidth, cHeight);
        return true;
    }

    searchNearestWallsForPeak(pos) {

        let distH;
        let distV;
        let mostLeft;
        let mostTop;
    
        if (this.walls[0].direction === Direction.vertical.get()) {
            distH = this.getDistance({ x: 0, y: this.walls[1].firstPoint.y }, { x: 0, y: pos.y });
            distV = this.getDistance({ x: this.walls[0].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
            mostLeft = {wallindex: 0, distance: distV / this.scale};
            mostTop = {wallindex: 1, distance: distH / this.scale}; 
        } else {
            distH = this.getDistance({ x: 0, y: this.walls[0].firstPoint.y }, { x: 0, y: pos.y });
            distV = this.getDistance({ x: this.walls[1].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
            mostLeft = {wallindex: 1, distance: distV / this.scale};
            mostTop = {wallindex: 0, distance: distH / this.scale}; 
        }
    
        for (let i = 2; i < this.walls.length; ++i) {
            if (this.walls[i].direction === Direction.vertical.get()) {
                if (this.walls[i].firstPoint.x < this.walls[mostLeft.wallindex].firstPoint.x) {
                    distV = this.getDistance({ x: this.walls[i].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
                    mostLeft = {wallindex: i, distance: distV / this.scale};
                }
            } else if (this.walls[i].direction === Direction.horizontal.get()) {
                if (this.walls[i].firstPoint.y < this.walls[mostTop.wallindex].firstPoint.y) {
                    distV = this.getDistance({ x: this.walls[i].firstPoint.x, y: 0 }, { x: pos.x, y: 0 });
                    mostLeft = {wallindex: i, distance: distV / this.scale};
                }
            }
        }
    
        return {hw: mostTop, vw: mostLeft};   
    
    }

    /* Kitörli az összes adatot */
    #deleteData() {
        this.name = "";
        this.walls = new Array();
        this.beacons = new Array();
        this.furnitures = new Array();
        this.graph = new Graph();
    }

    /* Betölti az adatokat a json obj.-ból */
    loadData(data) {
        this.#deleteData(); // előtte törli az adatokat

        this.name = data.name;
        
        for (let i = 0; i < data.walls.length; ++i) {
            this.addWall(new Wall(data.walls[i].firstPoint, data.walls[i].secondPoint, data.walls[i].size, data.walls[i].direction));
        }

        for (let i = 0; i < data.furnitures.length; ++i) {
            this.addFurniture(new Furniture(data.furnitures[i].name, data.furnitures[i].data, data.furnitures[i].info, data.furnitures[i].distance_from_walls));
            this.furnitures[i].scaled = data.furnitures[i].scaled;
            this.furnitures[i].separators = data.furnitures[i].separators;
            this.furnitures[i].products = data.furnitures[i].products;
        }

        for (let i = 0; i < data.beacons.length; ++i) {
            this.addBeacon(new Beacon(data.beacons[i].x, data.beacons[i].y, data.beacons[i].furnitureOrWall, data.beacons[i].wallIndex, data.beacons[i].distance, data.beacons[i].id));
            if (this.beacons[i].furnitureOrWall == 'furniture') {
                this.beacons[i].furnitureIndex = data.beacons[i].furnitureIndex;
            }
        }

        for (let i = 0; i < data.graph.addition.length; ++i) {
            this.graph.addVertex(data.graph.addition[i].coordinate, data.graph.addition[i].nearestWall);
        }
        for (let i = 0; i < data.graph.addition.length; ++i) {
            for (let j = 0; j < data.graph.adjacencyList[i].length; ++j) {
                this.graph.addEdge(i.toString(), data.graph.adjacencyList[i][j].node.toString(), data.graph.adjacencyList[i][j].weight);
            }
        }
    }

    searchNextWall() {
        let tmp_walls = [];
        const basic_length = this.walls.length;
        tmp_walls.push(new Wall(this.walls[0].firstPoint, this.walls[0].secondPoint, 0, this.walls[0].direction));
        this.walls.splice(0, 1);
        while (tmp_walls.length < basic_length) {
            const tmp_befPoint = tmp_walls[tmp_walls.length - 1].secondPoint;
            let tmp_curr = this.walls[0];
            let tmp_index = 0;
            
            for (let i = 1; i < this.walls.length; ++i) {
    
                let tmp_firstPointDistance = getDistance(tmp_curr.firstPoint, tmp_befPoint);
                let tmp_secondPointDistance = getDistance(tmp_curr.secondPoint, tmp_befPoint);
                const firstPointDistance = getDistance(this.walls[i].firstPoint, tmp_befPoint);
                const secondPointDistance = getDistance(this.walls[i].secondPoint, tmp_befPoint);
                let minDistance = tmp_firstPointDistance < tmp_secondPointDistance ? tmp_firstPointDistance : tmp_secondPointDistance;
    
                if (firstPointDistance < minDistance || secondPointDistance < minDistance) {
                    tmp_curr = this.walls[i];
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
            
            this.walls.splice(tmp_index, 1);
        }
        this.walls = tmp_walls;

        let vert_ = 0;
        let hori_ = 0;
        for (let i = 0; i < this.walls.length; ++i) {
            if (this.getDirection(this.walls[i]) === Direction.horizontal.get()) {
                hori_ += 1;
            }
            if (this.getDirection(this.walls[i]) === Direction.vertical.get()) {
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

    /* Megkeresi a legközelebbi függőleges és vízszintes falat az objektumhoz */
    searchNearestWalls(furniture) {

        let nearest_wall_horizontal = [];
        let nearest_wall_vertical = [];

        for (let i = 0; i < furniture.length; ++i) {
            let indH;
            let indV;
            let distH;
            let distV;
            for (let j = 0; j < this.walls.length; ++j) {
                if ((this.getDirection(furniture[i]) === Direction.vertical.get() && (this.walls[j].direction === Direction.North.get()) || (this.walls[j].direction === Direction.South.get())  &&
                    this.isNextToItVertically(this.walls[j], furniture[i]) === true)) {
                    const distance_ = this.getDistance({x: this.walls[j].firstPoint.x, y: 0}, {x: furniture[i].firstPoint.x, y: 0});
                    if (distV != undefined) {
                        if (distV > distance_) {
                            indV = j;
                            distV = distance_;
                        }
                    } else {
                        indV = j;
                        distV = distance_;
                    }
                    
                } else if ((this.getDirection(furniture[i]) === Direction.horizontal.get() && (this.walls[j].direction === Direction.East.get()) || (this.walls[j].direction === Direction.West.get())  &&
                    this.isNextToItHorizontally(this.walls[j], furniture[i]) === true)) {
                    const distance_ = this.getDistance({x: 0, y: this.walls[j].firstPoint.y}, {x: 0, y: furniture[i].firstPoint.y});
                    if (distH != undefined) {
                        if (distH > distance_) {
                            indH = j;
                            distH = distance_;
                        }
                    } else {
                        indH = j;
                        distH = distance_;
                    }
                    
                }
            }
            if (this.getDirection(furniture[i]) === Direction.vertical.get()) {
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

    pointOnWall(point, wall) {
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

    /* megnézi teljese terjerdelmében mellette van e egy függőleges fal */
    isNextToItVertically(room_wall, furniture_wall) {
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
    isNextToItHorizontally(room_wall, furniture_wall) {
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

    /* Két pont közötti távolságot számolja ki */
    getDistance(point1, point2) {
        const a = point1.x - point2.x;
        const b = point1.y - point2.y;
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }

    /* Szétszedi azokat a falakat, amik "egyben" lettek felrajzolva, de derékszög van bennük */
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


        this.walls.splice(-1,1);
        this.addWall(new Wall(new Point(drawingcoords[0].x, drawingcoords[0].y), new Point(breakPoints[0].x, breakPoints[0].y), 0, Direction.undefinedDirection));
        for (let i = 0; i < breakPoints.length - 1; ++i) {
            this.addWall(new Wall(new Point(breakPoints[i].x, breakPoints[i].y), new Point(breakPoints[i + 1].x, breakPoints[i + 1].y),  0, Direction.undefinedDirection));
        }
        this.addWall(new Wall(new Point(breakPoints[breakPoints.length - 1].x, breakPoints[breakPoints.length - 1].y), new Point(drawingcoords[drawingcoords.length - 1].x, drawingcoords[drawingcoords.length - 1].y), 0, Direction.undefinedDirection));
        
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

    /* Összeolvaszt két pontot */
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

    #cycle_counter = 0; // végtelen ciklus elkerülése miatt a mergeDirections() metódushoz
    /* Egybeolvassza az egymás melletti "egyirányú" falakat */
    mergeSameDirections() {

        let mergedcoords = [];
        let b = false;

        for (let i = 0; i < this.walls.length - 1; ++i) {
            let dir = this.getDirection(this.walls[i]);
            if (this.getDirection(this.walls[i]) === this.getDirection(this.walls[i + 1])) {
                mergedcoords.push(this.mergeTwoPoints(this.walls[i], this.walls[i + 1], dir));
                if ((i + 1) === this.walls.length) {
                    b = true;
                }
                this.walls.splice((i + 1), 1);
            } else {
                mergedcoords.push(this.walls[i]);
            }
        }

        if (this.getDirection(this.walls[this.walls.length - 1]) === this.getDirection(this.walls[0])) {
            let dir = this.getDirection(this.walls[0]);
            mergedcoords.push(this.mergeTwoPoints(this.walls[this.walls.length - 1], this.walls[0], dir));
            mergedcoords.splice(0, 1)
        } else {
            if (!b) {
                mergedcoords.push(this.walls[this.walls.length - 1]);
            } 
        }
        this.walls = mergedcoords;
    }

    /* Vissza adja van e két egymásra nem merőleges fal egymás után */
    isAnySameDirection() {
        if (this.#cycle_counter === 100) {
            alert("Váratlan hiba, rajzold újra!");
            this.#cycle_counter = 0;
            return true;
        } else {++this.#cycle_counter;}

        for (let i = 0; i < this.walls.length - 1; ++i) {
            if (this.getDirection(this.walls[i]) === this.getDirection(this.walls[i + 1])) {
                return false;
            }
        }

        if (this.getDirection(this.walls[this.walls.length - 1]) === this.getDirection(this.walls[0])) {
            return false;
        }

        return true;
    }

    /* Ablakhoz igazítja a falakat */
    scalePlan(cWidth, cHeight) {
        let n = 0, e = 0, s = 0, w = 0;	// sum(kül. irányú falak)
        this.walls.forEach(coord => {
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
        const stmp1 = cHeight * 0.95 / s; 
        const stmp2 = cWidth * 0.95 / e; 
        this.scale = stmp1 < stmp2 ? stmp1 : stmp2;

        // most left position
        let mostLeft = this.walls[0];
        let mlIndex = 0;

        let index = 0;
        this.walls.forEach(coord => {
            if (coord.firstPoint.x < mostLeft.firstPoint.x || coord.secondPoint.x < mostLeft.firstPoint.x ||
                coord.firstPoint.x < mostLeft.secondPoint.x || coord.secondPoint.x < mostLeft.secondPoint.x) {
                mostLeft = coord;
                mlIndex = index;
            }
            ++index;
        });

        switch (this.walls[mlIndex].direction) {
            case 'North':
                this.walls[mlIndex].firstPoint.x = cWidth * 0.025;
                this.walls[mlIndex].firstPoint.y = 0;
                this.walls[mlIndex].secondPoint.x = this.walls[mlIndex].firstPoint.x;
                this.walls[mlIndex].secondPoint.y = this.walls[mlIndex].firstPoint.y - this.scale * this.walls[mlIndex].size;
                break;
            case 'South':
                this.walls[mlIndex].firstPoint.x = cWidth * 0.025;
                this.walls[mlIndex].firstPoint.y = 0;
                this.walls[mlIndex].secondPoint.x = this.walls[mlIndex].firstPoint.x;
                this.walls[mlIndex].secondPoint.y = this.walls[mlIndex].firstPoint.y + this.scale * this.walls[mlIndex].size;
                break;
            case 'East':
                this.walls[mlIndex].secondPoint.x = cWidth * 0.025;
                this.walls[mlIndex].secondPoint.y = 0;
                this.walls[mlIndex].firstPoint.x = this.walls[mlIndex].secondPoint.x + this.scale * this.walls[mlIndex].size;
                this.walls[mlIndex].firstPoint.y = this.walls[mlIndex].secondPoint.y;
                break;
            case 'West':
                this.walls[mlIndex].firstPoint.x = cWidth * 0.025;
                this.walls[mlIndex].firstPoint.y = 0;
                this.walls[mlIndex].secondPoint.x = this.walls[mlIndex].firstPoint.x + this.scale * this.walls[mlIndex].size;
                this.walls[mlIndex].secondPoint.y = this.walls[mlIndex].firstPoint.y;
                break;
        }
        for (let i = mlIndex + 1; i < this.walls.length; ++i) {
            if (this.walls[i].direction === 'North') {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.x = this.walls[i].firstPoint.x
                this.walls[i].secondPoint.y = this.walls[i].firstPoint.y - this.scale * this.walls[i].size;
            } else if (this.walls[i].direction === 'South') {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.x = this.walls[i].firstPoint.x;
                this.walls[i].secondPoint.y = this.walls[i].firstPoint.y + this.scale * this.walls[i].size;
            } else if (this.walls[i].direction === 'East') {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.x = this.walls[i].firstPoint.x + this.scale * this.walls[i].size;
                this.walls[i].secondPoint.y = this.walls[i].firstPoint.y;
            } else if (this.walls[i].direction === 'West') {
                this.walls[i].firstPoint = this.walls[i - 1].secondPoint;
                this.walls[i].secondPoint.x = this.walls[i].firstPoint.x - this.scale * this.walls[i].size;
                this.walls[i].secondPoint.y = this.walls[i].firstPoint.y;
            }
        }
        for (let i = mlIndex - 1; i >= 0; --i) {
            if (this.walls[i].direction === 'North') {
                this.walls[i].secondPoint = this.walls[i + 1].firstPoint;
                this.walls[i].firstPoint.x = this.walls[i].secondPoint.x
                this.walls[i].firstPoint.y = this.walls[i].secondPoint.y + this.scale * this.walls[i].size;
            } else if (this.walls[i].direction === 'South') {
                this.walls[i].secondPoint = this.walls[i + 1].firstPoint;
                this.walls[i].firstPoint.x = this.walls[i].secondPoint.x;
                this.walls[i].firstPoint.y = this.walls[i].secondPoint.y - this.scale * this.walls[i].size;
            } else if (this.walls[i].direction === 'East') {
                this.walls[i].secondPoint = this.walls[i + 1].firstPoint;
                this.walls[i].firstPoint.x = this.walls[i].secondPoint.x - this.scale * this.walls[i].size;
                this.walls[i].firstPoint.y = this.walls[i].secondPoint.y;
            } else if (this.walls[i].direction === 'West') {
                this.walls[i].secondPoint = this.walls[i + 1].firstPoint;
                this.walls[i].firstPoint.x = this.walls[i].secondPoint.x + this.scale * this.walls[i].size;
                this.walls[i].firstPoint.y = this.walls[i].secondPoint.y;
            }
        }
        this.walls[this.walls.length - 1].secondPoint = this.walls[0].firstPoint;

        let topPos = this.walls[0];

        index = 0;
        this.walls.forEach(coord => {
            if (coord.firstPoint.y < topPos.firstPoint.y || coord.secondPoint.y < topPos.firstPoint.y ||
                coord.firstPoint.y < topPos.secondPoint.y || coord.secondPoint.y < topPos.secondPoint.y) {
                topPos = coord;
            }
            ++index;
        });

        const topY = topPos.firstPoint.y < topPos.secondPoint.y ?
            (Math.abs(topPos.firstPoint.y) + cHeight * 0.95 * 0.0375) : (Math.abs(topPos.secondPoint.y) + cHeight * 0.95 * 0.0375);


        for (let i = 0; i < this.walls.length; ++i) {
            this.walls[i].firstPoint.y = this.walls[i].firstPoint.y + topY;
        }
        
        let toSlide;
        if (stmp1 < stmp2) {
            toSlide = (stmp2 * e - this.scale * e) / 2;
            for (let i = 0; i < this.walls.length; ++i) {
                this.walls[i].firstPoint.x = this.walls[i].firstPoint.x + toSlide;
            }
        } else {
            toSlide = (stmp1 * s - stmp2 * s) / 2;
            for (let i = 0; i < this.walls.length; ++i) {
                this.walls[i].firstPoint.y = this.walls[i].firstPoint.y + toSlide;
            }
        }

        for (let i = 0; i < this.walls.length; ++i) {
            for (let j = 0; j < this.beacons.length; ++j) {
                if (this.beacons[j].wall === i) {
                    switch (this.walls[i].direction) {
                        case 'North':
                            this.beacons[j].x = this.walls[i].firstPoint.x;
                            this.beacons[j].y = this.walls[i].secondPoint.y + this.beacons[j].pos * scale;
                            break;
                        case 'South':
                            this.beacons[j].x = this.walls[i].firstPoint.x;
                            this.beacons[j].y = this.walls[i].firstPoint.y + this.beacons[j].pos * scale;
                            break;
                        case 'East':
                            this.beacons[j].x = this.walls[i].firstPoint.x + this.beacons[j].pos * scale;
                            this.beacons[j].y = this.walls[i].firstPoint.y;
                            break;
                        case 'West':
                            this.beacons[j].x = this.walls[i].secondPoint.x + this.beacons[j].pos * scale;
                            this.beacons[j].y = this.walls[i].firstPoint.y;
                            break;
                    }
                }
            }
        }
    }
}