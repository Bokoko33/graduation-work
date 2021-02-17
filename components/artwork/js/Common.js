import * as THREE from 'three';
import Stage from './Stage';
import Link from './Link';
import { state, setWindowSize, setImageShrinkRate } from './state';

class Common {
  constructor() {
    this.size = {
      w: null,
      h: null,
    };
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cameraGroup = null;

    // グローバルメニューのパス名（画面右端から順に）
    this.globalNavPaths = ['/about', '/stage3', '/stage2', '/stage1'];
    // グローバルメニューのマージン（size確定後代入）
    this.globalNavMargin = {};

    this.currentPath = null; // 現在のページのパス名

    // レイキャスターでホバー検知するリンク（グローバルもステージ内リンクも含む）
    this.links = [];

    // カメラオプション
    this.fov = 45;
    this.fovRad = 0; // 視野角をラジアンに変換
    this.dist = 0; // ウィンドウぴったりのカメラ距離
    this.cameraFollowLevel = 0.00002; // カメラの回転のカーソルへの追従度

    this.clickableDistance = 1500; // 対象をクリックできるようになる距離

    this.outOfCameraDist = 600;
  }

  init($canvas, path) {
    this.currentPath = path;
    this.setSize();
    // シーン作成
    this.scene = new THREE.Scene();

    // カメラを作成
    this.fovRad = (this.fov / 2) * (Math.PI / 180); // 視野角をラジアンに変換
    this.dist = this.size.h / 2 / Math.tan(this.fovRad); // ウィンドウぴったりのカメラ距離
    // (視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.size.w / this.size.h,
      1,
      10000
    );
    // カメラとグローバルメニューをまとめるグループ（カメラの回転に追従させるため）
    this.cameraGroup = new THREE.Group();
    this.cameraGroup.position.z = this.dist; // カメラ（グループ）を遠ざける
    this.cameraGroup.add(this.camera);
    this.scene.add(this.cameraGroup);

