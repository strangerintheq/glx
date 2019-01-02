// full-screen-triangle with webgl

function FullScreenTriangle(fragCode) {

    var glx = GLx();

    var vertices = glx.buffer([-1,  3, -1, -1, 3, -1]);

    var vertCode =
        `attribute vec2 coords;
         void main(void) {
           gl_Position = vec4(coords.xy, 0.0, 1.0);
         }`;

    glx.triangleProgram = glx.program(vertCode, 'precision highp float;' + fragCode).use();
    glx.triangleProgram.attribute("coords", 2).bind(vertices);

    glx.draw = function () {
        var gl = glx.gl;
        glx.resize();
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    return glx;
}
