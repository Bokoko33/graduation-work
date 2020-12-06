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

    // カメラを作成 (視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
    this.fovRad = (this.fov / 2) * (Math.PI / 180); // 視野角をラジアンに変換
    this.dist = this.size.h / 2 / Math.tan(this.fovRad); // ウィンドウぴったりのカメラ距離
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.size.w / this.size.h,
      0.1,
      5000
    );

    // レンダラー設定
    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.setClearColor(0x000000);
    this.renderer.setSize(this.size.w, this.size.h);

    // ステージ関連の初期化
    Stage.init();
    Stage.setLight(this.scene);
    // Stage.setGoalLink(this.scene, this.links);
    Stage.setFog(route, this.scene);
    Stage.initBackground(route, this.scene);
    Stage.initInteractObjects(route, this.scene, this.size);

    const menu = new Link(
      new THREE.Vector3(
        this.size.w / 2 - 100,
        this.size.h / 2 - 100,
        -this.clickableDistance
      ),
      'stage1'
    );
    this.scene.add(menu.mesh);
    this.links.push(menu);

    const goal = new Link(new THREE.Vector3(0, 0, Stage.goalZ - 500), 'next');
    this.scene.add(goal.mesh);
    this.links.push(goal);

    this.cameraGroup = new THREE.Group();
    this.cameraGroup.position.z = this.dist; // カメラを遠ざける
    this.cameraGroup.add(this.camera);
    this.cameraGroup.add(menu.mesh);
    this.scene.add(this.cameraGroup);
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

  render() {
    // リンクらの更新
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].update();
    }
    // ステージのループ
    Stage.update();

    this.renderer.render(this.scene, this.camera);
  }

  cameraFollow(cursorPosition) {
    // カーソルへのカメラ追従
    this.cameraGroup.position.z = cursorPosition.z + this.dist;
    this.cameraGroup.rotation.y = -cursorPosition.x * this.cameraFollowLevel;
    this.cameraGroup.rotation.x = cursorPosition.y * this.cameraFollowLevel;
  }

  globalLinksFollow(cursorPosition) {
    // カーソルへのグローバルメニュー追従
    // for (let i = 0; i < this.globalLinks.length; i++) {
    //   const x = -cursorPosition.x * this.cameraFollowLevel;
    //   const y = cursorPosition.y * this.cameraFollowLevel;
    //   const z = cursorPosition.z - 10;
    //   this.globalLinks[i].updatePosition(new THREE.Vector3(x, y, z));
    // }
  }

  transition(route) {
    // ステージの更新
    Stage.deleteBackground(this.scene);
    Stage.initBackground(route, this.scene);
    Stage.setFog(route, this.scene);
    Stage.deleteInteractObjects(this.scene);
    Stage.initInteractObjects(route, this.scene, this.size);

    this.currentRoute = route;
  }
}

export default new Common();
