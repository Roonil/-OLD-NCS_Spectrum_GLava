in vec4 gl_FragCoord;

/* screen dimensions */
#request uniform "screen" screen
uniform ivec2 screen;/* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */

vec4 getAvgColorAround(vec2 uv){
    
    const float blurSize=1./100.;//1/78
    
    vec4 col=texture(prev,uv);
    
    vec4 sum=vec4(0);
    vec2 texcoord=uv;
    
    sum+=texture(prev,vec2(texcoord.x-4.*blurSize,texcoord.y))*.05;
    sum+=texture(prev,vec2(texcoord.x-3.*blurSize,texcoord.y))*.09;
    sum+=texture(prev,vec2(texcoord.x-2.*blurSize,texcoord.y))*.12;
    sum+=texture(prev,vec2(texcoord.x-blurSize,texcoord.y))*.15;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y))*.16;
    sum+=texture(prev,vec2(texcoord.x+blurSize,texcoord.y))*.15;
    sum+=texture(prev,vec2(texcoord.x+2.*blurSize,texcoord.y))*.12;
    sum+=texture(prev,vec2(texcoord.x+3.*blurSize,texcoord.y))*.09;
    sum+=texture(prev,vec2(texcoord.x+4.*blurSize,texcoord.y))*.05;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y-4.*blurSize))*.05;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y-3.*blurSize))*.09;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y-2.*blurSize))*.12;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y-blurSize))*.15;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y))*.16;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y+blurSize))*.15;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y+2.*blurSize))*.12;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y+3.*blurSize))*.09;
    sum+=texture(prev,vec2(texcoord.x,texcoord.y+4.*blurSize))*.05;
    
    const float intensity=.5*smoothstep(.01,.5,length(sum));
    col=sum*intensity+texture(prev,texcoord);
    return col;
}

void main()
{
    vec2 uv=gl_FragCoord.xy/screen.xy;
    fragment=getAvgColorAround(uv);
    
    fragment.xyz*=vec3(.0941,.3725,.9686);//vec3(.0627,.3686,.9333); vec3(.1686,.4157,.9529); vec3(.4706,.0627,.9333)
    
    if(length(fragment.xyz)>=0&&length(fragment.xyz)<.5)
    fragment.xyz*=1.3;
}