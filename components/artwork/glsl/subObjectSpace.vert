#include <fog_pars_vertex>

attribute vec3 offsetPosition;
attribute vec3 initialRotate; // 回転の初期値
varying vec3 vViewPosition;
uniform float uTime;

float PI = 3.141592653589793;
float moveSpeed = 0.0001;

highp mat2 rotate(float rad){
    return mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
}

void main() {
    vec3 originPos = position;
    vec3 offsetPos = offsetPosition;
    
    // 回転角に初期値を足しておくことで開始角をずらす
    float angleX = initialRotate.x + uTime * moveSpeed;
    float angleY = initialRotate.y + uTime * moveSpeed;
    float angleZ = initialRotate.z + uTime * moveSpeed;

    // 移動
    offsetPos.xz *= rotate(angleY);
    offsetPos.xy *= rotate(angleY);
    offsetPos.yz *= rotate(-angleX);
    
    vec4 mvPosition = modelViewMatrix * vec4(originPos + offsetPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;

    #include <fog_vertex>
}