#include <fog_pars_vertex>

// varying vec2 vUv;
varying vec3 vViewPosition;
uniform float uTime;
attribute float offset;

float amplitude = 3.0; // 振れ幅
float speed = 0.1; // 変化の速さ 
float frec = 0.05; // 波の細かさ（振動数）

void main() {
    vec3 pos = position;

    pos.x += amplitude * sin(position.y * frec + uTime * speed);
    // pos.y = position.y + cos(position.x *0.1 + uTime * 0.1) * 3.0;
    pos.z += amplitude * cos(position.x * frec + uTime * speed);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;

    #include <fog_vertex>
}