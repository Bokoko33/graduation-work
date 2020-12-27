#include <fog_pars_vertex>

attribute vec3 offsetPosition;
attribute float initialRotate; // 回転の初期値
attribute vec2 rotateDirections; // 回転の方向1or-1が二つ
attribute float slVariable; // 球面線形補間の補間値0~1
varying vec3 vViewPosition;
uniform float uTime;

float speed = 0.03;

highp mat2 rotate(float rad){
    return mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
}

// 球面線形補間の基準とする縦/横回転。流れの向きは1or-1で場合わけ（dir）
vec3 verticalTrack(float radius, float angle, float dir){
    // sinとcosを逆にしたものをそれぞれ定義
    vec3 vt1 = vec3(radius * cos(angle), radius * sin(angle), 0.0);
    vec3 vt2 = vec3(radius * sin(angle), radius * cos(angle), 0.0);

    // dirで場合わけ
    float x = step(dir, 0.0);
    return mix(vt1, vt2, x);
}

vec3 horizontalTrack(float radius, float angle, float dir){
    // sinとcosを逆にしたものをそれぞれ定義
    vec3 ht1 = vec3(radius * cos(angle), 0.0, radius * sin(angle));
    vec3 ht2 = vec3(radius * sin(angle), 0.0, radius * cos(angle));

    // dirで場合わけ
    float x = step(dir, 0.0);
    return mix(ht1, ht2, x);
}

// 球面線形補間関数
// start : 開始ベクトル
// end : 終了ベクトル
// t : 補間値（0～1）
vec3 sphereLinear(vec3 start, vec3 end, float t) {
   vec3 normalizedStart = normalize(start);
   vec3 normalizedEnd= normalize(end);

   // 2ベクトル間の角度（鋭角側）
   float angle = acos(dot(normalizedStart,normalizedEnd));

   // sinθ
   float SinTh = sin(angle);

   // 補間係数
   float Ps = sin( angle * ( 1.0 - t ) );
   float Pe = sin( angle * t );

   return ( Ps * normalizedStart + Pe * normalizedEnd ) / SinTh * length(start); // 正規化されているので半径をかけ直す
}

void main() {
    vec3 originPos = position;
    vec3 offsetPos = offsetPosition;
    
    // 回転の半径
    float radius = length(offsetPos);
    // 回転角に初期値を足しておくことで開始位置をずらす
    float angle = initialRotate + uTime * speed;

    // 球面補間の開始/終了となる縦回転、横回転を定義
    vec3 vt = verticalTrack(radius, angle, rotateDirections.x);
    vec3 ht = horizontalTrack(radius, angle, rotateDirections.y);

    // 球面補間
    offsetPos = sphereLinear(vt, ht, slVariable);

    
    vec4 mvPosition = modelViewMatrix * vec4(originPos + offsetPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;

    #include <fog_vertex>
}

// 線形補間の場合
// attribute vec3 offsetPosition;
// attribute float initialRotate; // 回転の初期値
// varying vec3 vViewPosition;
// uniform float uTime;

// float PI = 3.141592653589793;


// highp mat2 rotate(float rad){
//     return mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
// }

// void main() {
//     vec3 originPos = position;
//     vec3 offsetPos = offsetPosition;

//     // 点対象に移動する先
//     vec3 endPos = vec3(-offsetPos.x,-offsetPos.y,-offsetPos.z);

//     // -1~1の時間変化（初期値を足してばらつきを持たせる）
//     float time = cos(uTime * 0.05 + initialRotate);
//     // 0~1の時間変化に直す
//     float variable = (time + 1.0) * 0.5;

//     // mixでアニメーション
//     vec3 pos = mix(offsetPos, endPos, variable);
    
//     // // y軸を中心に回転
//     // originPos.xz *= rotate(-angle);
    
//     vec4 mvPosition = modelViewMatrix * vec4(originPos + pos, 1.0);
//     gl_Position = projectionMatrix * mvPosition;
//     vViewPosition = -mvPosition.xyz;
// }