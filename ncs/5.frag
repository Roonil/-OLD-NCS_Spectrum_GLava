//Buffer B_2

//layout(pixel_center_integer) in vec4 gl_FragCoord;

/* screen dimensions */
#request uniform "screen" screen
uniform ivec2 screen;/* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */

int i1=90;

vec4 hash44(vec4 p4){
    
    p4=fract(p4*vec4(.1031,.1030,.0973,.1099));
    p4+=dot(p4,p4.wzxy+19.19);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

void main(){
    fragment=vec4(0);
    
    for(int a=0;a<i1;a++){
        vec4 r=hash44(vec4(gl_FragCoord.xy,a,0.));
        r.z=sqrt(-2.*log(r.z));
        r.w*=6.28318;
        r.zw=r.z*vec2(cos(r.w),sin(r.w))*3.;
        vec4 p=texture(prev,(gl_FragCoord.xy+r.zw)/screen.xy);//sample random nearby points
        float l=length(p.zw*screen.xy-gl_FragCoord.xy);
        if(l<length(fragment.xy*screen.xy-gl_FragCoord.xy)){
            fragment.xy=p.zw;
            fragment.zw=p.xy;
            
        }
    }
    
}