//Image

in vec4 gl_FragCoord;

/* screen dimensions */
#request uniform "screen" screen
uniform ivec2 screen;/* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */

void main(){
    
    vec2 uv=gl_FragCoord.xy/screen.xy;
    vec4 prevColor=texture(prev,uv);
    
    vec3 col=vec3(0.,.2039,.5804);//vec3(0.0, 0.1333, 0.4941) = Blue vec3(0.0, 0.4, 1.0) = Cyan  vec3(1.0, 0.451, 0.0) = Orange vec3(0.5686, 0.0, 0.0) = Red vec3(0.4353, 0.0, 1.0) = Magenta vec3(0.2353, 0.0, 0.4588) = Deep Purple vec3(0.0, 0.1569, 0.4471) = Deep Blue vec3(0.3647, 0.0, 0.5333) = Matte Purple vec3(0.1216, 0.0, 0.4549) = Royal Blue vec3(0.2118, 0.0, 0.4549) = Matte Violet vec3(0.0, 0.1216, 0.4549) = Demon Blue vec3(0.4549, 0.0, 0.098) = Crimson vec3(0.3686, 0.3686, 0.3686) = Silver vec3(.2314,0.,.5333)= Purple/Violet vec3(0.,.2235,.6392) = Ice Blue vec3(0.,.1922,.5451) = No-ice Blue
    fragment.xyz=prevColor.xyz*col*prevColor.w*1.7;
    fragment.w=prevColor.w;
    
    if(length(fragment.xyz-prevColor.xyz)/length(prevColor.xyz)>.81*length(fragment.xyz)){
        fragment.xyz*=.7;
        fragment.w*=.6;
    }
    
}