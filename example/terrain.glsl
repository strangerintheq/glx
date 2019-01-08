precision mediump float;

// return smoothstep and its derivative
vec2 smoothstepd( float a, float b, float x) {
	if( x<a ) return vec2( 0.0, 0.0 );
	if( x>b ) return vec2( 1.0, 0.0 );
    float ir = 1.0/(b-a);
    x = (x-a)*ir;
    return vec2( x*x*(3.0-2.0*x), 6.0*x*(1.0-x)*ir );
}

float hash1( vec2 p ) {
    p  = 50.0*fract( p*0.3183099 );
    return fract( p.x*p.y*(p.x+p.y) );
}

float hash1( float n ) {
    return fract( n*17.0*fract( n*0.3183099 ) );
}

vec2 hash2( float n ) { return fract(sin(vec2(n,n+1.0))*vec2(43758.5453123,22578.1459123)); }


vec2 hash2( vec2 p ) {
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    p = p*k + k.yx;
    return fract( 16.0 * k*fract( p.x*p.y*(p.x+p.y)) );
}

// value noise, and its analytical derivatives
vec4 noised( in vec3 x ) {
    vec3 p = floor(x);
    vec3 w = fract(x);

    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);

    float n = p.x + 317.0*p.y + 157.0*p.z;

    float a = hash1(n+0.0);
    float b = hash1(n+1.0);
    float c = hash1(n+317.0);
    float d = hash1(n+318.0);
    float e = hash1(n+157.0);
	float f = hash1(n+158.0);
    float g = hash1(n+474.0);
    float h = hash1(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return vec4( -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z),
                      2.0* du * vec3( k1 + k4*u.y + k6*u.z + k7*u.y*u.z,
                                      k2 + k5*u.z + k4*u.x + k7*u.z*u.x,
                                      k3 + k6*u.x + k5*u.y + k7*u.x*u.y ) );
}

float noise( in vec3 x ) {
    vec3 p = floor(x);
    vec3 w = fract(x);

    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);

    float n = p.x + 317.0*p.y + 157.0*p.z;

    float a = hash1(n+0.0);
    float b = hash1(n+1.0);
    float c = hash1(n+317.0);
    float d = hash1(n+318.0);
    float e = hash1(n+157.0);
	float f = hash1(n+158.0);
    float g = hash1(n+474.0);
    float h = hash1(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z);
}

vec3 noised( in vec2 x ) {
    vec2 p = floor(x);
    vec2 w = fract(x);

    vec2 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec2 du = 30.0*w*w*(w*(w-2.0)+1.0);

    float a = hash1(p+vec2(0,0));
    float b = hash1(p+vec2(1,0));
    float c = hash1(p+vec2(0,1));
    float d = hash1(p+vec2(1,1));

    float k0 = a;
    float k1 = b - a;
    float k2 = c - a;
    float k4 = a - b - c + d;

    return vec3( -1.0+2.0*(k0 + k1*u.x + k2*u.y + k4*u.x*u.y),
                      2.0* du * vec2( k1 + k4*u.y,
                                      k2 + k4*u.x ) );
}

float noise( in vec2 x ) {
    vec2 p = floor(x);
    vec2 w = fract(x);
    vec2 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    float a = hash1(p+vec2(0,0));
    float b = hash1(p+vec2(1,0));
    float c = hash1(p+vec2(0,1));
    float d = hash1(p+vec2(1,1));
    return -1.0+2.0*( a + (b-a)*u.x + (c-a)*u.y + (a - b - c + d)*u.x*u.y );
}

const mat3 m3  = mat3( 0.00,  0.80,  0.60,
                      -0.80,  0.36, -0.48,
                      -0.60, -0.48,  0.64 );
const mat3 m3i = mat3( 0.00, -0.80, -0.60,
                       0.80,  0.36, -0.48,
                       0.60, -0.48,  0.64 );
const mat2 m2 = mat2(  0.80,  0.60,
                      -0.60,  0.80 );
const mat2 m2i = mat2( 0.80, -0.60,
                       0.60,  0.80 );

vec4 fbmd_8( in vec3 x ) {
    float f = 1.92;
    float s = 0.5;
    float a = 0.0;
    float b = 0.5;
    vec3  d = vec3(0.0);
    mat3  m = mat3(1.0,0.0,0.0,
                   0.0,1.0,0.0,
                   0.0,0.0,1.0);
    for( int i=0; i<7; i++ ) {
        vec4 n = noised(x);
        a += b*n.x;          // accumulate values
        d += b*m*n.yzw;      // accumulate derivatives
        b *= s;
        x = f*m3*x;
        m = f*m3i*m;
    }
	return vec4( a, d );
}

float fbm_9( in vec2 x ) {
    float f = 1.9;
    float s = 0.55;
    float a = 0.0;
    float b = 0.5;
    for( int i=0; i<9; i++ ) {
        float n = noise(x);
        a += b*n;
        b *= s;
        x = f*m2*x;
    }
	return a;
}

vec3 fbmd_9( in vec2 x ) {
    float f = 1.9;
    float s = 0.55;
    float a = 0.0;
    float b = 0.5;
    vec2  d = vec2(0.0);
    mat2  m = mat2(1.0,0.0,0.0,1.0);
    for( int i=0; i<9; i++ ) {
        vec3 n = noised(x);
        a += b*n.x;          // accumulate values
        d += b*m*n.yz;       // accumulate derivatives
        b *= s;
        x = f*m2*x;
        m = f*m2i*m;
    }
	return vec3( a, d );
}

