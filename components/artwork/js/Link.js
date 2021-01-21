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

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init();
  }

  init() {
    // widthはテクスチャ画像を参照
    if (this.type === 'global') {
      let texture = null;
      // テクスチャわけ
      switch (this.nextPathName) {
        case '/':
          texture = getTexture('globalMenuLogo');
          this.width = 244 * rate;
          this.height = 171 * rate;
          this.position.x -= this.width / 2; // 幅の半分だけ位置をずらす
          break;
        case 'stage1':
          texture = getTexture('globalMenuWater');
          this.width = 373 * rate;
          this.height = 85 * rate;
          this.position.x += this.width / 2; // 幅の半分だけ位置をずらす
          break;
        case 'stage2':
          texture = getTexture('globalMenuStorm');
          this.width = 372 * rate;
          this.height = 85 * rate;
          this.position.x += this.width / 2; // 幅の半分だけ位置をずらす
          break;
        case 'stage3':
          texture = getTexture('globalMenuSpace');
          this.width = 367 * rate;
          this.height = 85 * rate;
          this.position.x += this.width / 2; // 幅の半分だけ位置をずらす
          break;
        case 'about':
          texture = getTexture('globalMenuAbout');
          this.width = 178 * rate;
          this.height = 85 * rate;
          this.position.x += this.width / 2; // 幅の半分だけ位置をずらす
      }
      this.geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 2);
      this.material = new THREE.RawShaderMaterial({
        uniforms: {
          uTex: { type: 't', value: texture },
          uColor: { type: 'c', value: new THREE.Color(this.defaultColor) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
      });
    } else if (this.type === 'goal') {
      // テクスチャわけ
      switch (this.nextPathName) {
        case '/':
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
      this.geometry = new THREE.CircleBufferGeometry(40, 50);
      this.material = new THREE.MeshLambertMaterial({
        color: this.defaultColor,
      });
    }

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  update() {
    // this.mesh.rotation.y += 0.01;
  }

  mouseOver() {
    this.material.color = this.hoverColor;
  }

  mouseOut() {
    this.material.color = this.defaultColor;
  }

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
