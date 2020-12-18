import * as THREE from 'three';
import vertexShader from '../glsl/bg.vert';
import defaultFragmentShader from '../glsl/bgDefault.frag';
import waterFragmentShader from '../glsl/bgWater.frag';
import stormFragmentShader from '../glsl/bgStorm.frag';
import spaceFragmentShader from '../glsl/bgSpace.frag';
import { colors } from './variable';

export default class Background {
  constructor() {
    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }

  init(route) {
    this.geometry = new THREE.PlaneBufferGeometry(2, 2);
    let bgColor = colors.pink; // デフォルト色はピンク
    let frag = defaultFragmentShader; // デフォルトの背景シェーダー
    switch (route) {
      case 'stage1':
        bgColor = colors.blue;
        frag = waterFragmentShader;
        break;
      case 'stage2':
        bgColor = colors.green;
        frag = stormFragmentShader;
        break;
      case 'stage3':
        bgColor = colors.black;
        frag = spaceFragmentShader;
        break;
      default:
        break;
    }
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { type: 'c', value: new THREE.Color(bgColor) },
      },
      vertexShader,
      fragmentShader: frag,
      depthTest: false,
    });

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.renderOrder = -1; // 背景を一番先にレンダリングする
  }

  setPosition(z) {
    // カーソルに追従させる
    this.mesh.position.z = z;
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
