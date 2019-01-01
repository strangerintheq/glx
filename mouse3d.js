var Mouse3D = (function(){

    var theta = 0;
    var phi = 0;
    var mouse = {x: 0, y: 0};
    var radius = 7;
    var dragStartMousePosition, dragStartPhi, dragStartTheta;
    var callback;
    var mouse3d = {
        init: init,
        eye: [0, 0, radius],
        lookAt: [0, 0, 0],
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
    }

    function mouseMove(event) {
        if (event.target.tagName !== 'CANVAS') return;
        mouse = event;
        if (dragStartMousePosition) {
            rotate();
        }
    }

    function updateCameraPosition() {
        mouse3d.eye[0] = mouse3d.lookAt[0] + radius * Math.cos(phi) * Math.sin(theta);
        mouse3d.eye[1] = mouse3d.lookAt[1] + radius * Math.sin(phi);
        mouse3d.eye[2] = mouse3d.lookAt[2] + radius * Math.cos(phi) * Math.cos(theta);
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
        radius *= e.wheelDelta > 0 ? 0.9 : 1.1;
        updateCameraPosition();
        e.stopPropagation();
    }
})();