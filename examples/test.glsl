precision highp float;

uniform vec2 resolution;
uniform vec3 eye;
uniform vec3 lookAt;
uniform vec3 lightPos;
uniform sampler2D noise1;
uniform sampler2D noise2;

#pragma import scene.glsl
#pragma import ../glsl/core/worldDir.glsl
#pragma import ../glsl/core/castRay.glsl
#pragma import ../glsl/lighting/normal.glsl
#pragma import ../glsl/lighting/softShadow.glsl
#pragma import ../glsl/lighting/ao.glsl
#pragma import phong.glsl

void drawBg() {
    vec2 uv = gl_FragCoord.xy/1000.;
    gl_FragColor = vec4(
        texture2D(noise1, uv).g,
        texture2D(noise2, uv).r,
        0., 1.);
}

void drawScene(vec3 pt, float material) {
    vec3 nor = estimateNormal( pt );
    float occ = ao( pt, nor );
    float shadow = softShadow( pt, normalize(lightPos-pt), 0.01, 2.2);
    vec3 color = phong(pt, nor, eye, material)*sqrt(occ);
    color += color * shadow;
    gl_FragColor = vec4(color, 1.0);
}

void main(void) {
    vec3 rd = worldDir(60., resolution, eye, lookAt);
    vec2 dist = castRay(eye, rd);
    if (dist.x > 64.) {
        drawBg();
    } else {
        drawScene(eye + dist.x * rd, dist.y);
    }
}