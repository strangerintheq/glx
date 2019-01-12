precision highp float;

uniform vec2 resolution;
uniform vec3 eye;
uniform vec3 lookAt;
uniform vec3 lightPos;

uniform sampler2D noiseTexture1;
uniform sampler2D noiseTexture2;

float noise(vec3 p){
    vec2 uv = p.xz/512.;
    return texture2D(noiseTexture1, uv).r;
}
//#pragma import ../glsl/noise.glsl
#pragma import ../glsl/fbm.glsl
#pragma import ../glsl/sdf/sdPlane.glsl

vec2 map(vec3 p) {
    p.y += fbm(p)*2.;
    float d = sdPlane(p, -1.);
    return vec2(d, 0.5);
}

#pragma import ../glsl/core/worldDir.glsl
#pragma import ../glsl/core/castRay.glsl
#pragma import ../glsl/lighting/normal.glsl
#pragma import ../glsl/lighting/softShadow.glsl
#pragma import ../glsl/lighting/ao.glsl
#pragma import ../examples/phong.glsl

void drawBg() {
    vec2 uv = gl_FragCoord.xy/resolution;
    float v = 0.;//texture2D(noiseTexture1, uv).g;
    gl_FragColor = vec4(v, v, v, 1.);
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
    vec2 dist = castRay(eye, rd, 0., 256., 0.);
    if (dist.x > 256.) {
        drawBg();
    } else {
        drawScene(eye + dist.x * rd, dist.y);
    }
}