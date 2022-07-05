class Direction {

    static North = new Direction('North');
    static East = new Direction('East');
    static South = new Direction('South');
    static West = new Direction('West');
    static vertical = new Direction('vertical');
    static horizontal = new Direction('horizontal');
    static undefinedDirection = new Direction('undefinedDirection');

    constructor(direction) {
        this.direction = direction;
    }

    get() {
        return this.direction;
    }

    isEqual(directionObj) {
        return directionObj.direction === this.direction ? true : false;
    }

}