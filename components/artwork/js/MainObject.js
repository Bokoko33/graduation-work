import * as THREE from 'three';

export default class MainObject {
  constructor(route, pos) {
    this.position = pos;
    this.defaultColor = 0xdc7bae;
    this.rotateValue = {
      y: Math.random() - 1,
      z: Math.random() - 1,
    };

    // カーソルへの影響範囲（オブジェクトの半径ではなく、カーソルがインタラクションし始める範囲）
    this.interactRadius = 0;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init(route);
  }

  init(route) {
    switch (route) {
      case 'stage1':
        this.interactRadius = 150;
        this.geometry = new THREE.SphereBufferGeometry(
          this.interactRadius,
          30,
          30
        );
        break;
      case 'stage2':
        this.interactRadius = 300;
        this.geometry = new THREE.BoxBufferGeometry(
          this.interactRadius * 0.2,
          this.interactRadius * 0.2,
          this.interactRadius * 0.2
        );
        break;
      case 'stage3':
        this.interactRadius = 200;
        this.geometry = new THREE.SphereBufferGeometry(
          this.interactRadius * 0.5,
          30,
          30
        );
        break;
      default:
        break;
    }

    this.material = new THREE.MeshLambertMaterial({
      color: this.defaultColor,
    });

    // メッシュを作成
    if (this.geometry) {
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }
  }

  update() {
    if (this.geometry) {
      this.mesh.rotation.y += this.rotateValue.y * 0.01;
      this.mesh.rotation.z += this.rotateValue.z * 0.01;
    }
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
