attribute vec3 offsetPosition;
varying vec3 vViewPosition;
uniform float uTime;

float PI = 3.141592653589793;

highp mat2 rotate(float rad){
    return mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
}

void main() {
    vec3 pos = position;
    vec3 offPos = offsetPosition;

    vec3 centerY = vec3(0, offPos.y, 0); // y座標のみoffsetに合わせた原点
    
    // 原点を中心に回転（あとでpositionを中心にする）
    // y座標を回転角にy座標を足しておくことで開始位置をずらす。不変なので使い続けられる
    float radius = distance(offPos, centerY);
    offPos.x = radius * cos(offPos.y + uTime * 20.0);
    offPos.z = radius * sin(offPos.y + uTime * 20.0);
    // float s = max(0.0,sin(-time * 4.0 + length(offsetPosition)));
    // pos *= s;
    // pos.xz *= rotate(s * 4.0);
    // pos.xy *= rotate(s * 4.0);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos + offPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;
}