import Vue from 'vue';
import * as THREE from 'three';
import Common from '../../artwork/js/Common';
import Stage from '../../artwork/js/Stage';
import vertexShader from '../../artwork/glsl/cursor.vert';
import fragmentShader from '../../artwork/glsl/cursor.frag';
import { getTexture } from '../../artwork/js/textures';
import { colors } from '../../artwork/js/variable';

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
      waterNormal: 0.03,
      heavyWater: 0.01,
      stormNormal: 0.05,
      spaceNormal: 0.2,
      spaceAttractMove: 0.05,
      spaceAttractStop: 0.05,
      spaceEscape: 0.6, // normalにできるだけ近い値で、大きく
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
    // カーソル変形アニメーション用の変数。
    this.hover = false;

    this.moveSpeed = 5;
    this.backSpeed = 3;

    this.color = colors.gray;
    // カーソルメッシュの平面上での動きを操作する
    this.acceleration = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);

    this.pageTransition = null; // 遷移メソッドを.vueファイルから後から注入

    this.uniforms = {};
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.frameCount = 0;
  }

  init(route) {
    const texture = getTexture('cursor');
    // this.geometry = new THREE.PlaneBufferGeometry(
    //   108 * 0.15,
    //   151 * 0.15,
    //   30,
    //   30
    // );
    // this.material = new THREE.RawShaderMaterial({
    //   uniforms: {
    //     uTex: { type: 't', value: texture },
    //     uColor: { type: 'c', value: new THREE.Color(this.color) },
    //   },
    //   vertexShader,
    //   fragmentShader,
    //   transparent: true,
    // });

    // // メッシュを作成
    // this.mesh = new THREE.Mesh(this.geometry, this.material);

    // 使用するジオメトリ
    this.geometry = new THREE.BufferGeometry();
    // リングのジオメトリ
    const ringGeo = new THREE.RingBufferGeometry(40, 42, 64, 64);
    // リングジオメトリのポジション
    const ringGeoPosition = ringGeo.attributes.position.array;

    // 平面ジオメトリ
    const planeGeo = new THREE.PlaneBufferGeometry(
      108 * 0.2,
      151 * 0.2,
      64,
      64
    );
    // 平面ジオメトリのポジション
    const planeGeoPosition = planeGeo.attributes.position.array;
    // 平面ジオメトリのuv
    const planeGeoUv = planeGeo.attributes.uv.array;
    // 平面ジオメトリのインデックス
    const planeGeoIndex = planeGeo.index.array;

    const count = planeGeoIndex.length * 3;

    // 最終的に代入するポジション
    const ringPosition = new Float32Array(count);
    const planePosition = new Float32Array(count);
    const randomPosition = new Float32Array(count);
    // uv
    const planeUv = new Float32Array((count / 3) * 2);
    const index = new Uint16Array(count / 3);
    // ランダム生成する座標
    const r = new THREE.Vector3(0);

    for (let i = 0; i < count / 3; i++) {
      // 平面ジオメトリのインデックスからリングのポジションを代入
      ringPosition[i * 3 + 0] = ringGeoPosition[planeGeoIndex[i] * 3 + 0];
      ringPosition[i * 3 + 1] = ringGeoPosition[planeGeoIndex[i] * 3 + 1];
      ringPosition[i * 3 + 2] = ringGeoPosition[planeGeoIndex[i] * 3 + 2];

      // 平面ジオメトリのインデックスから平面のポジションを代入
      planePosition[i * 3 + 0] = planeGeoPosition[planeGeoIndex[i] * 3 + 0];
      planePosition[i * 3 + 1] = planeGeoPosition[planeGeoIndex[i] * 3 + 1];
      planePosition[i * 3 + 2] = planeGeoPosition[planeGeoIndex[i] * 3 + 2];

      // 平面ジオメトリのインデックスから平面のuvを代入
      planeUv[i * 2 + 0] = planeGeoUv[planeGeoIndex[i] * 2 + 0];
      planeUv[i * 2 + 1] = planeGeoUv[planeGeoIndex[i] * 2 + 1];

      if (i % 3 === 0) {
        // ランダムポジションの作成
        r.x = Math.random() * 60 - 30;
        r.y = Math.random() * 60 - 30;
      }

      randomPosition[i * 3 + 0] = r.x;
      randomPosition[i * 3 + 1] = r.y;
      randomPosition[i * 3 + 2] = r.z;

      index[i] = i;
    }

    // 使用するジオメトリに各情報を代入
    this.geometry.setAttribute(
      'planePosition',
      new THREE.BufferAttribute(planePosition, 3)
    );
    this.geometry.setAttribute(
      'ringPosition',
      new THREE.BufferAttribute(ringPosition, 3)
    );
    this.geometry.setAttribute(
      'randomPosition',
      new THREE.BufferAttribute(randomPosition, 3)
    );
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(planeUv, 2));

    this.geometry.setIndex(new THREE.BufferAttribute(index, 1));

    this.uniforms = {
      variable: { type: 'f', value: 0.0 },
      uTex: { type: 't', value: texture },
      uColor: { type: 'c', value: new THREE.Color(colors.gray) },
    };
    this.material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });

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

    // カーソルの座標を変換
    const glPosition = this.convertedPosition(vm.$interFace.cursorPos);
    // カーソルの速度を決定
    this.calcVelocity(glPosition);
    // カーソルの座標を適用
    this.setCursorPosition();

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

    if (this.hover) {
      if (this.uniforms.variable.value < 1) {
        const dist = 1 - this.uniforms.variable.value;
        this.uniforms.variable.value += dist * 0.3;
      } else {
        this.uniforms.variable.value = 1;
      }
    } else if (this.uniforms.variable.value > 0) {
      this.uniforms.variable.value -= 0.05;
    } else {
      this.uniforms.variable.value = 0;
    }
  }

  convertedPosition(pos) {
    // window座標をwebGL座標に変換
    const cx = pos.x - Common.size.w / 2; // 原点を中心に持ってくる
    const cy = -pos.y + Common.size.h / 2; // 軸を反転して原点を中心に持ってくる

    return { x: cx, y: cy };
  }

  calcVelocity(targetPos) {
    // 次の座標までの移動距離
    let vx = targetPos.x - this.cursorPosition.x;
    let vy = targetPos.y - this.cursorPosition.y;
    if (!this.isInteracting) {
      // 通常時は慣性をかけて"set"する
      vx *= this.currentForce;
      vy *= this.currentForce;
      this.velocity.set(vx, vy, 0);
    } else {
      // インタラクション時
      switch (Common.currentRoute) {
        // 水中
        case 'stage1': {
          // より重い抵抗をかける
          vx *= this.forceList.heavyWater;
          vy *= this.forceList.heavyWater;
          this.velocity.set(vx, vy, 0);
          break;
        }
        // 竜巻
        case 'stage2': {
          // 抵抗をかけて"add"する
          vx *= this.forceList.stormNormal;
          vy *= this.forceList.stormNormal;
          const vec = new THREE.Vector3(vx, vy, 0);
          this.velocity.add(vec);

          // 引力を定義
          const attractX =
            (this.interactingObject.position.x - this.cursorPosition.x) *
            this.forceList.stormNormal;
          const attractY =
            (this.interactingObject.position.y - this.cursorPosition.y) *
            this.forceList.stormNormal;

          // 加速度を設定してさらに速度に加算
          this.acceleration.set(attractX, attractY, 0);
          this.velocity.add(this.acceleration);
          break;
        }
        // 吸い込み
        case 'stage3': {
          // 動いているかどうか
          if (vm.$interFace.isMouseMoving) {
            // 動いている時は抜け出せるよう吸い込みを弱く
            // 引力を定義
            const attractX =
              (this.interactingObject.position.x - this.cursorPosition.x) *
              this.forceList.spaceAttractMove;
            const attractY =
              (this.interactingObject.position.y - this.cursorPosition.y) *
              this.forceList.spaceAttractMove;
            this.velocity.set(attractX, attractY, 0);

            // pluginから前後フレームの移動方向を参照し、移動ベクトルをadd
            const moveX = vm.$interFace.moveVec.x * this.forceList.spaceEscape;
            const moveY = -vm.$interFace.moveVec.y * this.forceList.spaceEscape; // y方向は反転
            const vec = new THREE.Vector3(moveX, moveY, 0);
            this.velocity.add(vec);
          } else {
            // 止まっている時は吸い込まれる力のみ
            // 引力を定義
            const attractX =
              (this.interactingObject.position.x - this.cursorPosition.x) *
              this.forceList.spaceAttractStop;
            const attractY =
              (this.interactingObject.position.y - this.cursorPosition.y) *
              this.forceList.spaceAttractStop;

            this.velocity.set(attractX, attractY, 0);
          }
          break;
        }
      }
    }
  }

  setCursorPosition() {
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

      this.hover = true; // カーソル変化を起動

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
      this.hover = false;
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
        force = this.forceList.waterNormal;
        break;
      case 'stage2':
        force = this.forceList.stormNormal;
        break;
      case 'stage3':
        force = this.forceList.spaceNormal;
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
