class Beacon {

    constructor(x, y, furnitureOrWall, wallIndex, distance, id) {
        this.x = x;
        this.y = y;
        //this.z = 2.5 - 1; // jeladó magassága a földtől - ~telefon magassága
        this.furnitureOrWall = furnitureOrWall;
        this.furnitureIndex = -1; // Ha bútorra kerül
        this.wallIndex = wallIndex;
        this.distance = distance;
        this.id = id;
    }

    getId() { return this.id; }
    getPosition() { return new Point(this.x, this.y); }
    getfurnitureIndex() { return this.furnitureIndex; }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setId(id) { this.id = id; }
    setFurnitureIndex(index) { this.furnitureIndex = index; }
    setDistance(distance) { this.distance = distance; }

    /* Arányosan rajzolja fel a jeladókat */
    scale(roomWalls, scale_permanent) {
        switch (roomWalls[this.wallIndex].direction) {
            case Direction.North.get():
                this.x = roomWalls[this.wallIndex].firstPoint.x;
                this.y = roomWalls[this.wallIndex].firstPoint.y - this.distance * scale_permanent;
                break;
            case Direction.South.get():
                this.x = roomWalls[this.wallIndex].firstPoint.x;
                this.y = roomWalls[this.wallIndex].firstPoint.y + this.distance * scale_permanent;
                break;
            case Direction.East.get():
                this.x = roomWalls[this.wallIndex].firstPoint.x + this.distance * scale_permanent;
                this.y = roomWalls[this.wallIndex].firstPoint.y;
                break;
            case Direction.West.get():
                this.x = roomWalls[this.wallIndex].firstPoint.x - this.distance * scale_permanent;
                this.y = roomWalls[this.wallIndex].firstPoint.y;
                break;
        }
    }
}