import Vue from 'vue';
import * as THREE from 'three';
import Common from '../../artwork/js/Common';

// InterFace.jsを触るためのvueインスタンス
const vm = new Vue();

class Cursor {
  constructor() {
    // webGL座標に置き換えたもの
    this.glPosition = new THREE.Vector3(0, 0, Common.startZ);
    // レイキャスト用の-1~1の座標（初期値を-1にし、画面中央付近のオブジェクトと初期値で交差してしまうのを防ぐ)
    this.rayPosition = new THREE.Vector2(-1, -1);
    // 交差しているオブジェクト
    this.intersected = null;
    // 交差検知するリンクのメッシュを格納する配列（これをintersectObjectsに渡す）
    this.rayCastMeshes = [];

    // 前後座標の入力値
    this.inputZ = this.glPosition.z;

    // pluginに渡したりする抗力
    this.normalWaterForce = 0.03;
    this.heavyWaterForce = 0.01;
    this.normalWindForce = 0.05;
    this.normalSpaceForce = 0.07;

    this.isInteracting = false;

    // 前進するときの慣性（1で無し、小さいほど重い）
    this.force = 0.03;

    // 「押しながらホバーして、離してクリック」を防ぐためのフラグ（これを基準にクリック判定）
    this.clickable = false;

    this.moveSpeed = 5;
    this.backSpeed = 3;

    this.pageTransition = null; // 遷移メソッドを.vueファイルから後から注入

    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }

  init(route) {
    // 球体
    this.geometry = new THREE.CircleBufferGeometry(20, 30);
    this.material = new THREE.MeshLambertMaterial({ color: 0x20eca3 });

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // 3D空間にメッシュを追加
    Common.scene.add(this.mesh);

    // レイキャスター
    this.raycaster = new THREE.Raycaster();
    this.rayCastMeshes = Common.links.map((link) => link.mesh);

    // 抵抗値を初期化
    this.resetForce(route);
  }

  update() {
    // pluginsのループを代わりに回してあげる
    vm.$interFace.update();

    // マウス押しっぱなしで進む
    if (vm.$interFace.isMousePressed) {
      if (this.glPosition.z > Common.goalZ) {
        this.inputZ -= this.moveSpeed;
      }
      // } else if (this.glPosition.z < Common.startZ) {
      //   // 離している時、原点より進んでいれば、常に少し後ろに下がり続ける
      //   this.inputZ += this.backSpeed;
    }

    this.setPosition(vm.$interFace.cursorPos);

    // 慣性を効かせたカーソルの前進
    this.goStraight();

    // カメラと背景をカーソルに追従
    Common.cameraFollow(this.glPosition);
    Common.backgroundFollow(this.glPosition.z);

    // レイキャスト
    // 専用の座標に変換
    this.setRayCastPosition(Common.size);
    // カーソル座標からまっすぐに伸びる光線ベクトルを生成
    this.raycaster.setFromCamera(this.rayPosition, Common.camera);

    // リンクとの当たり判定
    this.rayCast();

    // オブジェクトとの当たり判定
    this.collisionDetection();

    // カーソルに対する効果
    this.effectCursor();
  }

  setPosition(pos) {
    // window座標をwebGL座標に変換
    const cx = pos.x - Common.size.w / 2; // 原点を中心に持ってくる
    const cy = -pos.y + Common.size.h / 2; // 軸を反転して原点を中心に持ってくる

    // カーソル用の座標をセット
    this.glPosition.set(cx, cy, this.glPosition.z);

    // メッシュの座標に適用
    this.mesh.position.set(
      this.glPosition.x,
      this.glPosition.y,
      this.glPosition.z
    );
  }

  setRayCastPosition(size) {
    // レイキャスト用
    // -1〜+1の範囲で現在のマウス座標を登録する
    this.rayPosition.x = this.glPosition.x / (size.w / 2);
    this.rayPosition.y = this.glPosition.y / (size.h / 2);
  }

  rayCast() {
    // マウスオン状態を取得
    const isPressed = vm.$interFace.isMousePressed;
    // リンクのメッシュを渡し、リンクのみとの交差を検知する
    const intersects = this.raycaster.intersectObjects(this.rayCastMeshes);

    if (intersects.length > 0) {
      // 交差したオブジェクトがある時

      // ある程度近付かないと反応しないように
      const dist = Math.abs(
        intersects[0].object.position.z - this.glPosition.z
      );
      if (dist > 800) return;

      this.intersected = Common.links.find(
        (link) => link.mesh === intersects[0].object
      );
      this.intersected.mouseOver();

      if (!isPressed) this.clickable = true;
    } else {
      if (this.intersected) {
        this.intersected.mouseOut();
      }
      this.intersected = null;
      this.clickable = false;
    }
  }

  collisionDetection() {
    const objects = Common.interactObjects;
    for (let i = 0; i < objects.length; i++) {
      const objPos = objects[i].position;
      const objRad = objects[i].interactRadius;
      if (this.glPosition.distanceTo(objPos) < objRad) {
        // 当たった場合はフラグをonにし関数を抜ける
        this.isInteracting = true;
        return;
      }
    }
    // 引っかからなければfalse
    this.isInteracting = false;
  }

  effectCursor() {
    // インタラクション中なら
    if (this.isInteracting) {
      if (Common.currentRoute === 'stage1') {
        vm.$interFace.setForce(this.heavyWaterForce);
      }
    } else {
      // インタラクションしていなければ、そのシーンの抵抗値に戻す
      this.resetForce(Common.currentRoute);
    }
  }

  goStraight() {
    this.glPosition.z += (this.inputZ - this.glPosition.z) * this.force;
  }

  setClickEvent(callback) {
    this.pageTransition = callback;
    vm.$interFace.setClickEvent(this.clickLink.bind(this));
  }

  clickLink() {
    if (!this.clickable) return;
    // InterFace.vueの遷移メソッド
    this.pageTransition();
  }

  resetForce(route) {
    let force = 0;
    switch (route) {
      case 'stage1':
        force = this.normalWaterForce;
        break;
      case 'stage2':
        force = this.normalWindForce;
        break;
      case 'stage3':
        force = this.normalSpaceForce;
        break;
      default:
        break;
    }

    // 0のまま渡すとデフォ値が入る設定
    vm.$interFace.setForce(force);
  }

  resetPosition() {
    // 位置をスタートに戻す
    this.inputZ = Common.startZ;
    this.glPosition.z = Common.startZ;
  }
}

export default new Cursor();
