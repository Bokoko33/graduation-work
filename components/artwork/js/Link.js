import * as THREE from 'three';
import { colors } from './variable';

export default class GoalLink {
  constructor(pos, path) {
    this.position = pos;
    this.defaultColor = new THREE.Color(colors.gray);
    this.hoverColor = new THREE.Color(colors.white);

    // このリンクをクリックしたときの遷移先
    // nextならゴール地点のリンクなので次のステージを指す
    this.nextPathName = path;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init(path);
  }

  init(path) {
    if (path === 'next') {
      this.geometry = new THREE.CircleBufferGeometry(60, 50);
      this.material = new THREE.MeshLambertMaterial({
        color: this.defaultColor,
        side: THREE.DoubleSide,
      });
    } else {
      this.geometry = new THREE.PlaneBufferGeometry(100, 40, 2);
      this.material = new THREE.MeshLambertMaterial({
        color: this.defaultColor,
        depthTest: false,
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