const vec3  kSunDir = vec3(-0.624695,0.468521,-0.624695);
const float kMaxTreeHeight = 2.0;

vec2 terrainMap( in vec2 p ) {
    const float sca = 0.0010;
    const float amp = 300.0;

    p *= sca;
    float e = fbm_9( p + vec2(1.0,-2.0) );
    float a = 1.0-smoothstep( 0.12, 0.13, abs(e+0.12) ); // flag high-slope areas (-0.25, 0.0)
    e = e + 0.15*smoothstep( -0.08, -0.01, e );
    e *= amp;
    return vec2(e,a);
}

vec4 terrainMapD( in vec2 p ) {
	const float sca = 0.0010;
    const float amp = 300.0;
    p *= sca;
    vec3 e = fbmd_9( p + vec2(1.0,-2.0) );
    vec2 c = smoothstepd( -0.08, -0.01, e.x );
	e.x = e.x + 0.15*c.x;
	e.yz = e.yz + 0.15*c.y*e.yz;
    e.x *= amp;
    e.yz *= amp*sca;
    return vec4( e.x, normalize( vec3(-e.y,1.0,-e.z) ) );
}

vec3 terrainNormal( in vec2 pos ) {
    return terrainMapD(pos).yzw;
}

float terrainShadow( in vec3 ro, in vec3 rd, in float mint ) {
    float res = 1.0;
    float t = mint;
    for( int i=0; i<128; i++ ) {
        vec3  pos = ro + t*rd;
        vec2  env = terrainMap( pos.xz );
        float hei = pos.y - env.x;
        res = min( res, 32.0*hei/t );
        if( res<0.0001 ) break;
        t += clamp( hei, 0.5+t*0.05, 25.0 );
    }

    return clamp( res, 0.0, 1.0 );
}

vec2 raymarchTerrain( in vec3 ro, in vec3 rd, float tmin, float tmax ) {

    float dis, th;
    float t2 = -1.0;
    float t = tmin;
    float ot = t;
    float odis = 0.0;
    float odis2 = 0.0;
    for( int i=0; i<400; i++ ) {
        th = 0.001*t;

        vec3  pos = ro + t*rd;
        vec2  env = terrainMap( pos.xz );
        float hei = env.x;

        // tree envelope
        float dis2 = pos.y - (hei+kMaxTreeHeight*1.1);
        if( dis2<th ) {
            if( t2<0.0 ) {
                t2 = ot + (th-odis2)*(t-ot)/(dis2-odis2); // linear interpolation for better accuracy
            }
        }
        odis2 = dis2;

        // terrain
        dis = pos.y - hei;
        if( dis<th ) break;

        ot = t;
        odis = dis;
        t += dis*0.8*(1.0-0.75*env.y); // slow down in step areas
        if( t>tmax ) break;
    }

    if( t>tmax ) t = -1.0;
    else t = ot + (th-odis)*(t-ot)/(dis-odis); // linear interpolation for better accuracy
    return vec2(t,t2);
}

vec4 renderTerrain( in vec3 ro, in vec3 rd, in vec2 tmima, out float teShadow, out vec2 teDistance, inout float resT ) {
    vec4 res = vec4(0.0);
    teShadow = 0.0;
    teDistance = vec2(0.0);

    vec2 t = raymarchTerrain( ro, rd, tmima.x, tmima.y );
    if( t.x>0.0 ) {
        vec3 pos = ro + t.x*rd;
        vec3 nor = terrainNormal( pos.xz );

        // bump map
        nor = normalize( nor + 0.8*(1.0-abs(nor.y))*0.8*fbmd_8( pos*0.3*vec3(1.0,0.2,1.0) ).yzw );

        vec3 col = vec3(0.18,0.11,0.10)*.75;
        col = 1.0*mix( col, vec3(0.1,0.1,0.0)*0.3, smoothstep(0.7,0.9,nor.y) );

        float sha = 0.0;
        float dif =  clamp( dot( nor, kSunDir), 0.0, 1.0 );
        if( dif>0.0001 )
        {
            sha = terrainShadow( pos+nor*0.01, kSunDir, 0.01 );
            dif *= sha;
        }
        vec3  ref = reflect(rd,nor);
    	float bac = clamp( dot(normalize(vec3(-kSunDir.x,0.0,-kSunDir.z)),nor), 0.0, 1.0 )*clamp( (pos.y+100.0)/100.0, 0.0,1.0);
        float dom = clamp( 0.5 + 0.5*nor.y, 0.0, 1.0 );
        vec3  lin  = 1.0*0.2*mix(0.1*vec3(0.1,0.2,0.0),vec3(0.7,0.9,1.0),dom);
              lin += 1.0*5.0*vec3(1.0,0.9,0.8)*dif;
              lin += 1.0*0.35*vec3(1.0)*bac;

	    col *= lin;

        teShadow = sha;
        teDistance = t;
        res = vec4( col, 1.0 );
        resT = t.x;
    }

    return res;
}

#pragma import ../glsl/core/worldDir.glsl


uniform vec2 resolution;
uniform vec3 eye;
uniform vec3 lookAt;
uniform vec3 lightPos;
uniform float time;

void main(void) {
	float resT = 1000.0;
    vec3 col;
    vec2 teDistance;
    float teShadow;
    vec3 rd = worldDir(60., resolution, eye, lookAt);
    vec4 res = renderTerrain( eye, rd,  vec2(1.0,10000.0), teShadow, teDistance, resT );
    gl_FragColor = vec4((1.0-res.w) + res.xyz, 1.0);
}
