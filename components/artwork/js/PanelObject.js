import * as THREE from 'three';
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
          break;
        case 'stage1':
          this.defaultColor = new THREE.Color(colors.white);
          break;
        case 'stage2':
          this.defaultColor = new THREE.Color(colors.green);
          break;
        case 'stage3':
          this.defaultColor = new THREE.Color(colors.black);
          break;
      }
      this.geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 2);
      this.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
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

    this.mesh.layers.enable(1);
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
