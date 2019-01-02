#pragma import ../glsl/lighting/phong.glsl

/**
 * Lighting via Phong illumination.
 *
 * The vec3 returned is the RGB color of that point after lighting is applied.
 * k_a: Ambient color
 * k_d: Diffuse color
 * k_s: Specular color
 * alpha: Shininess coefficient
 * p: position of point being lit
 * eye: the position of the camera
 *
 * See https://en.wikipedia.org/wiki/Phong_reflection_model#Description
 */
vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha,
                       vec3 p, vec3 nor, vec3 eye, vec3 materialColor) {
    const vec3 lightIntensity = vec3(1., 1., 1.);
    vec3 color = materialColor * k_a;
    color += phongContribForLight(k_d, k_s, alpha, p, nor, eye, lightPos, lightIntensity);
    //color += phongContribForLight(k_d, k_s, alpha, p, eye, light2Pos, light2Intensity);
    return color;
}

vec3 decodeMaterial(float m) {
    return vec3(1.-m/3.);
}

vec3 phong(vec3 p, vec3 nor, vec3 eye, float material) {
    const vec3 K_a = vec3(.5, .5, .5);
    const vec3 K_d = vec3(.5, .5, .5);
    const vec3 K_s = vec3(.1, .1, .1);
    const float shininess = 3.5;
    vec3 materialColor = decodeMaterial(material);
    return phongIllumination(K_a, K_d, K_s, shininess, p, nor, eye, materialColor);
}
