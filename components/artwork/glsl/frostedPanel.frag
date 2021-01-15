precision mediump float;

uniform sampler2D uTex;
uniform float uStrength;
varying vec2 vUv;

float tFrag = 1.0 / 512.0;
float nFrag = 1.0 / 30.0;
vec2  centerOffset = vec2(256.0, 256.0);

float rnd(vec3 scale, float seed){
    return fract(sin(dot(gl_FragCoord.stp + seed, scale)) * 43758.5453 + seed);
}

void main(){

    vec3  destColor = vec3(0.0);
    float random = rnd(vec3(12.9898, 78.233, 151.7182), 0.0);
    vec2  fc = vec2(gl_FragCoord.s, gl_FragCoord.t);
    vec2  fcc = fc - centerOffset;
    float totalWeight = 0.0;

    for(float i = 0.0; i <= 30.0; i++){
        float ppp = uStrength;

        float percent = (i + random) * nFrag;
        float weight = percent - percent * percent;
        vec2  t = fc - fcc * percent * ppp * nFrag;
        destColor += texture2D(uTex, t * tFrag).rgb * weight;
        totalWeight += weight;
    }
    gl_FragColor = vec4(destColor / totalWeight, 0.5);
}