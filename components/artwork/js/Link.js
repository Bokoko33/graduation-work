import * as THREE from 'three';
import vertexShader from '../glsl/globalMenu.vert';
import fragmentShader from '../glsl/globalMenu.frag';
import { state } from './state';
import { getTexture } from './textures';

export default class Link {
  constructor(pos, path, type) {
    // 元ある場所
    this.initialPosition = pos || new THREE.Vector3(0, 0, 0);

    // global or goal
    this.type = type;

    // このリンクをクリックしたときの遷移先
    // Cursor.jsから参照される
    this.nextPathName = path;

    // 画像ごとに決める幅と高さ
    this.width = 0;
    this.height = 0;

    // テクスチャは保存しておく
    this.texture = null;

    // ホバー中かどうか
    this.isHover = false;
    // ホバー時に動く範囲（半径）
    this.hoverMoveOffset = 30;

    // カーソルへのストーキング速度
    this.stokingSpeed = 0.1;

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
          this.width = 244;
          this.height = 171;
          break;
        case '/stage1':
          this.texture = getTexture('menu_water');
          this.width = 373;
          this.height = 85;
          break;
        case '/stage2':
          this.texture = getTexture('menu_storm');
          this.width = 372;
          this.height = 85;
          break;
        case '/stage3':
          this.texture = getTexture('menu_space');
          this.width = 367;
          this.height = 85;
          break;
        case '/about':
          this.texture = getTexture('menu_about');
          this.width = 178;
          this.height = 85;
      }
      this.width *= state.variableImageRate;
      this.height *= state.variableImageRate;

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
      this.width = 917 * state.variableImageRate;
      this.height = 1197 * state.variableImageRate;
      // テクスチャわけ
      switch (this.nextPathName) {
        case '/':
          this.texture = getTexture('goal_top');
          break;
        case '/stage1':
          this.texture = getTexture('goal_water');
          break;
        case '/stage2':
          this.texture = getTexture('goal_storm');
          break;
        case '/stage3':
          this.texture = getTexture('goal_space');
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
    if (this.initialPosition) {
      this.mesh.position.set(
        this.initialPosition.x,
        this.initialPosition.y,
        this.initialPosition.z
      );
    }
  }

  update() {
    // ホバーしていない場合に元の位置に戻ろうとする
    if (!this.isHover) {
      const x =
        this.mesh.position.x +
        (this.initialPosition.x - this.mesh.position.x) * this.stokingSpeed;
      const y =
        this.mesh.position.y +
        (this.initialPosition.y - this.mesh.position.y) * this.stokingSpeed;
      this.mesh.position.set(x, y, this.mesh.position.z);
    }
  }

  mouseOver(cursorPos) {
    this.isHover = true;
    // ホバー時はカーソルに追従する
    // カーソル座標 z方向はオブジェクトのものを利用
    const cursorPosition = new THREE.Vector3(
      cursorPos.x,
      cursorPos.y,
      this.initialPosition.z
    );

    // カーソルへ追従するベクトル
    const moveVec = cursorPosition.clone().sub(this.mesh.position);

    // 元の位置からの長さを持つ追従ベクトル
    const vectorFromOrigin = cursorPosition.clone().sub(this.initialPosition);
    // 範囲外であれば、長さを範囲内に修正して加える
    if (vectorFromOrigin.length() > this.hoverMoveOffset) {
      const a = this.hoverMoveOffset / vectorFromOrigin.length();
      const limitedPos = new THREE.Vector3(
        this.initialPosition.x + vectorFromOrigin.x * a,
        this.initialPosition.y + vectorFromOrigin.y * a,
        this.initialPosition.z
      );
      moveVec.x = limitedPos.x - this.mesh.position.x;
      moveVec.y = limitedPos.y - this.mesh.position.y;
    }

    this.mesh.position.x += moveVec.x * this.stokingSpeed;
    this.mesh.position.y += moveVec.y * this.stokingSpeed;
  }

  mouseOut() {
    this.isHover = false;
  }

  // グローバルメニューのみ ----

  // 初回、およびデバイス切り替え時の位置の再調整
  setPosition(windowSize, margin, z, index) {
    // ロゴ
    let pos;
    if (this.nextPathName === '/') {
      pos = state.isMobile
        ? new THREE.Vector3(
            -windowSize.w / 2 + margin.sp.side,
            windowSize.h / 2 - margin.sp.top - this.height * 0.2, // sp時はロゴを少し下にずらして調整
            z
          )
        : new THREE.Vector3(
            -windowSize.w / 2 + margin.pc.side,
            windowSize.h / 2 - margin.pc.top,
            z
          );
    } else {
      // メニュー
      const offsetSP = 20;
      pos = state.isMobile
        ? new THREE.Vector3(
            windowSize.w / 2 - margin.sp.side - margin.sp.between * (index % 2),
            windowSize.h / 2 -
              margin.sp.top -
              (1 - Math.floor(index / 2)) * offsetSP,
            z
          )
        : new THREE.Vector3(
            windowSize.w / 2 - margin.pc.side - margin.pc.between * index,
            windowSize.h / 2 - margin.pc.top,
            z
          );
    }
    this.mesh.position.set(pos.x, pos.y, pos.z);

    // 幅分だけずらす
    this.shiftMyWidth();

    // 初期位置を再設定
    this.resetInitialPosition(this.mesh.position);
  }

  // windowリサイズ時によばれる位置の再調整
  shiftNavResize(windowSize, margin, index) {
    // 呼び出し側で制御されているが一応
    if (this.type !== 'global') return;

    let newPosX = 0;
    if (this.nextPathName === '/') {
      // ロゴ
      newPosX = state.isMobile
        ? -windowSize.w / 2 + margin.sp.side
        : -windowSize.w / 2 + margin.pc.side;
    } else {
      // メニュー
      newPosX = state.isMobile
        ? windowSize.w / 2 - margin.sp.side - margin.sp.between * (index % 2)
        : windowSize.w / 2 - margin.pc.side - margin.pc.between * index;
    }
    this.mesh.position.x = newPosX;

    // 幅分だけずらす
    this.shiftMyWidth();

    // 初期位置を再設定
    this.resetInitialPosition(this.mesh.position);
  }

  // 等間隔配置するため、幅の半分だけ位置をずらす（左右によって異なるので場合分け）
  shiftMyWidth() {
    if (this.nextPathName === '/') {
      this.mesh.position.x += state.isMobile ? this.width / 2 : -this.width / 2;
    } else {
      this.mesh.position.x += state.isMobile ? -this.width / 2 : this.width / 2;
    }
  }

  // ホバーアニメーション管理のため、初期位置と移動先位置を修正
  resetInitialPosition(pos) {
    this.initialPosition.set(pos.x, pos.y, pos.z);
  }
}
