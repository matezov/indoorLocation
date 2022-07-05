class Positioning {
    
    constructor(room) {
        this.room           = room;
        this.scale          = room.scale;
        this.data           = [];
        this.position       = undefined;
        this.nearestBeacon  = undefined;

        this.room.beacons.forEach(beacon => {
            let direction_ = this.getBeaconDirection(beacon);
            this.data.push({id: beacon.id, rssi: null, txPower: null, distance: null, position: new Point(beacon.x, beacon.y), direction: direction_});
        });
    }

    /* Megkeresi a legközelebbi (legerősebb jelű) jeladót */
    searchNearestBeacon() {
        let nearest_ = this.data[0];
        for (let i = 1; i < this.data.length; ++i) {
            if (nearest_.rssi < this.data[i].rssi && this.data[i].rssi != null) {
                nearest_ = this.data[i];
            }
        }
        this.nearestBeacon = nearest_;
    }

    /* Kiszámolja a három pont PX = {x: .., y: .., z: .., r: ..} */
    calculatePosition(P1, P2, P3) {
        const S = (Math.pow(P3.position.x, 2) - Math.pow(P2.position.x, 2) + Math.pow(P3.position.y, 2) - Math.pow(P2.position.y, 2) + Math.pow(P2.distance * this.scale, 2) - Math.pow(P3.distance * this.scale, 2)) / 2;
        const T = (Math.pow(P1.position.x, 2) - Math.pow(P2.position.x, 2) + Math.pow(P1.position.y, 2) - Math.pow(P2.position.y, 2) + Math.pow(P2.distance * this.scale, 2) - Math.pow(P1.distance * this.scale, 2)) / 2;
        const y = ((T * (P2.position.x - P3.position.x)) - (S * (P2.position.x - P1.position.x))) / (((P1.position.y - P2.position.y) * (P2.position.x - P3.position.x)) - ((P3.position.y - P2.position.y) * (P2.position.x - P1.position.x)));
        const x = ((y * (P1.position.y - P2.position.y)) - T) / (P2.position.x - P1.position.x);

        return new Point(x, y);
    }

    /* Két pont távolságát számolja ki */
    getDistance(point1, point2) {
        const a = point1.x - point2.x;
        const b = point1.y - point2.y;

        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }

    /* rssi értékből kiszámolja a távolságot */
    rssiToMeter(rssi, txPower) {
        if (rssi == 0) {
            return -1.0; 
        }
        let ratio = rssi * 1.0 / txPower;
        if (ratio < 1.0) {
            return Math.pow(ratio, 10);
        } else {
            let distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
            return distance;
        }
    }

    /* Kiválogatja a jelenleg elérhető jeladókat, majd ezekből a calculatePosition fgv. felhasználásával az összes kombinációval kiszámolja és visszaadja a lehetséges pozíciókat */
    calculatePositions() {
        let positions = [];
        let dataTemp = [];
        this.data.forEach(d => {
            if (d.rssi < -55 && d.rssi > -82) {
                dataTemp.push(d);
            }
        });
        for (let i = 0; i < dataTemp.length - 2; ++i) {
            let pos_tmp = this.calculatePosition(dataTemp[i], dataTemp[i + 1], dataTemp[i + 2]);
            positions.push(pos_tmp);
        }
        if (dataTemp.length >= 3) {
            let pos_tmp = this.calculatePosition(dataTemp[0], dataTemp[dataTemp.length - 2], dataTemp[dataTemp.length - 1]);
            positions.push(pos_tmp);

            if (dataTemp.length > 3) {
                pos_tmp = this.calculatePosition(dataTemp[0], dataTemp[1], dataTemp[dataTemp.length - 1]);
                positions.push(pos_tmp);
            }
        }
        return positions;
    }

    getBeaconData(id, rssi, txPower, position) {
        let distance = this.rssiToMeter(rssi, txPower);

        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].id == id) {
                this.data[i].rssi = parseInt(rssi);
                this.data[i].txPower = txPower;
                this.data[i].distance = distance;
            }
        }

        let count_ = 0;
        this.data.forEach(d => {
            if (d.distance != null) {
                count_ += 1;
            }
        });
        if (count_ >= 3) {
            return this.calculatePositions();

        } else {
            return [];
        }
    }

    setRSSI(name, rssi, txPower, position) {
        let positions = this.getBeaconData(name, rssi, txPower, position);
    
        let avg_x = 0;
        let avg_y = 0;
    
        let c_ = 0;
    
        for (let i = 0; i < positions.length; ++i) {
            if (positions[i].x != NaN && positions[i].y != NaN) {
                avg_x += positions[i].x;
                avg_y += positions[i].y;
                ++c_;
            }
        }
    
        if (c_ != 0) {
            let tempPoint = new Point((avg_x / c_), (avg_y / c_));
            if (room.inObject(tempPoint, room.walls)) {
                this.position = new Point((avg_x / c_), (avg_y / c_));
            }   
        }

        this.searchNearestBeacon();

    }

    getBeaconDirection(beacon) {        // TESZT OK
        let direction;

        if (beacon.furnitureIndex == -1) {
            direction = this.getWallSide(beacon.wallIndex);
        } else {
            direction = this.getFurnitureSide(beacon.furnitureIndex, beacon.wallIndex);
        }

        return direction;
    }

    getWallSide(wallIndex) {        // TESZT OK
        let wall = this.room.walls[wallIndex];
        let side;
        if (this.room.getDirection(wall) == Direction.North.get() ||
            this.room.getDirection(wall) == Direction.South.get() ||
            this.room.getDirection(wall) == Direction.vertical.get()) {

            let x = wall.firstPoint.x - 10;
            let y = (wall.firstPoint.y + wall.secondPoint.y) / 2;
            if (this.room.inObject(new Point(x, y), this.room.walls)) {
                side = Direction.West.get();
            } else {
                side = Direction.East.get();
            }

        } else {
            let x = (wall.firstPoint.x + wall.secondPoint.x) / 2;
            let y = wall.firstPoint.y - 10;
            if (this.room.inObject(new Point(x, y), this.room.walls)) {
                side = Direction.North.get();
            } else {
                side = Direction.South.get();
            }
        }
        return side;
    }

    getFurnitureSide(furnitureIndex, wallIndex) {       // TESZT OK
        let furnitureWall = this.room.furnitures[furnitureIndex].data[wallIndex];
        let side;
        if (this.room.getDirection(furnitureWall) == Direction.North.get() ||
            this.room.getDirection(furnitureWall) == Direction.South.get() ||
            this.room.getDirection(furnitureWall) == Direction.vertical.get()) {

            let x = furnitureWall.firstPoint.x - 10;
            let y = (furnitureWall.firstPoint.y + furnitureWall.secondPoint.y) / 2;

            if (this.room.inObject(new Point(x, y), this.room.furnitures[furnitureIndex].data)) {
                side = Direction.East.get();
            } else {
                side = Direction.West.get();
            }

        } else {
            let x = (furnitureWall.firstPoint.x + furnitureWall.secondPoint.x) / 2;
            let y = furnitureWall.firstPoint.y - 10;

            if (this.room.inObject(new Point(x, y), this.room.furnitures[furnitureIndex].data)) {
                side = Direction.South.get();
            } else {
                side = Direction.North.get();
            }

        }

        return side;
    }

}