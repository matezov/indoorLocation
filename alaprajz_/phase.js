class Phase {

    static drawing = new Phase('drawing');
    static squaring = new Phase('squaring');
    static beacon = new Phase('beacon');
    static furnishing = new Phase('furnishing');
    static furnitureSizing = new Phase('furnitureSizing');
    static route = new Phase('route');
    static final = new Phase('final');

    constructor(phase) {
        this.phase = phase;
    }
    
}