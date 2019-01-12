// raymarching core
// vec3 ro - ray origin
// vec3 rd - ray direction
vec2 castRay( vec3 ro, vec3 rd, float tmin, float tmax, float t ) {

    float m = -1.0;

    for ( int i=0; i<64; i++ ) {
	    float precis = 0.0001*t;
	    vec2 res = map( ro+rd*t );
        if ( res.x<precis || t>tmax ) {
            break;
        }
        t += res.x*0.5;
	    m = res.y;
    }

    if ( t>tmax ) {
        m =- 1.0;
    }

    return vec2( t, m );
}
