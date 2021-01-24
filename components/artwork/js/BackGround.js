import * as THREE from 'three';
import vertexShader from '../glsl/background.vert';
import fragmentShader from '../glsl/background.frag';
import { getTexture } from './textures';

export default class Background {
  constructor() {
    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }

  init(route) {
    this.geometry = new THREE.PlaneBufferGeometry(2, 2);
    let texture = null; // デフォルト色はピンク
    switch (route) {
      case 'stage1':
        texture = getTexture('bg_water_pc');
        break;
      case 'stage2':
        texture = getTexture('bg_storm_pc');
        break;
      case 'stage3':
        texture = getTexture('bg_space_pc');
        break;
      default:
        texture = getTexture('bg_main_pc');
        break;
    }
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: texture },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
    });

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.renderOrder = -1; // 背景を一番先にレンダリングする
  }

  followCursor(z) {
    // カーソルに追従させる
    this.mesh.position.z = z;
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
