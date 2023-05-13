//Buffer D_1

in vec4 gl_FragCoord;

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
        vec4 r=hash44(vec4(gl_FragCoord.xy,0,a));
        vec4 p=texture(prev,r.xy);
        float l=length(p.xy*screen.xy-gl_FragCoord.xy);
        if(l<length(fragment.zw*screen.xy-gl_FragCoord.xy)){
            fragment.zw=p.xy;
            fragment.xy=p.zw;
        }
        
    }
}