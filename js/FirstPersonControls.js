var FirstPersonControls = (function() {

    var maxSpeed = 1;
    var theta = 0;
    var phi = 0;
    var mouse = {x: 0, y: 0};
    var dragStartMousePosition, dragStartPhi, dragStartTheta, callback;
    var speed = directions();
    var moveDir = directions();

    var mouse3d = {
        eye: [0, 0, 0],
        forward: [0, 0, 1],
        right: [1, 0, 0],
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
        target.addEventListener('keydown', keyListener(true), false);
        target.addEventListener('keyup', keyListener(false), false);
        setInterval(update, 10)
    }


    function upd(delta, dir, mag, i) {
        var k = 0.01;
        delta = dir * k * mag * delta;
        mouse3d.eye[i] += delta;
        mouse3d.forward[i] += delta;
        mouse3d.right[i] += delta;
    }

    function moveForward(dir, mag, i) {
        upd(mouse3d.forward[i] - mouse3d.eye[i], dir, mag, i);
    }

    function moveRight(dir, mag, i) {
        upd(mouse3d.right[i] - mouse3d.eye[i], dir, mag, i);
    }

    function update() {
        Object.keys(speed).forEach(updateSpeed);
        var magForward = magnitude(mouse3d.forward, mouse3d.eye);
        var magRight = magnitude(mouse3d.right, mouse3d.eye);
        for (var i = 0; i < 3; i++) {
            moveForward(speed.forward, magForward, i);
            moveForward(speed.backward, -magForward, i);
            moveRight(speed.right, -magRight, i);
            moveRight(speed.left, magRight, i);
        }
    }

    function magnitude(p1, p2) {
        var dx = p1[0] - p2[0];
        var dy = p1[1] - p2[1];
        var dz = p1[2] - p2[2];
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }

    function updateSpeed(key) {
        if (moveDir[key]) {
            speed[key] += 0.02;
        } else {
            speed[key] /= 2;
        }
        if (speed[key] < 0.01) {
            speed[key] = 0;
        }
        speed[key] = Math.min(speed[key], maxSpeed);
    }

    function keyListener(state) {
        return function (e) {
            if (e.key === "w") moveDir.forward = state;
            if (e.key === "s") moveDir.backward = state;
            if (e.key === "a") moveDir.left = state;
            if (e.key === "d") moveDir.right = state;
        }
    }

    function mouseMove(event) {
        if (event.target.tagName !== 'CANVAS') return;
        mouse = event;
        if (dragStartMousePosition) {
            rotate();
        }
    }

    function updatePositions() {
        let m = mouse3d;

        m.forward[0] = m.eye[0] + Math.cos(phi) * Math.sin(theta);
        m.forward[1] = m.eye[1] - Math.sin(phi);
        m.forward[2] = m.eye[2] + Math.cos(phi) * Math.cos(theta);

        m.right[0] = m.eye[0] + Math.sin(theta + Math.PI/2);
        m.right[1] = m.eye[1];
        m.right[2] = m.eye[2] + Math.cos(theta + Math.PI/2);
    }

    function rotate() {
        var amountX = dragStartMousePosition ? dragStartMousePosition.x - mouse.x : 0;
        var amountZ = mouse.y - dragStartMousePosition.y;
        theta = dragStartTheta + amountX/360;
        phi = dragStartPhi + amountZ/360;
        var limit = Math.PI / 2;
        phi = phi > limit ? limit : phi;
        phi = phi < -limit ? -limit : phi;
        updatePositions();
        callback && callback();
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

    function directions() {
        return {
            forward: 0,
            backward: 0,
            right: 0,
            left: 0,
        }
    }

})();