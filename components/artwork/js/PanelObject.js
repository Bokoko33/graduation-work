import * as THREE from 'three';
// import frostedVertex from '../glsl/frostedPanel.vert';
// import frostedFragment from '../glsl/frostedPanel.frag';
import { colors } from './variable';
import { getTexture } from './textures';

export default class PanelObject {
  constructor(pos, type, key) {
    this.position = pos;
    // top or desc
    this.type = type;
    // keyはtypeがtopならルート名、descなら何番目のパネルか

    // 画像ごとに決める幅と高さ
    this.width = 0;
    this.height = 0;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.uniforms = {
      uStrength: { type: '1f', value: 15.0 },
      uTex: { type: 't', value: getTexture('frostedPanel') },
    };

    this.init(key);
  }

  init(key) {
    let texture = null;
    if (this.type === 'top') {
      // テクスチャわけ
      switch (key) {
        case 'index':
          texture = getTexture('mainVisualPc');
          this.width = 2040 * 0.3;
          this.height = 1224 * 0.3;
          this.position.y -= 50; // 若干下に下げる
          this.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          });
          break;
        case 'stage1':
          // this.width = 5120 * 0.1;
          // this.height = 2722 * 0.1;
          // this.material = new THREE.RawShaderMaterial({
          //   uniforms: this.uniforms,
          //   vertexShader: frostedVertex,
          //   fragmentShader: frostedFragment,
          //   transparent: true,
          // });
          this.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          });
          break;
        case 'stage2':
          this.defaultColor = new THREE.Color(colors.green);
          this.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          });
          break;
        case 'stage3':
          this.defaultColor = new THREE.Color(colors.black);
          this.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          });
          break;
      }
      this.geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 2);
    } else if (this.type === 'desc') {
      // テクスチャわけ
      switch (key) {
        case '0':
          this.defaultColor = new THREE.Color(colors.white);
          break;
        case '1':
          this.defaultColor = new THREE.Color(colors.white);
          break;
        case '2':
          this.defaultColor = new THREE.Color(colors.white);
          break;
        case '3':
          this.defaultColor = new THREE.Color(colors.white);
          break;
      }
      this.geometry = new THREE.PlaneBufferGeometry(600, 400, 2);
      this.material = new THREE.MeshLambertMaterial({
        color: this.defaultColor,
        opacity: 0.6,
        // depthWrite: false,
        transparent: true,
      });
    }

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
