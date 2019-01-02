// signed distance field to plane

// horizontal
float sdPlane( vec3 p , float down){
	return p.y - down;
}

// custom rotation
float sdPlane(vec3 p, vec3 n, float offs) {
    return dot(p, n) - offs;
}
