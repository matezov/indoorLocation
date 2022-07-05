class Phase {

    static drawing = new Phase('drawing');
    static squaring = new Phase('squaring');
    static beacon = new Phase('beacon');
    static beaconFurniture = new Phase('beaconFurniture');
    static furnishing = new Phase('furnishing');
    static furnitureSizing = new Phase('furnitureSizing');
    static product = new Phase('product');
    static route = new Phase('route');
    static final = new Phase('final');

    constructor(phase) {
        this.phase = phase;
    }
    
    get() {
        return this.phase;
    }
    
}