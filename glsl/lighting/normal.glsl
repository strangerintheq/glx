// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
const float NORMAL_EPSILON = 0.0005;
vec3 estimateNormal(vec3 pos) {
    vec2 e = vec2(1.0,-1.0)*0.5773*NORMAL_EPSILON;
    return normalize( e.xyy*map( pos + e.xyy ).x +
					  e.yyx*map( pos + e.yyx ).x +
					  e.yxy*map( pos + e.yxy ).x +
					  e.xxx*map( pos + e.xxx ).x );
}
