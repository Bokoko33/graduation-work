import * as THREE from 'three';
import { colors } from './variable';

export default class GoalLink {
  constructor(pos, path, type) {
    this.position = pos;

    // global or goal
    this.type = type;

    // このリンクをクリックしたときの遷移先
    // nextならゴール地点のリンクなので次のステージを指す
    // Cursor.jsから参照される
    this.nextPathName = path;

    this.defaultColor = new THREE.Color(colors.gray);
    this.hoverColor = new THREE.Color(colors.white);

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init();
  }

  init() {
    if (this.type === 'global') {
      // テクスチャわけ
      // let texture = null;
      // switch (this.nextPathName) {
      //   case 'stage1':
      //     break;
      //   case 'stage2':
      //     break;
      //   case 'stage3':
      //     break;
      // }
      this.geometry = new THREE.PlaneBufferGeometry(100, 40, 2); // サイズはいずれ画像から取る
      this.material = new THREE.MeshLambertMaterial({
        color: this.defaultColor,
        depthTest: false,
      });
    } else if (this.type === 'goal') {
      // テクスチャわけ
      // let texture = null;
      // switch (this.nextPathName) {
      //   case 'stage1':
      //     break;
      //   case 'stage2':
      //     break;
      //   case 'stage3':
      //     break;
      // }
      this.geometry = new THREE.CircleBufferGeometry(60, 50);
      this.material = new THREE.MeshLambertMaterial({
        color: this.defaultColor,
      });
    }

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  update() {
    // this.mesh.rotation.y += 0.01;
  }

  mouseOver() {
    this.material.color = this.hoverColor;
  }

  mouseOut() {
    this.material.color = this.defaultColor;
  }
}
