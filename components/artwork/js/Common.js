import * as THREE from 'three';
import Link from './Link';
import Stage from './Stage';
class Common {
  constructor() {
    this.size = {
      w: null,
      h: null,
    };
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.currentRoute = null; // 現在のページ

    // レイキャスターでホバー検知するリンク
    this.links = [];

    // カメラオプション
    this.fov = 45;
    this.fovRad = 0; // 視野角をラジアンに変換
    this.dist = 0; // ウィンドウぴったりのカメラ距離
    this.cameraFollowLevel = 0.00002; // カメラの回転のカーソルへの追従度
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
    this.camera.position.z = this.dist; // カメラを遠ざける

    // レンダラー設定
    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.setClearColor(0x000000);
    this.renderer.setSize(this.size.w, this.size.h);

    // ステージ関連の初期化
    Stage.init(route);
    Stage.setLight(this.scene);
    Stage.setFog(route, this.scene);
    Stage.initBackground(route, this.scene);
    Stage.initInteractObjects(route, this.scene, this.size);

    // 交差検知できるオブジェクトを作成、追加（ゴール地点に設置)
    const link = new Link(Stage.goalZ - 500);
    this.links.push(link);
    this.scene.add(this.links[0].mesh);
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
    this.camera.position.z = cursorPosition.z + this.dist;
    this.camera.rotation.y = -cursorPosition.x * this.cameraFollowLevel;
    this.camera.rotation.x = cursorPosition.y * this.cameraFollowLevel;
  }

  transition(route) {
    // ステージの更新
    Stage.deleteBackground(this.scene);
    Stage.initBackground(route);
    Stage.setFog(route, this.scene);
    Stage.deleteInteractObjects(this.scene);
    Stage.initInteractObjects(route, this.scene, this.size);

    this.currentRoute = route;
  }
}

export default new Common();
