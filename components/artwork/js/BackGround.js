import * as THREE from 'three';

export default class Background {
  constructor(z) {
    this.positionZ = 0;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }

  init(route) {
    this.geometry = new THREE.PlaneBufferGeometry(2, 2);
    this.material = new THREE.ShaderMaterial({
      vertexShader: `
          varying vec2 vUv;
          
          void main() {
              vUv = uv;
              gl_Position = vec4( position, 1.0 );    
          }
        `,
      fragmentShader: `
          varying vec2 vUv;
           
          void main() {
              gl_FragColor = vec4( 0.0, vUv.x, vUv.y, 1.0 );
          }
        `,
      depthTest: false,
    });

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.renderOrder = -1; // 背景を一番先にレンダリングする
  }

  setPosition(z) {
    this.mesh.position.z = z;
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
