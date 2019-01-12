let glx = GLx();
document.body.appendChild(glx.canvas);
let gl = glx.ctx;
let fullScreenTriangle = glx.buffer(glx.meshes.FULL_SCREEN_TRIANGLE);
FirstPersonControls.init();
glx.shadersLoadCallback = init;
glx.shader('triangle', '../glsl/full-screen-triangle.glsl')
    .shader('noise1', 'noise1.glsl')
    .shader('noise2', 'noise2.glsl')
    .shader('main', 'test.glsl');

function init() {
    let tex1 = noiseTexture('noise1');
    let tex2 = noiseTexture('noise2');
    let mainProgram = fullScreenTrianglePass('main');
    let resolution = mainProgram.uniform('2f', 'resolution');
    let lookAt = mainProgram.uniform('3f', 'lookAt');
    let lightPos = mainProgram.uniform('3f', 'lightPos');
    let eye = mainProgram.uniform('3f', 'eye');
    tex1.set(mainProgram.uniform('1i', 'noiseTexture1'), 0);
    tex2.set(mainProgram.uniform('1i', 'noiseTexture2'), 1);

    animate();

    function animate() {
        glx.resize();
        resolution.set(gl.drawingBufferWidth, gl.drawingBufferHeight);
        eye.set(FirstPersonControls.eye);
        lookAt.set(FirstPersonControls.forward);
        lightPos.set(Math.cos(glx.time() / 3) * 0.8, 0, Math.sin(glx.time() / 3) * 0.8);
        glx.draw(3);

        requestAnimationFrame(animate);
    }

    function fullScreenTrianglePass(vertexShader) {
        return glx.program('triangle', vertexShader).use()
            .attribute("coords", 2).bind(fullScreenTriangle);
    }

    function noiseTexture(vertexShader) {
        var s = 2048;
        fullScreenTrianglePass(vertexShader)
            .uniform('2f', 'resolution')
            .set(s,s);
        let tex = glx.texture();
        tex.renderTo(s, s, 3);
        return tex;
    }
}