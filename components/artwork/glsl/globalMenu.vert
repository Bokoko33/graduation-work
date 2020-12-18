uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
	vUv = uv;
	
	float x = position.x;
	float y = position.y;
	float z = position.z;
	
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vec3(x, y, z), 1.0);
}
