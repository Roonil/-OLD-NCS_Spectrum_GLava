in vec4 gl_FragCoord;

/* screen dimensions */
#request uniform "screen" screen
uniform ivec2 screen;/* screen dimensions */

#request uniform "prev" prev
uniform sampler2D prev;

out vec4 fragment; /* output */

vec4 getAvgColorAround(vec2 uv){
    
    const float blurSize=1./512.;//1/78
    
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
    
    //  const float intensity=1.2*smoothstep(.01,.5,length(sum));
    
    const float intensity=1.5;
    col=sum*intensity+texture(prev,texcoord);
    return col;
}

void main()
{
    vec2 uv=gl_FragCoord.xy/screen.xy;
    fragment=getAvgColorAround(uv);
    vec4 prevColor=texture(prev,uv);
    
    vec4 old=fragment;
    
    //fragment.xyz*=.9*smoothstep(.0,.23,length(prevColor.xyz-fragment.xyz)/length(fragment.xyz));//.7
    //  fragment.xyz*=.9*smoothstep(.0,.5,length(prevColor.xyz-fragment.xyz)/length(fragment.xyz));//.7
    
    //fragment.w*=.75*smoothstep(.0,.1,length(prevColor.w-old.w)/length(old.w));
    fragment.w*=.8*smoothstep(.0,.5,length(prevColor.w-old.w)/length(old.w));
    
    //fragment.w*=2*smoothstep(0.,26.,length(prevColor.xyz-fragment.xyz)/length(fragment.xyz));//.6
    
    //  fragment.xyz*=prevColor.w*1.;
    //   fragment*=smoothstep(-.1,1.2,distance(uv,vec2(.5)))*2;
    // fragment.w*=1.5;
    if(uv.x>.99||(uv.y)>.99||uv.y<.01)fragment=vec4(0);
    
    // fragment.xyz*=col;
    
    if(length(fragment.xyz)>=0&&length(fragment.xyz)<.5)
    fragment.xyzw*=1.3;
    
    fragment.w*=1.5;
    
    if(length(fragment)>1.)
    fragment-=prevColor;
    //fragment.w=smoothstep(0,1,length(uv-.5));
    //  fragment.xyz=vec3(0);
}