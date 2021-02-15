import * as THREE from 'three';
import Background from './Background';
import Link from './Link';
import MainObject from './MainObject';
import SubObject from './SubObject';
import PanelObject from './PanelObject';
import TextObject from './TextObject';
import { state } from './state';
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

    // 散らばってるサブオブジェクト
    this.subObjects = null;

    // カーソルとの距離に応じてfadeInするオブジェクト
    this.fadeInObjects = [];

    // ゴールに置くリンクのリスト（削除せず並べ替えやテクスチャを変える）
    this.goalLinkObjects = [];
    // ゴール地点のテキスト（削除せずopacityを変える）
    this.goalTextList = [];
    // ゴールメニューになるパス名
    this.goalLinkNames = ['/', '/stage1', '/stage2', '/stage3'];
    // ゴールよりも奥にリンクを設置
    this.goalLinkOffset = 250;

    // ページ最初のパネル
    this.topPanel = null;
    this.topText = null;

    // indexページの説明パネルリスト
    this.descPanelNum = 5;
    this.descriptionPanels = [];
  }

  init() {
    // fogを作成
    this.fogList = {
      main: new THREE.Fog(colors.lightPurple, this.fogNear, this.fogFar),
      water: new THREE.Fog(colors.blue, this.fogNear, this.fogFar),
      storm: new THREE.Fog(colors.green, this.fogNear, this.fogFar),
      space: new THREE.Fog(colors.darkPurple, this.fogNear, this.fogFar),
    };

    // 光源
    this.light = new THREE.HemisphereLight(colors.white, colors.darkPurple, 1);
  }

  setLight(scene) {
    this.light.position.set(0.5, 1, 0.75);
    scene.add(this.light);
  }

  setFog(path, scene) {
    switch (path) {
      case '/stage1':
        scene.fog = this.fogList.water;
        break;
      case '/stage2':
        scene.fog = this.fogList.storm;
        break;
      case '/stage3':
        scene.fog = this.fogList.space;
        break;
      default:
        scene.fog = this.fogList.main;
        break;
    }
  }

  initGoal(scene, linkList, currentPath) {
    // ゴールリンクを初期化
    // パスとデフォルトのテクスチャを設定し、adjustGoal()でステージごとに位置とテクスチャを修正
    const goalPositionZ = this.goalZ - this.goalLinkOffset;
    for (let i = 0; i < this.goalLinkNames.length; i++) {
      const link = new Link(
        new THREE.Vector3(0, 0, goalPositionZ),
        this.goalLinkNames[i],
        'goal'
      );
      // raycastのためのリストに追加
      linkList.push(link);
      // ゴールリンクのリストにも追加（遷移時に修正できるように）
      this.goalLinkObjects.push(link);
      // fadeInのリストにも追加
      this.fadeInObjects.push(link);

      scene.add(link.mesh);
    }

    // ゴールの周りに表示するテキスト
    const goalTextEn = new TextObject(
      new THREE.Vector3(0, 280, goalPositionZ),
      1448 * state.variableImageRate,
      146 * state.variableImageRate,
      getTexture('goal_text_en')
    );
    const goalTextJa = new TextObject(
      new THREE.Vector3(0, -280, goalPositionZ),
      768 * state.variableImageRate,
      121 * state.variableImageRate,
      getTexture('goal_text_ja')
    );

    // ゴールテキストのリストに追加
    this.goalTextList.push(goalTextEn);
    this.goalTextList.push(goalTextJa);

    scene.add(goalTextEn.mesh);
    scene.add(goalTextJa.mesh);

    // 初回の調整
    this.adjustGoal(currentPath);
  }

  adjustGoal(path) {
    // ゴールは全ページ共通なので、削除せずテクスチャや並びを変える

    // ゴールリンクを置く座標
    const positions = state.isMobile
      ? [
          { x: -90, y: 140 },
          { x: 90, y: 140 },
          { x: -90, y: -100 },
          { x: 90, y: -100 },
        ]
      : [
          { x: -480, y: 0 },
          { x: -160, y: 0 },
          { x: 160, y: 0 },
          { x: 480, y: 0 },
        ];
    let posIndex = 0; // backをのぞいて左から順に配置するためのindex
    for (const obj of this.goalLinkObjects) {
      // 自身と同ステージであれば、テクスチャをbackに変更し、位置を右端に
      if (obj.nextPathName === path) {
        obj.mesh.material.map = getTexture('goal_back');
        obj.mesh.position.x = positions[3].x;
        obj.mesh.position.y = positions[3].y;
      } else {
        obj.mesh.material.map = obj.texture;
        obj.mesh.position.x = positions[posIndex].x;
        obj.mesh.position.y = positions[posIndex].y;
        posIndex++;
      }

      // 初期位置として再登録
      obj.resetInitialPosition(obj.mesh.position);

      // opacityを再び0に
      obj.mesh.material.opacity = 0;
      // fadeInオブジェクトのリストに再登録
      this.fadeInObjects.push(obj);
    }

    for (const text of this.goalTextList) {
      // opacityを再び0に
      text.mesh.material.opacity = 0;
      // fadeInオブジェクトのリストに再登録
      this.fadeInObjects.push(text);
    }
  }

  initBackground(path, scene) {
    // 背景を設定
    this.backgroundPlane = new Background();
    this.backgroundPlane.init(path, this.colors);
    scene.add(this.backgroundPlane.mesh);
  }

  deleteBackground(scene) {
    // 背景を削除
    scene.remove(this.backgroundPlane.mesh);
    this.backgroundPlane.delete();
  }

  initPanels(path, scene, windowSize) {
    if (path === '/about') return;
    // topパネル
    const topPanelPosition = state.isMobile
      ? new THREE.Vector3(0, windowSize.h * 0.25, -200)
      : new THREE.Vector3(0, 60, -200);
    this.topPanel = new PanelObject(topPanelPosition, 'top', path);
    this.fadeInObjects.push(this.topPanel);
    scene.add(this.topPanel.mesh);

    // topパネル下のテキスト
    const topTextPosition = state.isMobile
      ? new THREE.Vector3(0, -windowSize.h * 0.1, -200)
      : new THREE.Vector3(0, -320, -200);

    this.topText = state.isMobile
      ? new TextObject(
          topTextPosition,
          1255 * state.fixedImageRate,
          273 * state.fixedImageRate,
          getTexture('mv_text_sp')
        )
      : new TextObject(
          topTextPosition,
          1776 * state.fixedImageRate,
          447 * state.fixedImageRate,
          getTexture('mv_text_pc')
        );
    this.fadeInObjects.push(this.topText);
    scene.add(this.topText.mesh);

    // topページではさらに説明パネルを生成
    if (path === '/') {
      // デバイス差による位置調整
      const posY = state.isMobile ? 50 : 0;
      for (let i = 0; i < this.descPanelNum; i++) {
        const descPanelPosition = new THREE.Vector3(
          0,
          posY,
          topPanelPosition.z +
            (i + 1) * ((this.goalZ * 0.85) / this.descPanelNum)
        );
        const descPanel = new PanelObject(
          descPanelPosition,
          'desc',
          (i + 1).toString()
        );
        this.descriptionPanels.push(descPanel);
        this.fadeInObjects.push(descPanel);
        scene.add(descPanel.mesh);
      }
    }
  }

  deletePanels(scene) {
    if (this.topPanel) {
      scene.remove(this.topPanel.mesh);
      this.topPanel.delete();
    }
    if (this.topText) {
      scene.remove(this.topText.mesh);
      this.topText.delete();
    }
    for (let i = 0; i < this.descriptionPanels.length; i++) {
      // メッシュをシーンから削除
      scene.remove(this.descriptionPanels[i].mesh);
      // キャッシュが残るのでマテリアル等をdispose
      this.descriptionPanels[i].delete();
    }
    this.topPanel = null;
    this.topText = null;
    this.descriptionPanels.length = 0;
  }

  initInteractObjects(path, scene, windowSize) {
    if (path === '/' || path === '/about') return;
    // カーソルとインタラクションするメインオブジェクト生成
    for (let i = 0; i < this.interactObjectsLength; i++) {
      // const c1 = Math.random() * (0.8 - 0.3) + 0.3;
      // const c2 = Math.random() * (0.8 - 0.3) + 0.3;
      const x = (windowSize.w / 2) * this.ixObjPosCoefficient[i].x;
      const y = (windowSize.h / 2) * this.ixObjPosCoefficient[i].y;
      const z = (i + 1) * ((this.goalZ * 0.8) / this.interactObjectsLength);
      const pos = new THREE.Vector3(x, y, z);
      const obj = new MainObject(path, pos);
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

  initSubObjects(path, scene, windowSize) {
    if (path === '/about') return;

    const zOffset = 2500; // z座標はゴール若干奥にする。ステージ中央だと本体を通りすぎると消える。
    const position = state.isMobile
      ? new THREE.Vector3(0, windowSize.h * 0.05, this.goalZ - zOffset) // スマホの場合は若干上
      : new THREE.Vector3(0, 0, this.goalZ - zOffset);
    this.subObjects = new SubObject(path, position);
    scene.add(this.subObjects.mesh);
  }

  deleteSubObjects(scene) {
    // メッシュをシーンから削除
    if (!this.subObjects) return;
    scene.remove(this.subObjects.mesh);
    // キャッシュが残るのでマテリアル等をdispose
    this.subObjects.delete();

    this.subObjects = null;
  }

  backgroundFollow(cursorZ) {
    this.backgroundPlane.followCursor(cursorZ);
  }

  handleFade(cursorZ) {
    const fadeInDist = 400;
    const fadeSpeed = 0.05;
    // カーソルのz座標を受け取り、fadeInを制御
    for (let i = 0; i < this.fadeInObjects.length; i++) {
      const obj = this.fadeInObjects[i];
      const opacity = obj.mesh.material.opacity;
      if (opacity < 1) {
        if (Math.abs(obj.mesh.position.z - cursorZ) < fadeInDist) {
          obj.mesh.material.opacity = opacity + fadeSpeed;
        }
      } else {
        // 完全に表示されたらリストから削除
        this.fadeInObjects.splice(i, 1);
        continue;
      }
    }
  }

  resetFadeInObjects() {
    this.fadeInObjects.length = 0;
  }

  update() {
    // インタラクションオブジェクトらの更新
    for (let i = 0; i < this.interactObjects.length; i++) {
      this.interactObjects[i].update();
    }

    // サブオブジェクトの更新
    if (this.subObjects) this.subObjects.update();
  }
}

export default new Stage();
