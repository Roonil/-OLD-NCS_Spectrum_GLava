//Buffer C

//layout(pixel_center_integer) in vec4 gl_FragCoord;
/* screen dimensions */
#request uniform "screen" screen
uniform ivec2 screen;/* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */

int i2=1;

float glow(float x,float str,float dist){
    return dist+dist/pow(x,str);
}

vec4 hash44(vec4 p4){
    p4=fract(p4*vec4(.1031,.1030,.0973,.1099));
    p4+=dot(p4,p4.wzxy+19.19);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

void main(){
    vec2 uv=gl_FragCoord.xy/screen.xy;
    fragment=vec4(0);
    vec4 p=texture(prev,(gl_FragCoord.xy)/screen.xy);
    
    <<<<<<<HEAD
    for(int a=0;a<i2;a++){
        vec4 r=hash44(vec4(gl_FragCoord.xy,0,a));//Transform this uniform random into a normal distribution
        r.z=sqrt(-2.*log(r.z));
        r.w*=6.28318;
        r.zw=r.z*vec2(cos(r.w),sin(r.w));
        vec4 p=texture(prev,(gl_FragCoord.xy)/screen.xy);//sample random nearby points
        float width=1.;
        float len=length(p.xy*screen.xy-gl_FragCoord.xy);
        if(length(fragment.xyz)>39.2){
            fragment.w+=.05;
            fragment.xyz+=1*vec3((glow(length(fragment.xyzw),5.90,8.002)));
            
            //width=1;
        }else{fragment.w=0.;width=1.;}
        
        float coeff=min(1./abs(length(uv-.5)),.06)*50.;//120
        
        fragment.xyzw+=3.5/(1.+exp(coeff*length(len)/width*.325));
        // fragment.xyz=fragment.xyz/width*.5;
    }
    =======
    float len=length(p.xy*screen.xy-gl_FragCoord.xy);
    >>>>>>>0e09aee(Added depth,fixed feathering of circle)
    
    float coeff;
    
    if(abs(p.z)<=.58&&abs(p.z)>=.4)//<= for +ve z, >= for -ve
    coeff=2.9;
    else coeff=6.27;
    const float a=(3.5/(1.+exp(coeff*length(len)*.325)));
    const float b=(1*(p.z+.5))/2;
    fragment.xyz+=45*vec3(a);
    fragment.w=a*b*(pow(b,45.)-1.)/(b-1);
    
    fragment.xyz*=fragment.w;
}