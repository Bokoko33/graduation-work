#include <fog_pars_vertex>

attribute vec3 offsetPosition;
attribute float initialRotate; // 回転の初期値
varying vec3 vViewPosition;
uniform float uTime;

float PI = 3.141592653589793;

highp mat2 rotate(float rad){
    return mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
}

void main() {
    vec3 originPos = position;
    vec3 offsetPos = offsetPosition;

    vec3 centerY = vec3(0, offsetPos.y, 0); // y座標のみoffsetに合わせた原点
    
    // 原点を中心に回転（あとでpositionを中心にする）
    float radius = distance(offsetPos, centerY);
    // 回転角に初期値を足しておくことで開始位置をずらす
    float angle = initialRotate + uTime * 0.24;

    offsetPos.x = radius * cos(angle);
    offsetPos.z = radius * sin(angle);

    // y軸を中心に回転
    originPos.xz *= rotate(-angle);
    
    vec4 mvPosition = modelViewMatrix * vec4(originPos + offsetPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;

    #include <fog_vertex>
}