
// compute view matrix
mat4 viewMatrix(vec3 eye, vec3 center, vec3 up) {
	vec3 f = normalize(center - eye);
	vec3 s = normalize(cross(f, up));
	vec3 u = cross(s, f);
	return mat4(
		vec4(s, 0.0),
		vec4(u, 0.0),
		vec4(-f, 0.0),
		vec4(0.0, 0.0, 0.0, 1)
	);
}

mat4 viewMatrix(vec3 eye, vec3 center) {
	return viewMatrix(eye, center, vec3(0.0, 1.0, 0.0));
}

// ray direction
vec3 rayDirection(float fieldOfView, vec2 size) {
    vec2 xy = gl_FragCoord.xy - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

// calculate werld related view direction
vec3 worldDir(float fov, vec2 reslution, vec3 eye, vec3 lookAt) {
	vec3 direction = rayDirection(fov, resolution);
    mat4 viewToWorld = viewMatrix(eye, lookAt);
    return (viewToWorld * vec4(direction, 0.0)).xyz;
}