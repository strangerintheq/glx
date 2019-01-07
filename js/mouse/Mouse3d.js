function Mouse3d() {

    var mouse = {x: 0, y: 0};
    var dragStartMousePosition;
    var dragStartPhi;
    var dragStartTheta;
    var update;
    var callback;
    var self = this;

    this.theta = 0;
    this.phi = 0;
    this.eye = [0, 0, 0];

    this.initListeners = function (canvas) {
        var target = canvas || window;
        target.addEventListener('mousemove', this.filter(mouseMove), false);
        target.addEventListener('mouseup', this.filter(mouseUp), false);
        target.addEventListener('mousedown', this.filter(mouseDown), false);
    };

    this.update = function (func) {
        update = func;
    };

    this.callback = function (func) {
        callback = func;
    };

    this.filter = function (func) {
        return function(event) {
            event.target.tagName === 'CANVAS' && func(event);
        }
    };

    function mouseMove(event) {
        mouse = event;
        dragStartMousePosition && rotate();
    }

    function rotate() {
        var amountX = dragStartMousePosition ? dragStartMousePosition.x - mouse.x : 0;
        var amountZ = mouse.y - dragStartMousePosition.y;
        self.theta = dragStartTheta + amountX/360;
        self.phi = dragStartPhi + amountZ/360;
        var limit = Math.PI / 2;
        self.phi = self.phi > limit ? limit : self.phi;
        self.phi = self.phi < -limit ? -limit : self.phi;
        update && update();
    }

    function mouseDown(event) {
        dragStartPhi = self.phi;
        dragStartTheta = self.theta;
        dragStartMousePosition = event;
    }

    function mouseUp() {
        rotate();
        dragStartMousePosition = null;
        dragStartPhi = 0;
        dragStartTheta = 0;
    }
}