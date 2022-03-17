class Wall {
    
    constructor(firstPoint, secondPoint, size, direction) {
        this.firstPoint = firstPoint;
        this.secondPoint = secondPoint;
        this.size = size;
        this.direction = direction;
    }

    getSize() { return this.size; }
    getDirection() { return this.direction; }

    setSize(size) { this.size = size; }
    setDirection(direction) { this.direction = direction; }
    setFirstPoint(firstPoint) { this.firstPoint = firstPoint; }
    setFirstPoint(secondPoint) { this.secondPoint = secondPoint; }

}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}