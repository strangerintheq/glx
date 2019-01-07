var OrbitControls = (function() {

    var mouse3d = new Mouse3d();
    mouse3d.lookAt = [0, 0, 0];
    mouse3d.radius = 7;
    mouse3d.update(updateCameraPosition);
    mouse3d.init = init;
    return mouse3d;

    function init(canvas, radius) {
        var target = canvas || window;
        mouse3d.initListeners(target);
        target.addEventListener('mousewheel', mouseWheel, false);
        mouse3d.radius = radius || mouse3d.radius;
        updateCameraPosition();
    }

    function updateCameraPosition() {
        let m = mouse3d;
        m.eye[0] = m.lookAt[0] + m.radius * Math.cos( m.phi) * Math.sin( m.theta);
        m.eye[1] = m.lookAt[1] + m.radius * Math.sin( m.phi);
        m.eye[2] = m.lookAt[2] + m.radius * Math.cos( m.phi) * Math.cos( m.theta);
        m.callback && m.callback();
    }

    function mouseWheel(e) {
        mouse3d.radius *= e.wheelDelta > 0 ? 0.9 : 1.1;
        updateCameraPosition();
        e.preventDefault()
    }

})();