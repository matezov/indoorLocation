class Room {
    
    constructor() {
        this.name = "";
        this.walls = new Array();
        this.beacons = new Array();
        this.furnitures = new Array();
        this.graph = new Graph();
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

}