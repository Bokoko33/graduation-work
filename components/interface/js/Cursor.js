import Vue from 'vue';
import * as THREE from 'three';
import Common from '../../artwork/js/Common';
import Stage from '../../artwork/js/Stage';

// InterFace.jsを触るためのvueインスタンス
const vm = new Vue();

class Cursor {
  constructor() {
    // webGL座標に置き換えたもの
    this.cursorPosition = new THREE.Vector3(0, 0, Stage.startZ);
    // レイキャスト用の-1~1の座標（初期値を-1にし、画面中央付近のオブジェクトと初期値で交差してしまうのを防ぐ)
    this.rayPosition = new THREE.Vector2(-1, -1);
    // 交差しているオブジェクト
    this.intersected = null;
    // 交差検知するリンクのメッシュを格納する配列（これをintersectObjectsに渡す）
    this.rayCastMeshes = [];

    // カーソルにかける抗力
    this.forceList = {
      default: 0.3,
      normalWater: 0.03,
      heavyWater: 0.01,
      normalWind: 0.05,
      normalSpace: 0.07,
    };
    this.currentForce = this.forceList.default;

    // インタラクション中か
    this.isInteracting = false;
    // インタラクション中のオブジェクト
    this.interactingObject = null;

    // 前後座標の入力値
    this.inputZ = this.cursorPosition.z;
    // 前進するときの慣性（1で無し、小さいほど重い）
    this.straightInertia = 0.03;

    // 「押しながらホバーして、離してクリック」を防ぐためのフラグ（これを基準にクリック判定）
    this.clickable = false;

    this.moveSpeed = 5;
    this.backSpeed = 3;

    // カーソルメッシュの平面上での動きを操作する
    this.acceleration = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);

    this.pageTransition = null; // 遷移メソッドを.vueファイルから後から注入

    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }

  init(route) {
    // 球体
    this.geometry = new THREE.CircleBufferGeometry(20, 30);
    this.material = new THREE.MeshLambertMaterial({
      color: 0x20eca3,
    });

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
      if (this.cursorPosition.z > Stage.goalZ) {
        this.inputZ -= this.moveSpeed;
      }
      // } else if (this.cursorPosition.z < Stage.startZ) {
      //   // 離している時、原点より進んでいれば、常に少し後ろに下がり続ける
      //   this.inputZ += this.backSpeed;
    }

    // カーソルの座標を適用適用
    this.setCursorPosition(
      this.convertedPosition(vm.$interFace.cursorPos),
      this.currentForce
    );

    // 慣性を効かせたカーソルの前進
    this.goStraight();

    // カメラ、背景をカーソルに追従
    Common.cameraFollow(this.cursorPosition);
    Stage.backgroundFollow(this.cursorPosition.z);

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

  convertedPosition(pos) {
    // window座標をwebGL座標に変換
    const cx = pos.x - Common.size.w / 2; // 原点を中心に持ってくる
    const cy = -pos.y + Common.size.h / 2; // 軸を反転して原点を中心に持ってくる

    return { x: cx, y: cy };
  }

  setCursorPosition(targetPos, force) {
    // カーソルの向かうターゲット,慣性力。通常時はカーソル座標を第一引数に取る
    const vx = (targetPos.x - this.cursorPosition.x) * force;
    const vy = (targetPos.y - this.cursorPosition.y) * force;
    this.velocity.set(vx, vy, 0);
    this.velocity.add(this.acceleration);
    this.cursorPosition.add(this.velocity);
    this.cursorPosition.setZ(this.cursorPosition.z);

    this.mesh.position.set(
      this.cursorPosition.x,
      this.cursorPosition.y,
      this.cursorPosition.z
    );
    this.acceleration.set(0, 0, 0);
  }

  setRayCastPosition(size) {
    // レイキャスト用
    // -1〜+1の範囲で現在のマウス座標を登録する
    this.rayPosition.x = this.cursorPosition.x / (size.w / 2);
    this.rayPosition.y = this.cursorPosition.y / (size.h / 2);
  }

  rayCast() {
    // マウスオン状態を取得
    const isPressed = vm.$interFace.isMousePressed;
    // リンクのメッシュを渡し、リンクのみとの交差を検知する
    const intersects = this.raycaster.intersectObjects(this.rayCastMeshes);

    if (intersects.length > 0) {
      // 交差したオブジェクトがある時

      // ある程度近付かないと反応しないように
      // 親オブジェクトを持つ場合（グローバルメニュー）はそちらの座標を参照する
      const targetPos =
        intersects[0].object.parent.type !== 'Scene'
          ? intersects[0].object.parent.position.z
          : intersects[0].object.position.z;
      const dist = Math.abs(targetPos - this.cursorPosition.z);
      if (dist > Common.clickableDistance) return;

      // 交差検知したメッシュから、インスタンスを逆探知
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
    const objects = Stage.interactObjects;
    for (let i = 0; i < objects.length; i++) {
      const objPos = objects[i].position;
      const objRad = objects[i].interactRadius;
      if (this.cursorPosition.distanceTo(objPos) < objRad) {
        // 当たった場合はフラグをonにし関数を抜ける
        this.isInteracting = true;
        this.interactingObject = objects[i];
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
      } else if (Common.currentRoute === 'stage3') {
        // 引き込まれる
        const cx = this.interactingObject.position.x - this.mesh.position.x;
        const cy = this.interactingObject.position.y - this.mesh.position.y;
        this.acceleration.set(cx, cy, 0);
        this.acceleration.multiplyScalar(0.1);
        this.setCursorPosition(this.interactingObject.position, 0.1);
      }
    } else {
      // インタラクションしていなければ、そのシーンの抵抗値に戻す
      this.resetForce(Common.currentRoute);
    }
  }

  goStraight() {
    const z = (this.inputZ - this.cursorPosition.z) * this.straightInertia;
    this.cursorPosition.z += z;
  }

  // vueから呼ばれる
  setClickEvent(callback) {
    this.pageTransition = callback;
    vm.$interFace.setClickEvent(this.clickLink.bind(this));
  }

  clickLink() {
    if (!this.clickable) return;
    // InterFace.vueの遷移メソッド
    // 現在交差中のオブジェクト(Linkクラス)のパス名を渡す
    this.pageTransition(this.intersected.nextPathName);
  }

  resetForce(route) {
    let force = 0;
    switch (route) {
      case 'stage1':
        force = this.forceList.normalWater;
        break;
      case 'stage2':
        force = this.forceList.normalWind;
        break;
      case 'stage3':
        force = this.forceList.normalSpace;
        break;
      default:
        force = this.forceList.default;
        break;
    }
    this.currentForce = force;
  }

  resetPosition() {
    // 位置をスタートに戻す
    this.inputZ = Stage.startZ;
    this.cursorPosition.z = Stage.startZ;
  }
}

export default new Cursor();
