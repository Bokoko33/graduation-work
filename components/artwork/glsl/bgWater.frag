varying vec2 vUv;
uniform vec3 uColor;

// processingとかにあるmap()を再現
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
           
void main() {
    // vec2 center = vec2(0.5,0.95); // グラデーションの中心
    // // どれだけ明るく/暗くするか
    // float offset_light = 2.0;
    // float offset_dark = 0.5;
    // float dist = length( vUv - center );// 中心から現在のピクセルへの距離を取得
    // float lightness = (1.0 - dist);
    // // uniformのカラーに対して、グラデーション範囲指定した倍率を書ける
    // vec3 color = uColor * map(lightness, 0.0, 1.0, offset_dark, offset_light);
    // gl_FragColor = vec4( color, 1.0 );

    vec4 color1 = vec4(.9);
    vec4 color2 = vec4(uColor, 1.0); // 暗い方を少し暗く

    float darkness = 0.5; // 暗い方を、本来のカラーよりどれくらい暗くするか
    vec2 center = vec2(0.5,0.95); // グラデーションの中心
    float dist = length( vUv - center );// 中心から現在のピクセルへの距離を取得
    float percent = 1.0 - (dist / darkness);
    // これ↓でグラデーションできる
    gl_FragColor = color1 * percent + color2 * (1.0 - percent);
}