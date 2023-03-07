//Image

in vec4 gl_FragCoord;

#request uniform "screen" screen
uniform ivec2 screen; /* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */

vec3 getAvgColorAround(vec2 uv){
     vec3 col = texture(prev, uv).xyz;
  //return col;
    for(int i = -5; i < 5; i++) for(int j = -5; j < 5; j++) 
            col += texture(prev, vec2(uv.x + float(i) / 30, uv.y + float(j) / 30.)).xyz;

    if (length(col)>0)
    {
        col.x=max(45.,col.x);
        col.y=max(45.,col.y);
        col.z=max(45.,col.z);
    }

    return col/81;
}
vec3 smoothen(vec2 uv) {

    vec3 col = texture(prev, uv).xyz;
 // return col;
   // for(int i = -5; i < 5; i++) for(int j = -5; j < 5; j++) {
    int i=4,j=4;
            vec3 colNew = texture(prev, vec2(uv.x + float(i) / 700, uv.y + float(j) / 700.)).xyz;
            if (colNew.x<.5)
            col.x=.5;
            else col.x=1.;
            if (colNew.y<.5)
            col.y=.5;
            else col.y=1.;
            if (colNew.z<.5)
            col.z=.5;
            else col.z=1.;
       // }
    return col;

}

void main() {
    
    vec2 uv = gl_FragCoord.xy / screen.xy;
   // o = exp(-vec4(length(texture(iChannel0, uv).xy*R.xy-i)/30.));
    fragment = texture(prev, uv);

   // return;
   // return;
//o=1.-o;
//o.w=-1.;

//o.w=1.;
// (o.r>=.7) o.r*=.01;
//se o.rgb*=vec3(.0);

//o.r*=length(o.gb);
    vec3 col = vec3(0.4549, 0.0, 0.098) ;   //vec3(0.0, 0.2667, 1.0) = Blue vec3(0.0, 0.4, 1.0) = Cyan  vec3(1.0, 0.451, 0.0) = Orange vec3(0.5686, 0.0, 0.0) = Red vec3(0.4353, 0.0, 1.0) = Magenta vec3(0.2353, 0.0, 0.4588) = Deep Purple vec3(0.0, 0.1569, 0.4471) = Deep Blue vec3(0.3647, 0.0, 0.5333) = Matte Purple vec3(0.1216, 0.0, 0.4549) = Royal Blue vec3(0.2118, 0.0, 0.4549) = Matte Violet vec3(0.0, 0.1216, 0.4549) = Demon Blue vec3(0.4549, 0.0, 0.098) = Crimson
    //fragment.xyz *= vec3(0.0, 1.0, 0.1647);
   // fragment.xyz = (col) * fragment.w;
    //return;
    //if(fragment.w != 0)
    
    fragment.xyz = getAvgColorAround(uv) * col *fragment.w*1.7;
   // fragment.w=.2*pow(length(fragment.xyz),50);
   
   // fragment.xyz*=fragment.w;
   // if (fragment.w>0.8) fragment.w=-199.81*smoothstep(.08,1.5,length(fragment.xyz)/2);
    //if (fragment.w>.00000) fragment.w=102;
   // fragment.xyz*=fragment.w;
}