    // レンダラー設定
    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.size.w, this.size.h);

    // グローバルナビゲーションを作成
    this.globalNavMargin = {
      pc: {
        side: this.size.w * 0.08,
        top: 40,
        between: 160,
      },
      sp: {
        side: this.size.w * 0.05,
        top: 30,
        between: 100,
      },
    };
    this.createGlobalNav();

    // ステージ関連の初期化
    Stage.init(this.clickableDistance);
    Stage.setLight(this.scene);
    Stage.setFog(path, this.scene);

    Stage.initGoal(this.scene, this.links, this.currentPath);
    Stage.initBackground(path, this.scene);
    Stage.initPanels(path, this.scene, this.size);
    Stage.initInteractObjects(path, this.scene, this.size);
    Stage.initSubObjects(path, this.scene, this.size);
  }

  setSize() {
    this.size = {
      w: window.innerWidth,
      h: window.innerHeight,
    };
    setWindowSize(this.size);
  }

  resize() {
    this.setSize();
    this.camera.aspect = this.size.w / this.size.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.size.w, this.size.h);

    this.shiftGlobalNav();
  }

  changeDevice(isMobile) {
    // デバイス切り替え時に呼ばれる

    // 使い回し画像のサイズを更新
    this.resetImageSize(isMobile);
    // this.resetObjectSize(isMobile);
    this.replaceGlobalNav(isMobile);
  }

  resetImageSize(isMobile) {
    const prevRate = state.variableImageRate;
    // 縮小率を更新
    setImageShrinkRate(isMobile);
    // 変更前のレートで割り、それをかけることで調整
    const rate = state.variableImageRate / prevRate;
    // リンク（グローバル、ゴール）の大きさを更新
    for (let i = 0; i < this.links.length; i++) {
      const obj = this.links[i];
      obj.mesh.scale.x *= rate;
      obj.mesh.scale.y *= rate;
      obj.mesh.scale.z *= rate;
    }
  }

  update() {
    // リンクらの更新
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].update();
    }

    // 通り過ぎたパネルを非表示にする処理
    if (Stage.topPanel) {
      this.hideObjectOutOfCamera(Stage.topPanel.mesh);
    }
    if (Stage.topText) {
      this.hideObjectOutOfCamera(Stage.topText.mesh);
    }
    for (let i = 0; i < Stage.descriptionPanels.length; i++) {
      this.hideObjectOutOfCamera(Stage.descriptionPanels[i].mesh);
    }

    // ステージのループ
    Stage.update();

    this.renderer.render(this.scene, this.camera);
  }

  hideObjectOutOfCamera(mesh) {
    // ある程度手前に来たオブジェクトは非表示に
    if (
      Math.abs(this.cameraGroup.position.z - mesh.position.z) <
      this.outOfCameraDist
    ) {
      mesh.visible = false;
    }
  }

  createGlobalNav() {
    for (let i = 0; i < this.globalNavPaths.length; i++) {
      const menu = new Link(null, this.globalNavPaths[i], 'global');
      // 位置を設定
      menu.setPosition(this.size, this.globalNavMargin, -this.dist, i);
      // console.log(menu.mesh.position.y);

      menu.mesh.renderOrder = 999; // 一番手前にレンダリングしたい
      this.scene.add(menu.mesh);
      this.links.push(menu);
      // カメラの回転に追従させるためグループへ追加
      this.cameraGroup.add(menu.mesh);
    }

    // ロゴを作成
    const logo = new Link(null, '/', 'global');
    // 位置を設定
    logo.setPosition(this.size, this.globalNavMargin, -this.dist, -1);

    logo.mesh.renderOrder = 999;
    this.scene.add(logo.mesh);
    this.links.push(logo);
    // カメラの回転に追従させるためグループへ追加
    this.cameraGroup.add(logo.mesh);
  }

  shiftGlobalNav() {
    // グローバルナビの位置修正（同一デバイス内でのリサイズ時）

    // vwを使うマージンを更新
    this.globalNavMargin.pc.side = this.size.w * 0.08;
    this.globalNavMargin.sp.side = this.size.w * 0.05;

    // グローバルナビをthis.linksに最初に登録しているので、
    // ループ回数はグローバルナビ+ロゴ分で良い
    for (let i = 0; i < this.globalNavPaths.length + 1; i++) {
      // 位置調整のためにインデックスも渡す
      this.links[i].shiftNavResize(this.size, this.globalNavMargin, i);
    }
  }

  replaceGlobalNav() {
    // グローバルナビの位置修正（デバイスの切り替え時）
    for (let i = 0; i < this.globalNavPaths.length + 1; i++) {
      // 位置調整のためにインデックスと最大数も渡す
      this.links[i].setPosition(this.size, this.globalNavMargin, -this.dist, i);
    }
  }

  cameraFollow(cursorPosition) {
    // カーソルへのカメラ追従
    this.cameraGroup.position.z = cursorPosition.z + this.dist;
    this.cameraGroup.rotation.y = -cursorPosition.x * this.cameraFollowLevel;
    this.cameraGroup.rotation.x = cursorPosition.y * this.cameraFollowLevel;
  }

  // ページ繊維
  transition(path) {
    // ステージの更新
    Stage.setFog(path, this.scene);
    Stage.resetFadeInObjects();
    Stage.adjustGoal(path);

    Stage.deleteBackground(this.scene);
    Stage.initBackground(path, this.scene);
    Stage.deleteInteractObjects(this.scene);
    Stage.initInteractObjects(path, this.scene, this.size);
    Stage.deleteSubObjects(this.scene);
    Stage.initSubObjects(path, this.scene, this.size);
    Stage.deletePanels(this.scene);
    Stage.initPanels(path, this.scene, this.size);

    this.currentPath = path;
  }
}

export default new Common();
