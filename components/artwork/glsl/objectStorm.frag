// precision highp float;

// uniform float time;

// varying vec3 vPosition;
// varying vec4 vColor;

// void main() {

//     vec4 color = vec4( vColor );
//     color.r += sin( vPosition.x * 10.0 + time ) * 0.5;

//     gl_FragColor = color;

// }

precision mediump float;
varying vec2 vUv;
uniform vec3 uColor;
          
void main() {
    gl_FragColor = vec4(uColor,1.0);
}
