//Image

in vec4 gl_FragCoord;

/* screen dimensions */
#request uniform "screen" screen
uniform ivec2 screen;/* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */
vec3 getAvgColorAround(vec2 uv){
    vec3 col=texture(prev,uv).xyz;
    //return col;
    for(int i=-5;i<5;i++)for(int j=-5;j<5;j++)
    col+=texture(prev,vec2(uv.x+float(i)/screen.x,uv.y+float(j)/screen.y)).xyz;
    
    if(length(col)>0)
    {
        col.x=max(45.,col.x);
        col.y=max(45.,col.y);
        col.z=max(45.,col.z);
    }
    
    return col/81;
}
vec4 texture2DAA(sampler2D tex,vec2 uv){
    vec2 texsize=vec2(textureSize(tex,0));
    vec2 uv_texspace=uv*texsize;
    vec2 seam=floor(uv_texspace+.5);
    uv_texspace=(uv_texspace-seam)/fwidth(uv_texspace)+seam;
    uv_texspace=clamp(uv_texspace,seam-.5,seam+.5);
    return texture(tex,uv_texspace/texsize);
}

void main(){
    
    vec2 uv=gl_FragCoord.xy/screen.xy;
    vec4 prevColor=texture(prev,uv);
    
    //vec3(0.0667, 0.0314, 0.2667);
    vec3 col=vec3(.0314,.1529,.6863);//vec3(0.0, 0.1333, 0.4941) = Blue vec3(0.0, 0.4, 1.0) = Cyan  vec3(1.0, 0.451, 0.0) = Orange vec3(0.5686, 0.0, 0.0) = Red vec3(0.4353, 0.0, 1.0) = Magenta vec3(0.2353, 0.0, 0.4588) = Deep Purple vec3(0.0, 0.1569, 0.4471) = Deep Blue vec3(0.3647, 0.0, 0.5333) = Matte Purple vec3(0.1216, 0.0, 0.4549) = Royal Blue vec3(0.2118, 0.0, 0.4549) = Matte Violet vec3(0.0, 0.1216, 0.4549) = Demon Blue vec3(0.4549, 0.0, 0.098) = Crimson vec3(0.3686, 0.3686, 0.3686) = Silver vec3(.2314,0.,.5333)= Purple/Violet vec3(0.,.2235,.6392) = Ice Blue vec3(0.,.1922,.5451) = No-ice Blue vec3(.1255,.2078,.6667) = Blue2
    
    fragment.xyz=(getAvgColorAround(uv).xyz)*col*prevColor.w*1.;
    fragment.w=prevColor.w;
    
    //fragment.xyz=prevColor.xyz*col*prevColor.w*1.7;
    
    // if(length(fragment.xyz-prevColor.xyz)/length(prevColor.xyz)<.81*length(fragment.xyz)){
        //     fragment.xyz*=1.47;//.7
        //     fragment.w*=1.36;//.6
    // }
    
}