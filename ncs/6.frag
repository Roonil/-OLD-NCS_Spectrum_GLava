//Buffer C

//layout(pixel_center_integer) in vec4 gl_FragCoord;
/* screen dimensions */
#request uniform "screen" screen
uniform ivec2 screen;/* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */

vec4 hash44(vec4 p4){
    p4=fract(p4*vec4(.1031,.1030,.0973,.1099));
    p4+=dot(p4,p4.wzxy+19.19);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

void main(){
    vec2 uv=gl_FragCoord.xy/screen.xy;
    fragment=vec4(0);
    vec4 p=texture(prev,(gl_FragCoord.xy)/screen.xy);
    
    float len=length(p.xy*screen.xy-gl_FragCoord.xy);
    
    float coeff;
    
    if(abs(p.z)<=.6&&abs(p.z)>=.42)//<= for +ve z, >= for -ve
    coeff=2.5;
    else{
        coeff=4.27;
        p.z+=.075;
        
    }
    
    const float a=(3.5/(1.+exp(coeff*length(len)*.325)));
    const float b=max(.1,((p.w-.4)*(p.z-.15)));
    
    fragment.xyz+=45*vec3(a);
    fragment.w=a*b*(pow(b,45.)-1.)/(b-1);
    
    fragment.xyz*=fragment.w;
}