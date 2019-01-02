precision highp float;

uniform vec2 resolution;
uniform vec3 eye;
uniform vec3 lookAt;
uniform vec3 lightPos;
uniform float time;

#pragma import scene.glsl
#pragma import ../glsl/core/rayDirection.glsl
#pragma import ../glsl/core/viewMatrix.glsl
#pragma import ../glsl/core/castRay.glsl
#pragma import ../glsl/lighting/normal.glsl
#pragma import ../glsl/lighting/softShadow.glsl
#pragma import ../glsl/lighting/ao.glsl
#pragma import phong.glsl

void drawBg() {
    gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
}

void drawScene(vec3 pt, float material) {
    vec3 nor = estimateNormal( pt );
    float occ = ao( pt, nor );
    float shadow = softShadow( pt, normalize(lightPos-pt), 0.1, 22.2);
    vec3 color = phong(pt, nor, eye, material)*sqrt(occ);
    color += color * shadow;
    gl_FragColor = vec4(color, 1.0);
}

void main(void) {
	vec3 direction = rayDirection(60.0, resolution);
    mat4 viewToWorld = viewMatrix(eye, lookAt, vec3(0.0, 1.0, 0.0));
    vec3 worldDir = (viewToWorld * vec4(direction, 0.0)).xyz;
    vec2 dist = castRay(eye, worldDir);
    if (dist.x > 32.) {
        drawBg();
    } else {
        drawScene(eye + dist.x * worldDir, dist.y);
    }
}