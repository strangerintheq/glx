// http://iquilezles.org/www/articles/rmshadows/rmshadows.htm
float softShadow( in vec3 ro, in vec3 rd, in float mint, in float tmax ) {
	float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ ) {
		float h = map( ro + rd*t ).x;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( res<0.005 || t>tmax )
            break;
    }
    return clamp( res, 0.0, 1.0 );
}