//Buffer A

in vec4 gl_FragCoord;
/* screen dimensions */
#request uniform "screen" screen
uniform ivec2 screen;/* screen dimensions */

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

#request timecycle 0

out vec4 fragment; /* output */

float pos=1/screen.x;
float audioRadius=max(smooth_audio(audio_r,audio_sz,.1),smooth_audio(audio_r,audio_sz,.15));
float audioFractal1=max(smooth_audio(audio_r,audio_sz,.8),smooth_audio(audio_r,audio_sz,.85));//.2
float audioFractal2=max(smooth_audio(audio_r,audio_sz,.9),smooth_audio(audio_r,audio_sz,.95));
float audioFractal3=max(smooth_audio(audio_r,audio_sz,.2),smooth_audio(audio_r,audio_sz,.25));
float audioFractal4=max(smooth_audio(audio_r,audio_sz,.3),smooth_audio(audio_r,audio_sz,.35));
float audioFractal5=max(smooth_audio(audio_r,audio_sz,.4),smooth_audio(audio_r,audio_sz,.45));
float audioFractal6=max(smooth_audio(audio_r,audio_sz,.5),smooth_audio(audio_r,audio_sz,.55));
float audioFractal7=max(smooth_audio(audio_r,audio_sz,.6),smooth_audio(audio_r,audio_sz,.65));
float audioFractal8=max(smooth_audio(audio_r,audio_sz,.7),smooth_audio(audio_r,audio_sz,.75));
//audio += 1 - (1 + sin(7. * audio)) / 2;

uniform float v=2.;//3.

uniform float displaceX=1.95,displaceY=1.9,displaceZ=1.905,flowX=.0,flowY=.016,flowZ=0.,flowEvolution=.01;//displaceX=1.25,displaceY=1.2,displaceZ=1.225 flowY=.017, evol=.00575

#define permute(x)mod(((x*34.)+1.)*x,289.)
#define taylorInvSqrt(r)1.79284291400159-.85373472095314*r
#define fade(t)t*t*t*(t*(t*6.-15.)+10.)

