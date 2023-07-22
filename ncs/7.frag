//Image

in vec4 gl_FragCoord;

/* screen dimensions */
#request uniform "screen" screen
uniform ivec2 screen;/* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */
vec4 getAvgColorAround(vec2 uv){
    vec4 col=texture(prev,uv).xyzw;
    //return col;
    for(int i=-5;i<5;i++)for(int j=-5;j<5;j++)
    {
        vec4 temp=texture(prev,vec2(uv.x+float(i)/screen.x,uv.y+float(j)/screen.y));
        col.xyz+=temp.xyz;
        col.w+=temp.w;
    }
    
    if(length(col)>0)
    {
        col.x=max(45.,col.x);
        col.y=max(45.,col.y);
        col.z=max(45.,col.z);
    }
    
    return col/81;
}

void main(){
    
    vec2 uv=gl_FragCoord.xy/screen.xy;
    vec4 prevColor=texture(prev,uv);
    
    fragment.xyzw=getAvgColorAround(uv);
    fragment.xyz*=prevColor.w;
}