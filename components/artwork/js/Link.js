import * as THREE from 'three';
import vertexShader from '../glsl/globalMenu.vert';
import fragmentShader from '../glsl/globalMenu.frag';
import { state } from './state';
import { colors, imageShrinkRate } from './variable';
import { getTexture } from './textures';

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
          this.width = 244 * imageShrinkRate;
          this.height = 171 * imageShrinkRate;
          // this.position.x -= this.width / 2; // 幅の半分だけ位置をずらす
          break;
        case 'stage1':
          this.texture = getTexture('menu_water');
          this.width = 373 * imageShrinkRate;
          this.height = 85 * imageShrinkRate;
          break;
        case 'stage2':
          this.texture = getTexture('menu_storm');
          this.width = 372 * imageShrinkRate;
          this.height = 85 * imageShrinkRate;
          break;
        case 'stage3':
          this.texture = getTexture('menu_space');
          this.width = 367 * imageShrinkRate;
          this.height = 85 * imageShrinkRate;
          break;
        case 'about':
          this.texture = getTexture('menu_about');
          this.width = 178 * imageShrinkRate;
          this.height = 85 * imageShrinkRate;
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
      this.width = 917 * imageShrinkRate;
      this.height = 1197 * imageShrinkRate;
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
    // goalはここで位置設定
    if (this.position) {
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }
  }

  update() {}

  mouseOver() {}

  mouseOut() {}

  // グローバルメニューのみ ----

  // 最初とデバイス切り替え時の位置の再調整
  setPosition(windowSize, margin, z, index) {
    if (this.nextPathName === '/') {
      const pos = state.isMobile
        ? new THREE.Vector3(
            -windowSize.w / 2 + margin.side,
            windowSize.h / 2 - margin.top,
            z
          )
        : new THREE.Vector3(
            -windowSize.w / 2 + margin.side,
            windowSize.h / 2 - margin.top,
            z
          );
      this.mesh.position.set(pos.x, pos.y, pos.z);
    } else {
      const pos = state.isMobile
        ? new THREE.Vector3(
            windowSize.w / 2 - margin.side - margin.between * (index % 2),
            windowSize.h / 2 - margin.top - (1 - Math.floor(index / 2)) * 30,
            z
          )
        : new THREE.Vector3(
            windowSize.w / 2 - margin.side - margin.between * index,
            windowSize.h / 2 - margin.top,
            z
          );
      this.mesh.position.set(pos.x, pos.y, pos.z);
    }
  }

  // 等間隔配置するため、幅の半分だけ位置をずらす（左右によって異なるので場合分け）
  shiftMyWidth() {
    if (this.nextPathName === '/') {
      this.mesh.position.x += state.isMobile ? this.width / 2 : -this.width / 2;
    } else {
      this.mesh.position.x += state.isMobile ? -this.width / 2 : this.width / 2;
    }
  }

  // windowリサイズ時によばれる位置の再調整
  shiftNavResize(windowSize, margin, index) {
    // 呼び出し側で制御されているが一応
    if (this.type !== 'global') return;

    let newPosX = 0;
    if (this.nextPathName === '/') {
      // ロゴ
      newPosX = -windowSize.w / 2 + margin.side;
    } else {
      // メニュー
      newPosX = state.isMobile
        ? windowSize.w / 2 - margin.side - margin.between * (index % 2)
        : windowSize.w / 2 - margin.side - margin.between * index;
    }
    this.mesh.position.x = newPosX;

    // 幅分だけずらす
    this.shiftMyWidth();
  }
}
