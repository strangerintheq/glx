var OrbitControls = (function() {

    var theta = 0;
    var phi = Math.PI / 10;
    var mouse = {x: 0, y: 0};
    var dragStartMousePosition, dragStartPhi, dragStartTheta;
    var callback;

    var mouse3d = {

        eye: [0, 0, 0],
        lookAt: [0, 0, 0],
        radius: 7,

        init: init,

        callback: function (cb) {
            callback = cb;
        }
    };

    return mouse3d;

    function init(canvas, radius) {
        var target = canvas || window;
        target.addEventListener('mousemove', mouseMove, false);
        target.addEventListener('mouseup', mouseUp, false);
        target.addEventListener('mousedown', mouseDown, false);
        target.addEventListener('mousewheel', mouseWheel, false);
        mouse3d.radius = radius || mouse3d.radius;
        updateCameraPosition();
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
        m.eye[0] = m.lookAt[0] + m.radius * Math.cos(phi) * Math.sin(theta);
        m.eye[1] = m.lookAt[1] + m.radius * Math.sin(phi);
        m.eye[2] = m.lookAt[2] + m.radius * Math.cos(phi) * Math.cos(theta);
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