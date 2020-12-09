import * as THREE from 'three';
import Stage from './Stage';
import Link from './Link';

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
    this.globalNavNames = ['about', 'stage3', 'stage2', 'stage1'];

    this.currentRoute = null; // 現在のページ

    // レイキャスターでホバー検知するリンク（グローバルもステージ内リンクも含む）
    this.links = [];

    // カメラオプション
    this.fov = 45;
    this.fovRad = 0; // 視野角をラジアンに変換
    this.dist = 0; // ウィンドウぴったりのカメラ距離
    this.cameraFollowLevel = 0.00002; // カメラの回転のカーソルへの追従度

    this.clickableDistance = 900; // 対象をクリックできるようになる距離
  }

  init($canvas, route) {
    this.currentRoute = route;
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
      5000
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

    // ステージ関連の初期化
    Stage.init();
    Stage.setLight(this.scene);
    Stage.setFog(route, this.scene);
    Stage.setGoalLinks(this.scene, this.links, this.currentRoute);

    Stage.initBackground(route, this.scene);
    Stage.initPanels(route, this.scene);
    Stage.initInteractObjects(route, this.scene, this.size);

    // グローバルナビゲーションを作成
    this.createGlobalNav();
  }

  setSize() {
    this.size = {
      w: window.innerWidth,
      h: window.innerHeight,
    };
  }

  resize() {
    this.setSize();
    this.camera.aspect = this.size.w / this.size.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.size.w, this.size.h);
  }

  update() {
    // リンクらの更新
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].update();
    }

    // 通り過ぎたパネルを非表示にする処理
    this.hideObjectOutOfCamera(Stage.topPanel.mesh);
    for (let i = 0; i < Stage.descriptionPanels.length; i++) {
      this.hideObjectOutOfCamera(Stage.descriptionPanels[i].mesh);
    }

    // ステージのループ
    Stage.update();

    this.renderer.render(this.scene, this.camera);
  }

  hideObjectOutOfCamera(mesh) {
    if (Math.abs(this.cameraGroup.position.z - mesh.position.z) < 600) {
      mesh.visible = false;
    }
  }

  createGlobalNav() {
    const headerMarginSide = this.size.w * 0.08;
    const headerMarginTop = 40;
    const headerMarginBetween = 120;
    for (let i = 0; i < this.globalNavNames.length; i++) {
      const menu = new Link(
        new THREE.Vector3(
          this.size.w / 2 - headerMarginSide - headerMarginBetween * i,
          this.size.h / 2 - headerMarginTop,
          -this.dist
        ),
        this.globalNavNames[i],
        'global'
      );
      menu.mesh.renderOrder = 999; // 一番手前にレンダリングしたい
      this.scene.add(menu.mesh);
      this.links.push(menu);
      // カメラの回転に追従させるためグループへ追加
      this.cameraGroup.add(menu.mesh);
    }

    // ロゴを作成
    const logo = new Link(
      new THREE.Vector3(
        -this.size.w / 2 + headerMarginSide,
        this.size.h / 2 - headerMarginTop,
        -this.dist
      ),
      '/',
      'global'
    );
    logo.mesh.renderOrder = 999;
    this.scene.add(logo.mesh);
    this.links.push(logo);
    // カメラの回転に追従させるためグループへ追加
    this.cameraGroup.add(logo.mesh);
  }

  cameraFollow(cursorPosition) {
    // カーソルへのカメラ追従
    this.cameraGroup.position.z = cursorPosition.z + this.dist;
    this.cameraGroup.rotation.y = -cursorPosition.x * this.cameraFollowLevel;
    this.cameraGroup.rotation.x = cursorPosition.y * this.cameraFollowLevel;
  }

  transition(route) {
    // ステージの更新
    Stage.setFog(route, this.scene);
    Stage.resetGoalVisible(route);

    Stage.deleteBackground(this.scene);
    Stage.initBackground(route, this.scene);
    Stage.deleteInteractObjects(this.scene);
    Stage.initInteractObjects(route, this.scene, this.size);
    Stage.deletePanels(this.scene);
    Stage.initPanels(route, this.scene);

    this.currentRoute = route;
  }
}

export default new Common();
