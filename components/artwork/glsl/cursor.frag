precision mediump float;

varying float vVariable;
varying vec2 vUv;

uniform sampler2D uTex;
uniform vec3 uColor;
	
float edge = 0.9;

void main() {
	float v =  step(vVariable, edge);
	// vec4 color = texture2D(uTex, vUv);

	vec4 color = mix(vec4(uColor,1.0), texture2D(uTex, vUv), v);
	gl_FragColor = color;
}
