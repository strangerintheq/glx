#pragma import ../glsl/sdf/sdBox.glsl
#pragma import ../glsl/sdf/sdPlane.glsl

// menger sponge
vec3 sponge( in vec3 p ){
   float d = sdBox(p,vec3(1.0));
   vec3 res = vec3( d, 1.0, 0.0 );
   float s = 1.;
   for( int m=0; m<4; m++ ) {
      vec3 a = mod( p*s, 2.0 )-1.0;
      vec3 r = abs(1.0 - 3.0*abs(a));
      s *= 3.0;
      float da = max(r.x,r.y);
      float db = max(r.y,r.z);
      float dc = max(r.z,r.x);
      float c = (min(da,min(db,dc))-1.0)/s;
      if( c>d ) {
          d = c;
          res = vec3( d, 0.2*da*db*dc, (1.0+float(m))/4.0);
      }
   }
   return res;
}

vec2 u(vec2 a, vec2 b) {
    return a.x < b.x ? a : b;
}

vec2 map(vec3 p) {
//    vec3 repeat = vec3(5.,0.,0.);
//    p = mod(p, repeat)-0.5*repeat;
    vec3 sp = sponge(p);
    vec2 res = vec2(sp.x, abs(sp.y - sp.z));
    res = u(res, vec2(sdPlane(p, -1.5), 0.));
    return res;
}
