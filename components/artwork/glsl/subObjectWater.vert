#include <fog_pars_vertex>

attribute vec3 offsetPosition;
attribute vec3 initialRotate; // 回転の初期値
varying vec3 vViewPosition;
uniform float uTime;
uniform vec2 windowSize;

float rotateSpeed = 0.04;
float upSpeed = 0.05;

highp mat2 rotate(float rad){
    return mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
}

void main() {
    vec3 originPos = position;
    vec3 offsetPos = offsetPosition;
    
    // 回転角に初期値を足しておくことで開始角をずらす
    float angleX = initialRotate.x + uTime * rotateSpeed;
    float angleY = initialRotate.y + uTime * rotateSpeed;
    float angleZ = initialRotate.z + uTime * rotateSpeed;

    // 回転    
    originPos.xz *= rotate(angleZ);
    originPos.xy *= rotate(angleY);

    // 上昇
    float visileAreaY = windowSize.y * 4.0; // パーティクルは画面高さの2倍まで（上下で4倍）表示、超えたら消えて反対から出てくる
    float initialPercent = offsetPosition.y / visileAreaY; // 初期位置の画面内での割合
    float currentPercent = (uTime/100.0) * upSpeed + initialPercent;
    offsetPos.y = (fract(currentPercent) - 0.5) * visileAreaY; // fractの結果を-0.5~0.5にして表示エリアの分拡大
    
    vec4 mvPosition = modelViewMatrix * vec4(originPos + offsetPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;

    #include <fog_vertex>
}