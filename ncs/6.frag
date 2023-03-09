//Buffer C

//layout(pixel_center_integer) in vec4 gl_FragCoord;

#request uniform "screen" screen
uniform ivec2 screen; /* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */

int i2 = 9;

float glow(float x, float str, float dist) {
    return dist + dist / pow(x, str);
}

vec4 hash44(vec4 p4) {

    p4 = fract(p4 * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

void main() {
    vec2 uv = gl_FragCoord.xy / screen.xy;
    fragment = vec4(0);

    for(int a = 0; a < i2; a++) {
        vec4 r = hash44(vec4(gl_FragCoord.xy, 0, a));//Transform this uniform random into a normal distribution
        r.z = sqrt(-2. * log(r.z));
        r.w *= 6.28318;
        r.zw = r.z * vec2(cos(r.w), sin(r.w));
        vec4 p = texture(prev, (gl_FragCoord.xy) / screen.xy);//sample random nearby points

      //  fragment.xy = vec2(4000000. / (exp(15. * length(p.xy * screen.xy - gl_FragCoord.xy))));
       // fragment.xy = vec2((glow(length(fragment.xy), 58.90, 8.002)));
        if(length(fragment.xyz) > 0.01){
            fragment.w += .05;

        fragment.xyz+=1*vec3((glow(length(fragment.xyzw), 5.90, 8.002)));
      // fragment.xyzw*=30.4;
        }else fragment.w=0.;
       //  fragment.x=((glow(length(fragment.xy), 512.90, -120.002)));
        //float coeff = min(1. / length(uv - .5), .06) * 80.;
        float coeff = min(1. / abs(length(uv - .5)), .06) *180.;  //120
     
        coeff=smoothstep(.38,.3,fragment.w*length(uv-.5))*coeff/160*80;
       // coeff = 5.6;
        //fragment += 1.5 / (1. + exp(max(length(uv - .5), .3) * 11. * length(p.xy * screen.xy - gl_FragCoord.xy)));
     
        fragment.xyzw += 30.5 / (1. + exp(coeff * length(p.xy * screen.xy - gl_FragCoord.xy)));

    }

    fragment.xyz /= fragment.w;
}