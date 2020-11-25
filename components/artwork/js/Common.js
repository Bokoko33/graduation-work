import * as THREE from 'three';
import Link from './Link';
import InteractObject from './InteractObject';

class Common {
  constructor() {
    this.size = {
      w: null,
      h: null,
    };
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // ステージ関連
    this.startZ = 0; // スタート位置
    this.goalZ = -5000; // ゴール位置

    // レイキャスターでホバー検知するリンク
    this.links = [];

    // カーソルとインタラクションするメインオブジェクト
    this.interactObjects = [];
    this.interactObjectsLength = 8;
    this.iObjPositionCoefficient = [
      { x: 0.5, y: 0.5 },
      { x: -0.6, y: -0.6 },
      { x: 0.2, y: -0.5 },
      { x: -0.7, y: 0.3 },
      { x: -0.1, y: -0.8 },
      { x: 0.7, y: -0.1 },
      { x: 0.3, y: 0.7 },
      { x: -0.5, y: -0.3 },
    ];

    // カメラオプション
    this.fov = 45;
    this.fovRad = 0; // 視野角をラジアンに変換
    this.dist = 0; // ウィンドウぴったりのカメラ距離
    this.cameraFollowLevel = 0.00002; // カメラの回転のカーソルへの追従度
  }

  init($canvas, $route) {
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
      3000
    );
    this.camera.position.z = this.dist; // カメラを遠ざける

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(100, 100, 100);
    // シーンに追加
    this.scene.add(directionalLight);

    // 交差検知できるオブジェクトを作成、追加（ゴール地点に設置)
    const link = new Link(this.goalZ - 500);
    this.links.push(link);
    this.scene.add(this.links[0].mesh);

    // レンダラー設定
    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(this.size.w, this.size.h);

    this.initInteractObjects($route);
  }

  initInteractObjects(route) {
    if (route === 'index' || route === 'ending') return;
    // カーソルとインタラクションするメインオブジェクト生成
    for (let i = 0; i < this.interactObjectsLength; i++) {
      // const c1 = Math.random() * (0.8 - 0.3) + 0.3;
      // const c2 = Math.random() * (0.8 - 0.3) + 0.3;
      const x = (this.size.w / 2) * this.iObjPositionCoefficient[i].x;
      const y = (this.size.h / 2) * this.iObjPositionCoefficient[i].y;
      const z = i * (this.goalZ / this.interactObjectsLength);
      const pos = new THREE.Vector3(x, y, z);
      const obj = new InteractObject(route, pos);
      this.interactObjects.push(obj);
      this.scene.add(this.interactObjects[i].mesh);
    }
  }

  deleteInteractObjects() {
    for (let i = 0; i < this.interactObjects.length; i++) {
      // メッシュをシーンから削除
      this.scene.remove(this.interactObjects[i].mesh);
      // キャッシュが残るのでマテリアル等をdispose
      this.interactObjects[i].delete();
    }
    this.interactObjects.length = 0;
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
    // インタラクションオブジェクトらの更新
    for (let i = 0; i < this.interactObjects.length; i++) {
      this.interactObjects[i].update();
    }
    this.renderer.render(this.scene, this.camera);
  }

  transition(route) {
    // インタラクションオブジェクトの更新
    this.deleteInteractObjects();
    this.initInteractObjects(route);
  }
}

export default new Common();
