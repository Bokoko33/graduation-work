import * as THREE from 'three';
import MainObject from './MainObject';
import Background from './Background';
import Link from './Link';
import { colors } from './variable';
class Stage {
  constructor() {
    this.startZ = 0; // スタート位置
    this.goalZ = -5000; // ゴール位置

    // ライト（いずれステージごとに変える）
    this.light = null;

    // シーンごとに変えるFog
    this.fogNear = 100;
    this.fogFar = Math.abs(this.goalZ);
    this.fogList = [];

    // 背景オブジェクト
    this.backgroundPlane = null;

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

    // ゴール地点に置くリンク
    this.goalLink = null;
  }

  init() {
    // fogを作成
    this.fogList = {
      pink: new THREE.Fog(colors.pink, this.fogNear, this.fogFar),
      blue: new THREE.Fog(colors.blue, this.fogNear, this.fogFar),
      green: new THREE.Fog(colors.green, this.fogNear, this.fogFar),
      black: new THREE.Fog(colors.black, this.fogNear, this.fogFar),
    };

    // 光源
    this.light = new THREE.HemisphereLight(0xffffff, 0x008b8b, 1);
  }

  setLight(scene) {
    this.light.position.set(0.5, 1, 0.75);
    scene.add(this.light);
  }

  setFog(route, scene) {
    switch (route) {
      case 'stage1':
        scene.fog = this.fogList.blue;
        break;
      case 'stage2':
        scene.fog = this.fogList.green;
        break;
      case 'stage3':
        scene.fog = this.fogList.black;
        break;
      default:
        scene.fog = this.fogList.pink;
        break;
    }
  }

  setGoalLink(scene, linkList) {
    this.goalLink = new Link(new THREE.Vector3(0, 0, this.goalZ - 500), 'next');
    scene.add(this.goalLink.mesh);
    linkList.push(this.goalLink);
  }

  initBackground(route, scene) {
    // 背景を設定
    this.backgroundPlane = new Background();
    this.backgroundPlane.init(route, this.colors);
    scene.add(this.backgroundPlane.mesh);
  }

  deleteBackground(scene) {
    // 背景を削除
    scene.remove(this.backgroundPlane.mesh);
    this.backgroundPlane.delete();
  }

  initInteractObjects(route, scene, windowSize) {
    if (route === 'index' || route === 'ending') return;
    // カーソルとインタラクションするメインオブジェクト生成
    for (let i = 0; i < this.interactObjectsLength; i++) {
      // const c1 = Math.random() * (0.8 - 0.3) + 0.3;
      // const c2 = Math.random() * (0.8 - 0.3) + 0.3;
      const x = (windowSize.w / 2) * this.iObjPositionCoefficient[i].x;
      const y = (windowSize.h / 2) * this.iObjPositionCoefficient[i].y;
      const z = i * (this.goalZ / this.interactObjectsLength);
      const pos = new THREE.Vector3(x, y, z);
      const obj = new MainObject(route, pos);
      this.interactObjects.push(obj);
      scene.add(this.interactObjects[i].mesh);
    }
  }

  deleteInteractObjects(scene) {
    for (let i = 0; i < this.interactObjects.length; i++) {
      // メッシュをシーンから削除
      scene.remove(this.interactObjects[i].mesh);
      // キャッシュが残るのでマテリアル等をdispose
      this.interactObjects[i].delete();
    }
    this.interactObjects.length = 0;
  }

  backgroundFollow(cursorZ) {
    this.backgroundPlane.setPosition(cursorZ);
  }

  update() {
    // インタラクションオブジェクトらの更新
    for (let i = 0; i < this.interactObjects.length; i++) {
      this.interactObjects[i].update();
    }
  }
}

export default new Stage();
