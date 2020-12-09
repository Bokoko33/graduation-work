import * as THREE from 'three';
import { colors } from './variable';

export default class Link {
  constructor(pos, path, type) {
    this.position = pos;

    // global or goal
    this.type = type;

    // このリンクをクリックしたときの遷移先
    // nextならゴール地点のリンクなので次のステージを指す
    // Cursor.jsから参照される
    this.nextPathName = path;

    this.defaultColor = null;
    this.hoverColor = new THREE.Color(colors.white);

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init();
  }

  init() {
    if (this.type === 'global') {
      this.defaultColor = new THREE.Color(colors.gray);
      // テクスチャわけ
      // switch (this.nextPathName) {
      //   case 'stage1':
      //     this.defaultColor = new THREE.Color(colors.blue);
      //     break;
      //   case 'stage2':
      //     this.defaultColor = new THREE.Color(colors.green);
      //     break;
      //   case 'stage3':
      //     this.defaultColor = new THREE.Color(colors.black);
      //     break;
      // }
      this.geometry = new THREE.PlaneBufferGeometry(100, 40, 2); // サイズはいずれ画像から取る
      this.material = new THREE.MeshLambertMaterial({
        color: this.defaultColor,
        depthTest: false,
      });
    } else if (this.type === 'goal') {
      // テクスチャわけ
      switch (this.nextPathName) {
        case '/':
          this.defaultColor = new THREE.Color(colors.pink);
          break;
        case 'stage1':
          this.defaultColor = new THREE.Color(colors.blue);
          break;
        case 'stage2':
          this.defaultColor = new THREE.Color(colors.green);
          break;
        case 'stage3':
          this.defaultColor = new THREE.Color(colors.black);
          break;
      }
      this.geometry = new THREE.CircleBufferGeometry(40, 50);
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
