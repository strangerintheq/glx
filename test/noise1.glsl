precision highp float;

uniform vec2 resolution;

#pragma import ../glsl/noise.glsl

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution;
    float v = noise((uv-1.)*512.);
    gl_FragColor = vec4(v, v, v, 1.0);
}
