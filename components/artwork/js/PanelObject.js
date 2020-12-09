import * as THREE from 'three';
import { colors } from './variable';

export default class PanelObject {
  constructor(pos, type, key) {
    this.position = pos;
    // top or desc
    this.type = type;
    // keyはtypeがtopならルート名、descなら何番目のパネルか

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init(key);
  }

  init(key) {
    if (this.type === 'top') {
      this.defaultColor = new THREE.Color(colors.white);
      // テクスチャわけ
      switch (key) {
        case 'index':
          this.defaultColor = new THREE.Color(colors.pink);
          break;
        case 'stage1':
          this.defaultColor = new THREE.Color(colors.blue);
          break;
        case 'stage2':
          this.defaultColor = new THREE.Color(colors.green);
          break;
        case 'stage3':
          this.defaultColor = new THREE.Color(colors.black);
          break;
      }
      this.geometry = new THREE.PlaneBufferGeometry(800, 500, 2); // サイズはいずれ画像から取る
      this.material = new THREE.MeshLambertMaterial({
        color: this.defaultColor,
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
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
