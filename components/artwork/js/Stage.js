import * as THREE from 'three';
import Background from './Background';
import Link from './Link';
import MainObject from './MainObject';
import PanelObject from './PanelObject';
import { colors } from './variable';
import { getTexture } from './textures';

class Stage {
  constructor() {
    this.startZ = 0; // スタート位置
    this.goalZ = -5000; // ゴール位置

    // ライト（いずれステージごとに変える）
    this.light = null;

    // シーンごとに変えるFog
    this.fogNear = 300;
    this.fogFar = Math.abs(this.goalZ) + 1000;
    this.fogList = [];

    // 背景オブジェクト
    this.backgroundPlane = null;

    // カーソルとインタラクションするメインオブジェクト
    this.interactObjects = [];
    this.interactObjectsLength = 8;
    this.ixObjPosCoefficient = [
      { x: 0.5, y: 0.5 },
      { x: -0.6, y: -0.6 },
      { x: 0.2, y: -0.5 },
      { x: -0.7, y: 0.3 },
      { x: -0.1, y: -0.8 },
      { x: 0.7, y: -0.1 },
      { x: 0.3, y: 0.7 },
      { x: -0.5, y: -0.3 },
    ];

    // インタラクションしないメインオブジェクト
    this.noInteractObjects = [];
    this.noInteractObjectsLength = 8;
    this.noIxObjPosCoefficient = [
      { x: 0.5, y: 0.5 },
      { x: -0.6, y: -0.6 },
      { x: 0.2, y: -0.5 },
      { x: -0.7, y: 0.3 },
      { x: -0.1, y: -0.8 },
      { x: 0.7, y: -0.1 },
      { x: 0.3, y: 0.7 },
      { x: -0.5, y: -0.3 },
    ];

    // カーソルとの距離に応じてfadeInするオブジェクト
    this.fadeInObjects = [];

    // ゴールに置くリンクのリスト
    this.goalLinkObjects = [];
    // ゴールメニューになるパス名（ステージによってここから非表示に）
    this.goalLinkNames = ['/', 'stage1', 'stage2', 'stage3'];
    // ゴールよりも奥にリンクを設置（initでcommonからクリックできる距離を受け取る）
    this.goalLinkOffset = 0;

    // ページ最初のパネル（indexページではタイトル）
    this.topPanel = null;
    // indexページの説明パネルリスト
    this.descriptionPanels = [];
  }

  init(clickableDist) {
    this.goalLinket = clickableDist * 0.7;

    // fogを作成
    this.fogList = {
      main: new THREE.Fog(colors.white, this.fogNear, this.fogFar),
      water: new THREE.Fog(colors.blue, this.fogNear, this.fogFar),
      storm: new THREE.Fog(colors.green, this.fogNear, this.fogFar),
      space: new THREE.Fog(colors.darkPurple, this.fogNear, this.fogFar),
    };

    // 光源
    this.light = new THREE.HemisphereLight(0xffffff, 0xebeef2, 1);
  }

  setLight(scene) {
    this.light.position.set(0.5, 1, 0.75);
    scene.add(this.light);
  }

  setFog(route, scene) {
    switch (route) {
      case 'stage1':
        scene.fog = this.fogList.water;
        break;
      case 'stage2':
        scene.fog = this.fogList.storm;
        break;
      case 'stage3':
        scene.fog = this.fogList.space;
        break;
      default:
        scene.fog = this.fogList.main;
        break;
    }
  }

  initGoalLinks(scene, linkList, currentRoute) {
    // ゴールリンクを初期化
    // パスとデフォルトのテクスチャを設定し、ステージごとに位置とテクスチャを修正
    for (let i = 0; i < this.goalLinkNames.length; i++) {
      const link = new Link(
        new THREE.Vector3(0, 0, this.goalZ - this.goalLinkOffset),
        this.goalLinkNames[i],
        'goal'
      );
      // このクラスのリンクリストに追加（遷移時に消せるように）
      this.goalLinkObjects.push(link);
      linkList.push(link);
      scene.add(link.mesh);
    }

    this.adjustGoal(currentRoute);
  }

  adjustGoal(route) {
    // indexページならパス名に修正し、格納
    const pathname = route === 'index' ? '/' : route;
    // ゴールリンクを置く座標
    const positions = [-450, -150, 150, 450];
    let posIndex = 0; // backをのぞいて左から順に配置するためのindex
    for (const obj of this.goalLinkObjects) {
      // 自身と同ステージであれば、テクスチャをbackに変更し、位置を右端に
      if (obj.nextPathName === pathname) {
        obj.mesh.material.map = getTexture('goal_back');
        obj.mesh.position.x = positions[3];
      } else {
        obj.mesh.material.map = obj.texture;
        obj.mesh.position.x = positions[posIndex];
        posIndex++;
      }
    }
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

  initPanels(route, scene) {
    const topPanelPosition = new THREE.Vector3(0, 0, -200);
    this.topPanel = new PanelObject(topPanelPosition, 'top', route);
    scene.add(this.topPanel.mesh);

    // indexページではさらに説明パネルを生成
    if (route === 'index') {
      // いずれテクスチャリストの長さ分
      for (let i = 0; i < 4; i++) {
        const descPanelPosition = new THREE.Vector3(
          0,
          0,
          (i + 1) * ((this.goalZ - this.goalLinkOffset) / 4)
        );
        const descPanel = new PanelObject(
          descPanelPosition,
          'desc',
          i.toString()
        );
        this.descriptionPanels.push(descPanel);
        this.fadeInObjects.push(descPanel);
        scene.add(descPanel.mesh);
      }
    }
  }

  deletePanels(scene) {
    scene.remove(this.topPanel.mesh);
    this.topPanel.delete();
    for (let i = 0; i < this.descriptionPanels.length; i++) {
      // メッシュをシーンから削除
      scene.remove(this.descriptionPanels[i].mesh);
      // キャッシュが残るのでマテリアル等をdispose
      this.descriptionPanels[i].delete();
    }
    this.topPanel = null;
    this.descriptionPanels.length = 0;
  }

  initInteractObjects(route, scene, windowSize) {
    if (route === 'index' || route === 'about') return;
    // カーソルとインタラクションするメインオブジェクト生成
    for (let i = 0; i < this.interactObjectsLength; i++) {
      // const c1 = Math.random() * (0.8 - 0.3) + 0.3;
      // const c2 = Math.random() * (0.8 - 0.3) + 0.3;
      const x = (windowSize.w / 2) * this.ixObjPosCoefficient[i].x;
      const y = (windowSize.h / 2) * this.ixObjPosCoefficient[i].y;
      const z = (i + 1) * ((this.goalZ * 0.8) / this.interactObjectsLength);
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
    this.backgroundPlane.followCursor(cursorZ);
  }

  handleFade(cursorZ) {
    // カーソルのz座標を受け取り、fadeInを制御
    for (let i = 0; i < this.fadeInObjects.length; i++) {
      const obj = this.fadeInObjects[i];
      const opacity = obj.mesh.material.opacity;
      if (opacity >= 1) {
        // 完全に表示されたらリストから削除
        this.fadeInObjects.splice(i, 1);
        continue;
      }

      const fadeInDist = 400;
      if (Math.abs(obj.mesh.position.z - cursorZ) < fadeInDist) {
        obj.mesh.material.opacity = opacity + 0.05;
      }
    }
  }

  update() {
    // インタラクションオブジェクトらの更新
    for (let i = 0; i < this.interactObjects.length; i++) {
      this.interactObjects[i].update();
    }
  }
}

export default new Stage();