float cnoise(vec4 P,vec4 rep){
  vec4 Pi0=mod(floor(P),rep);// Integer part modulo rep
  vec4 Pi1=mod(Pi0+1.,rep);// Integer part + 1 mod rep
  vec4 Pf0=fract(P);// Fractional part for interpolation
  vec4 Pf1=Pf0-1.;// Fractional part - 1.0
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=vec4(Pi0.zzzz);
  vec4 iz1=vec4(Pi1.zzzz);
  vec4 iw0=vec4(Pi0.wwww);
  vec4 iw1=vec4(Pi1.wwww);
  
  vec4 ixy=permute(permute(ix)+iy);
  vec4 ixy0=permute(ixy+iz0);
  vec4 ixy1=permute(ixy+iz1);
  vec4 ixy00=permute(ixy0+iw0);
  vec4 ixy01=permute(ixy0+iw1);
  vec4 ixy10=permute(ixy1+iw0);
  vec4 ixy11=permute(ixy1+iw1);
  
  vec4 gx00=ixy00/7.;
  vec4 gy00=floor(gx00)/7.;
  vec4 gz00=floor(gy00)/6.;
  gx00=fract(gx00)-.5;
  gy00=fract(gy00)-.5;
  gz00=fract(gz00)-.5;
  vec4 gw00=vec4(.75)-abs(gx00)-abs(gy00)-abs(gz00);
  vec4 sw00=step(gw00,vec4(0.));
  gx00-=sw00*(step(0.,gx00)-.5);
  gy00-=sw00*(step(0.,gy00)-.5);
  
  vec4 gx01=ixy01/7.;
  vec4 gy01=floor(gx01)/7.;
  vec4 gz01=floor(gy01)/6.;
  gx01=fract(gx01)-.5;
  gy01=fract(gy01)-.5;
  gz01=fract(gz01)-.5;
  vec4 gw01=vec4(.75)-abs(gx01)-abs(gy01)-abs(gz01);
  vec4 sw01=step(gw01,vec4(0.));
  gx01-=sw01*(step(0.,gx01)-.5);
  gy01-=sw01*(step(0.,gy01)-.5);
  
  vec4 gx10=ixy10/7.;
  vec4 gy10=floor(gx10)/7.;
  vec4 gz10=floor(gy10)/6.;
  gx10=fract(gx10)-.5;
  gy10=fract(gy10)-.5;
  gz10=fract(gz10)-.5;
  vec4 gw10=vec4(.75)-abs(gx10)-abs(gy10)-abs(gz10);
  vec4 sw10=step(gw10,vec4(0.));
  gx10-=sw10*(step(0.,gx10)-.5);
  gy10-=sw10*(step(0.,gy10)-.5);
  
  vec4 gx11=ixy11/7.;
  vec4 gy11=floor(gx11)/7.;
  vec4 gz11=floor(gy11)/6.;
  gx11=fract(gx11)-.5;
  gy11=fract(gy11)-.5;
  gz11=fract(gz11)-.5;
  vec4 gw11=vec4(.75)-abs(gx11)-abs(gy11)-abs(gz11);
  vec4 sw11=step(gw11,vec4(0.));
  gx11-=sw11*(step(0.,gx11)-.5);
  gy11-=sw11*(step(0.,gy11)-.5);
  
  vec4 g0000=vec4(gx00.x,gy00.x,gz00.x,gw00.x);
  vec4 g1000=vec4(gx00.y,gy00.y,gz00.y,gw00.y);
  vec4 g0100=vec4(gx00.z,gy00.z,gz00.z,gw00.z);
  vec4 g1100=vec4(gx00.w,gy00.w,gz00.w,gw00.w);
  vec4 g0010=vec4(gx10.x,gy10.x,gz10.x,gw10.x);
  vec4 g1010=vec4(gx10.y,gy10.y,gz10.y,gw10.y);
  vec4 g0110=vec4(gx10.z,gy10.z,gz10.z,gw10.z);
  vec4 g1110=vec4(gx10.w,gy10.w,gz10.w,gw10.w);
  vec4 g0001=vec4(gx01.x,gy01.x,gz01.x,gw01.x);
  vec4 g1001=vec4(gx01.y,gy01.y,gz01.y,gw01.y);
  vec4 g0101=vec4(gx01.z,gy01.z,gz01.z,gw01.z);
  vec4 g1101=vec4(gx01.w,gy01.w,gz01.w,gw01.w);
  vec4 g0011=vec4(gx11.x,gy11.x,gz11.x,gw11.x);
  vec4 g1011=vec4(gx11.y,gy11.y,gz11.y,gw11.y);
  vec4 g0111=vec4(gx11.z,gy11.z,gz11.z,gw11.z);
  vec4 g1111=vec4(gx11.w,gy11.w,gz11.w,gw11.w);
  
  vec4 norm00=taylorInvSqrt(vec4(dot(g0000,g0000),dot(g0100,g0100),dot(g1000,g1000),dot(g1100,g1100)));
  g0000*=norm00.x;
  g0100*=norm00.y;
  g1000*=norm00.z;
  g1100*=norm00.w;
  
  vec4 norm01=taylorInvSqrt(vec4(dot(g0001,g0001),dot(g0101,g0101),dot(g1001,g1001),dot(g1101,g1101)));
  g0001*=norm01.x;
  g0101*=norm01.y;
  g1001*=norm01.z;
  g1101*=norm01.w;
  
  vec4 norm10=taylorInvSqrt(vec4(dot(g0010,g0010),dot(g0110,g0110),dot(g1010,g1010),dot(g1110,g1110)));
  g0010*=norm10.x;
  g0110*=norm10.y;
  g1010*=norm10.z;
  g1110*=norm10.w;
  
  vec4 norm11=taylorInvSqrt(vec4(dot(g0011,g0011),dot(g0111,g0111),dot(g1011,g1011),dot(g1111,g1111)));
  g0011*=norm11.x;
  g0111*=norm11.y;
  g1011*=norm11.z;
  g1111*=norm11.w;
  
  float n0000=dot(g0000,Pf0);
  float n1000=dot(g1000,vec4(Pf1.x,Pf0.yzw));
  float n0100=dot(g0100,vec4(Pf0.x,Pf1.y,Pf0.zw));
  float n1100=dot(g1100,vec4(Pf1.xy,Pf0.zw));
  float n0010=dot(g0010,vec4(Pf0.xy,Pf1.z,Pf0.w));
  float n1010=dot(g1010,vec4(Pf1.x,Pf0.y,Pf1.z,Pf0.w));
  float n0110=dot(g0110,vec4(Pf0.x,Pf1.yz,Pf0.w));
  float n1110=dot(g1110,vec4(Pf1.xyz,Pf0.w));
  float n0001=dot(g0001,vec4(Pf0.xyz,Pf1.w));
  float n1001=dot(g1001,vec4(Pf1.x,Pf0.yz,Pf1.w));
  float n0101=dot(g0101,vec4(Pf0.x,Pf1.y,Pf0.z,Pf1.w));
  float n1101=dot(g1101,vec4(Pf1.xy,Pf0.z,Pf1.w));
  float n0011=dot(g0011,vec4(Pf0.xy,Pf1.zw));
  float n1011=dot(g1011,vec4(Pf1.x,Pf0.y,Pf1.zw));
  float n0111=dot(g0111,vec4(Pf0.x,Pf1.yzw));
  float n1111=dot(g1111,Pf1);
  
  vec4 fade_xyzw=fade(Pf0);
  vec4 n_0w=mix(vec4(n0000,n1000,n0100,n1100),vec4(n0001,n1001,n0101,n1101),fade_xyzw.w);
  vec4 n_1w=mix(vec4(n0010,n1010,n0110,n1110),vec4(n0011,n1011,n0111,n1111),fade_xyzw.w);
  vec4 n_zw=mix(n_0w,n_1w,fade_xyzw.z);
  vec2 n_yzw=mix(n_zw.xy,n_zw.zw,fade_xyzw.y);
  float n_xyzw=mix(n_yzw.x,n_yzw.y,fade_xyzw.x);
  return 2.2*n_xyzw;
}

