precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float variable;

attribute vec3 ringPosition;
attribute vec3 planePosition;
attribute vec3 randomPosition;
attribute vec2 uv;

varying float vVariable;
varying vec2 vUv;

void main() {
	vVariable = variable;
	vUv = uv;

    vec3 p = mix(planePosition, mix(randomPosition, ringPosition, variable), variable);
	// vec3 p = mix(planePosition, ringPosition,  variable); // ランダムを混ぜない場合
  	gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}