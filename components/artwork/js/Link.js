import * as THREE from 'three';
import vertexShader from '../glsl/globalMenu.vert';
import fragmentShader from '../glsl/globalMenu.frag';
import { colors } from './variable';
import { getTexture } from './textures';

// テクスチャの縮小倍率
const rate = 0.3;

export default class Link {
  constructor(pos, path, type) {
    this.position = pos;

    // global or goal
    this.type = type;

    // このリンクをクリックしたときの遷移先
    // Cursor.jsから参照される
    this.nextPathName = path;

    this.defaultColor = null;
    this.hoverColor = new THREE.Color(colors.white);

    // 画像ごとに決める幅と高さ
    this.width = 0;
    this.height = 0;

    // テクスチャは保存しておく
    this.texture = null;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init();
  }

  init() {
    // widthはテクスチャ画像を参照
    if (this.type === 'global') {
      // テクスチャわけ
      switch (this.nextPathName) {
        case '/':
          this.texture = getTexture('logo');
          this.width = 244 * rate;
          this.height = 171 * rate;
          this.position.x -= this.width / 2; // 幅の半分だけ位置をずらす
          break;
        case 'stage1':
          this.texture = getTexture('menu_water');
          this.width = 373 * rate;
          this.height = 85 * rate;
          this.position.x += this.width / 2; // 幅の半分だけ位置をずらす
          break;
        case 'stage2':
          this.texture = getTexture('menu_storm');
          this.width = 372 * rate;
          this.height = 85 * rate;
          this.position.x += this.width / 2; // 幅の半分だけ位置をずらす
          break;
        case 'stage3':
          this.texture = getTexture('menu_space');
          this.width = 367 * rate;
          this.height = 85 * rate;
          this.position.x += this.width / 2; // 幅の半分だけ位置をずらす
          break;
        case 'about':
          this.texture = getTexture('menu_about');
          this.width = 178 * rate;
          this.height = 85 * rate;
          this.position.x += this.width / 2; // 幅の半分だけ位置をずらす
      }
      this.geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 2);
      this.material = new THREE.RawShaderMaterial({
        uniforms: {
          uTex: { type: 't', value: this.texture },
          uColor: { type: 'c', value: new THREE.Color(this.defaultColor) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
      });
    } else if (this.type === 'goal') {
      // サイズは統一
      this.width = 917 * rate;
      this.height = 1197 * rate;
      // テクスチャわけ
      switch (this.nextPathName) {
        case '/':
          this.texture = getTexture('goal_top');
          break;
        case 'stage1':
          this.texture = getTexture('goal_water');
          break;
        case 'stage2':
          this.texture = getTexture('goal_water');
          break;
        case 'stage3':
          this.texture = getTexture('goal_water');
          break;
      }
      this.geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 2);
      this.material = new THREE.MeshBasicMaterial({
        map: this.texture,
        transparent: true,
        opacity: 0,
      });
    }

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  update() {}

  mouseOver() {}

  mouseOut() {}

  // グローバルメニューのみ
  resize(windowSize, margin, index, maxIndex) {
    // 呼び出し側で制御されているが一応
    if (this.type !== 'global') return;

    let newPosX = 0;
    if (index < maxIndex) {
      // メニュー
      newPosX = windowSize.w / 2 - margin.side - margin.between * index;
      newPosX += this.width / 2; // 幅の半分だけ位置をずらす
    } else {
      // ロゴ
      newPosX = -windowSize.w / 2 + margin.side;
      newPosX -= this.width / 2; // 幅の半分だけ位置をずらす
    }
    this.mesh.position.x = newPosX;
  }
}