float octaveNoise(vec4 p,vec4 flow){
  float total=0.;
  const float persistence=.5;
  const float lacunarity=2.;
  float frequency=1.;
  float amplitude=1.;
  float value=0.;
  const int octaves=3;
  
  float audios[7]={audioFractal4,audioFractal5,1.3*audioFractal6,1.3*audioFractal7,1.3*audioFractal8,1.3*audioFractal1,1.3*audioFractal2};
  
  for(int i=0;i<3;i++)
  for(int j=i;j<7;j++)
  if(audios[i]<audios[j])
  {
    float temp=audios[i];
    audios[i]=audios[j];
    audios[j]=temp;
  }
  
  const float finalAudio=.6*max(0.,1.50802*(audios[0]-.04))*(max(1.,2.0802*(audios[1])))*(max(1.,3.4802*(audios[2])));//2.0802, 2.4802
  
  //  float finalAudio=max(0.,2.2802*audios[1])*max(1.,clamp(100.,.15,3.7802*audios[2])-.15);
  
  for(int i=0;i<octaves;i+=1){
    
    value+=.67*finalAudio*cnoise(vec4((p+flow*time)*frequency),vec4(0))*amplitude;
    
    //flowY=.015
    // value+=.4*min((audios[0]+.8802*audios[1]+.8802*audios[2]),4.8)*cnoise(vec4((p+flow*time)*frequency),vec4(0))*amplitude;
    total+=amplitude;
    
    amplitude*=persistence;
    frequency*=lacunarity;
  }
  return value/total;
}

float fbm3(vec4 p,float disp,vec4 flow){
  
  float perlinVal=0;
  float scale=1.,offset=0.,multiplier=1.;//scale=1.
  perlinVal=offset+multiplier*octaveNoise(scale*p,flow);
  return disp*perlinVal;
}

void main(){
  vec4 r=vec4(0);
  
  for(int j=0;j<30;j++){
    r.xy=floor(gl_FragCoord.xy/v)*v/screen.xy;//hash44(vec4(floor(i/v),0,j));
    if(length(r-.5)<.5)
    break;
  }
  
  fragment.xyz=r.xyz*2.-1.;
  fragment.w=0;
  fragment.z=(fragment.z+1.)/2.;
  
  fragment.xyz+=vec3(fbm3(fragment.xyzw,displaceX,vec4(flowX,flowY,flowZ,flowEvolution)),fbm3(fragment.yzxw,displaceY,vec4(flowY,flowZ,flowX,flowEvolution)),fbm3(fragment.zxyw,displaceZ,vec4(flowZ,flowX,flowY,flowEvolution)));
  
  float radius=1.35;//1.175
  radius+=.7*abs((audioRadius));
  radius=min(radius,1.65);
  vec3 deltaPos=vec3(radius*(1-smoothstep(-.01,radius+.1755,length(fragment.xyz)))*normalize(fragment.xyz));
  fragment.xyz+=deltaPos;
  fragment.w=.75*pow(length((radius)*normalize(fragment.xyz)-deltaPos),5);
  
  if(fragment.z<.5)
  fragment.w+=3.5*pow(length((radius)*normalize(fragment.xyz)-fragment.xyz),.55);
  
  fragment.xyzw=.5+fragment.xyzw/3.81*vec4(screen.y/screen.x,1,1,1);
  
}