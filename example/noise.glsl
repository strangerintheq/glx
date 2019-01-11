precision highp float;

void main(void) {
    gl_FragColor = vec4(gl_FragCoord.x/1000., gl_FragCoord.y/1000., 0.0, 0.0);
}
