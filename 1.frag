//Buffer A

in vec4 gl_FragCoord;

#request uniform "screen" screen
uniform ivec2 screen; /* screen dimensions */

#request uniform "audio_sz" audio_sz
uniform int audio_sz;

#include ":util/smooth.glsl"

#request uniform "audio_l" audio_l
#request transform audio_l "window"
#request transform audio_l "fft"
#request transform audio_l "gravity"
#request transform audio_l "avg"
uniform sampler1D audio_l;

#request uniform "audio_r" audio_r
#request transform audio_r "window"
#request transform audio_r "fft"
#request transform audio_r "gravity"
#request transform audio_r "avg"
uniform sampler1D audio_r;

#request uniform "time" time
uniform float time;

#request timecycle 24000

out vec4 fragment; /* output */

float pos = 1 / screen.x;
float audioRadius = smooth_audio(audio_r, audio_sz, .1);
float audioDisperse1 = smooth_audio(audio_r, audio_sz, .8);  //.2
float audioDisperse2 = smooth_audio(audio_r, audio_sz, .9);
float audioDisperse3 = smooth_audio(audio_r, audio_sz, .4);
float audioFractal1 = smooth_audio(audio_r, audio_sz, .5);
float audioFractal2 = smooth_audio(audio_r, audio_sz, .6);
float audioFractal3 = smooth_audio(audio_r, audio_sz, .7);
float audioFractal4 = smooth_audio(audio_r, audio_sz, .8);
float audioFractal = (smooth_audio(audio_r, audio_sz, .6) + smooth_audio(audio_r, audio_sz, .5)+smooth_audio(audio_r, audio_sz, .7)); //.6
//audio += 1 - (1 + sin(7. * audio)) / 2;

int MOD = 1;  // type of Perlin noise
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))
#define PI 3.1428579
float v = 2.; //3.
#define hash31(p) fract(sin(dot(p,vec3(127.1,311.7, 74.7)))*43758.5453123)
float noise3(vec3 p) {
    
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3. - 2. * f); // smoothstep

    float v = mix(mix(mix(hash31(i + vec3(0, 0, 0)), hash31(i + vec3(1, 0, 0)), f.x), mix(hash31(i + vec3(0, 1, 0)), hash31(i + vec3(1, 1, 0)), f.x), f.y), mix(mix(hash31(i + vec3(0, 0, 1)), hash31(i + vec3(1, 0, 1)), f.x), mix(hash31(i + vec3(0, 1, 1)), hash31(i + vec3(1, 1, 1)), f.x), f.y), f.z);
    
    return MOD == 0 ? v : MOD == 1 ? 2. * v - 1. : MOD == 2 ? abs(2. * v - 1.) : 1. - abs(2. * v - 1.);
}

float fbm3(vec3 p,float disp,float flow) {

    float perlinVal = noise3(p+flow*time), maxDisp =(audioFractal1+audioFractal2+audioFractal3)*disp;
    //maxDisp=.20*disp;  //4.50
   
    return maxDisp * perlinVal;

}

void main() {
    vec4 r = vec4(0);
    for(int j = 0; j < 30; j++) {
        r.xy = floor(gl_FragCoord.xy / v) * v / screen.xy;//hash44(vec4(floor(i/v),0,j));
        if(length(r - .5) < .5)
            break;
    }
    
    fragment.xyz = r.xyz * 2. - 1.;
   
    float t = .015 * time, K = 2.5, S = 2.+.5*(audioDisperse1+audioDisperse2);
   


   // fragment.xyz += vec3(fbm3(vec3(S * fragment.xy, t * 2.)), fbm3(vec3(S * fragment.xz, t * 3.)), fbm3(vec3(S * fragment.yz, t))) / S;
    
    fragment.xyz += vec3(fbm3(vec3(S * (fragment.xyz)),2.,0.00), fbm3(vec3(S * vec3(fragment.yxz)),2.,.03), fbm3(vec3(S * vec3(.9)),2.,0)) / S; //1.25
    
  
   // fragment.xyz += vec3(fbm3(S * fragment.xyz)) / S;
   // fragment.xy/=length(fragment.xyz)*.82;
    fragment.z = (fragment.z + 1.) / 2.;
   
    float radius = 3.2; //7.85

    //radius = smoothstep(radius, radius - 1., length(fragment.xy));
   // radius += 1.3 - (1 - sin(2. * audio));
    radius += 1.5*abs((audioRadius));
   if(length(fragment.xyz) < radius) {

    fragment.xyz = radius * smoothstep(6.5, -.05, length(fragment.xyz)) * normalize(fragment.xyz);
  // fragment.xyz = radius * normalize(fragment.xyz);
    //fragment.xy *= rot(PI / 2);
    } 
    fragment.xy = .5 + fragment.xy / 7.4 * vec2(screen.y/screen.x, 1);
    //}else fragment=vec4(-2);
    
    
}