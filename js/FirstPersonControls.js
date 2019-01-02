var FirstPersonControls = (function() {

    var theta = 0;
    var phi = 0;
    var mouse = {x: 0, y: 0};
    var dragStartMousePosition, dragStartPhi, dragStartTheta;
    var callback;

    var mouse3d = {

        eye: [5, 0, 0],
        lookAt: [0, 0, 0],

        init: init,

        callback: function (cb) {
            callback = cb;
        }
    };

    return mouse3d;

    function init(canvas) {
        var target = canvas || window;
        target.addEventListener('mousemove', mouseMove, false);
        target.addEventListener('mouseup', mouseUp, false);
        target.addEventListener('mousedown', mouseDown, false);
        target.addEventListener('mousewheel', mouseWheel, false);
        target.addEventListener('keypress', keyDown, false);
        //updateCameraPosition();
    }

    function keyDown(e) {
        console.log(e)
    }

    function mouseMove(event) {
        if (event.target.tagName !== 'CANVAS') return;
        mouse = event;
        if (dragStartMousePosition) {
            rotate();
        }
    }

    function updateCameraPosition() {
        let m = mouse3d;
        m.lookAt[0] = -Math.atan(theta);
        m.lookAt[1] = Math.atan(phi);
        m.lookAt[2] = -Math.atan(theta);
        callback && callback();
    }

    function rotate() {
        var amountX = dragStartMousePosition ? dragStartMousePosition.x - mouse.x : 0;
        var amountZ = mouse.y - dragStartMousePosition.y;
        theta = dragStartTheta + amountX/120;
        phi = dragStartPhi + amountZ/120;
        var limit = Math.PI / 2;
        phi = phi > limit ? limit : phi;
        phi = phi < -limit ? -limit : phi;
        updateCameraPosition();
    }

    function mouseDown(event) {
        if (event.target.tagName !== 'CANVAS') return;
        dragStartPhi = phi;
        dragStartTheta = theta;
        dragStartMousePosition = event;
    }

    function mouseUp() {
        if (event.target.tagName !== 'CANVAS') return;
        rotate();
        dragStartMousePosition = null;
        dragStartPhi = 0;
        dragStartTheta = 0;
    }

    function mouseWheel(e){
        mouse3d.radius *= e.wheelDelta > 0 ? 0.9 : 1.1;
        updateCameraPosition();
        e.preventDefault()
    }

})();