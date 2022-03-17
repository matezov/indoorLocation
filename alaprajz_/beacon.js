class Beacon {
    constructor(x, y, wallIndexVertical, verticalWallDistance, wallIndexHorizontal, horizontalWallDistance, id) {
        this.x = x;
        this.y = y;
        this.wallIndexVertical = wallIndexVertical;
        this.verticalWallDistance = verticalWallDistance;
        this.wallIndexHorizontal = wallIndexHorizontal;
        this.horizontalWallDistance = horizontalWallDistance;
        this.id = id;
    }

    getId() { return this.id; }
    getPosition() { return new Point(this.x, this.y); }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setId(id) { this.id = id; }

}