// distance to bezier curve
float det( vec2 a, vec2 b ) {
     return a.x*b.y-b.x*a.y;
}
vec3 getClosest( vec2 b0, vec2 b1, vec2 b2 ) {
     float a = det(b0,b2);
     float b = det(b1,b0)*2.;
     float d = det(b2,b1)*2.;
     float f = b*d - a*a;
     vec2 d21 = b2-b1;
     vec2 d10 = b1-b0;
     vec2 d20 = b2-b0;
     vec2 gf = 2.0*(b*d21+d*d10+a*d20); gf = vec2(gf.y,-gf.x);
     vec2 pp = -f*gf/dot(gf,gf);
     vec2 d0p = b0-pp;
     float ap = det(d0p,d20);
     float bp = 2.0*det(d10,d0p);
     float t = clamp( (ap+bp)/(2.0*a+b+d), 0.0 ,1.0 );
     return vec3( mix(mix(b0,b1,t), mix(b1,b2,t),t), t );
}
vec2 sdBezier( vec3 a, vec3 b, vec3 c, vec3 p, float thickness ) {
     vec3 w = normalize( cross( c-b, a-b ) );
     vec3 u = normalize( c-b );
     vec3 v = normalize( cross( w, u ) );
     vec2 a2 = vec2( dot(a-b,u), dot(a-b,v) );
     vec2 b2 = vec2( 0.0 );
     vec2 c2 = vec2( dot(c-b,u), dot(c-b,v) );
     vec3 p3 = vec3( dot(p-b,u), dot(p-b,v), dot(p-b,w) );
     vec3 cp = getClosest( a2-p3.xy, b2-p3.xy, c2-p3.xy );
     return vec2( 0.85*(sqrt(dot(cp.xy,cp.xy)+p3.z*p3.z) - thickness), cp.z );
}
