import * as THREE from 'three';
// import frostedVertex from '../glsl/frostedPanel.vert';
// import frostedFragment from '../glsl/frostedPanel.frag';
import { getTexture } from './textures';
import { state } from './state';

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
          texture = getTexture('mv_title_pc');
          this.width = 3648 * state.imageShrinkRate;
          this.height = 1817 * state.imageShrinkRate;
          break;
        case 'stage1':
          texture = getTexture('panel_water_pc');
          this.width = 3648 * state.imageShrinkRate;
          this.height = 1817 * state.imageShrinkRate;
          break;
        case 'stage2':
          texture = getTexture('panel_storm_pc');
          this.width = 3648 * state.imageShrinkRate;
          this.height = 1817 * state.imageShrinkRate;
          break;
        case 'stage3':
          texture = getTexture('panel_space_pc');
          this.width = 3648 * state.imageShrinkRate;
          this.height = 1817 * state.imageShrinkRate;
          break;
      }
    } else if (this.type === 'desc') {
      this.width = 2882 * state.imageShrinkRate;
      this.height = 1628 * state.imageShrinkRate;

      texture = getTexture(`panel_top_${key}_pc`);
    }

    this.geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 2);
    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
    });

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
