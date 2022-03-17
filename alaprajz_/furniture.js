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
    addProduct(product) { this.products.push(product); }
    addSeparator(separator) { this.separators.push(separator); }

}

/* {name: name_prompt ,data: furniture, products: [], separators: [], info: {direction: '', start: {x: 0, y: 0}, end: {x: 0, y: 0}}, distance_from_walls: nearest_walls, scaled: false} */