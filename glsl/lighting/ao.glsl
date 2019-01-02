// ambient occlusion
float ao( vec3 pos, vec3 nor, float power ) {
	float occ = 0.0;
    float sca = 1.0;
    for( int i = 0; i < 5; i++ ) {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= power;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );
}

float ao(vec3 pos, vec3 nor) {
    return ao(pos, nor, 0.91);
}
