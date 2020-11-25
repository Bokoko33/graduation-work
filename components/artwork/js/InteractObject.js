import * as THREE from 'three';

export default class InteractObject {
  constructor(route, pos) {
    this.position = pos;
    this.init(route);
    this.defaultColor = 0xdc7bae;
    this.rotateValue = {
      y: Math.random() - 1,
      z: Math.random() - 1,
    };
  }

  init(route) {
    switch (route) {
      case 'stage1':
        this.geometry = new THREE.SphereBufferGeometry(150, 30, 30);
        break;
      case 'stage2':
        this.geometry = new THREE.BoxBufferGeometry(300, 300, 300);
        break;
      case 'stage3':
        this.geometry = new THREE.TorusBufferGeometry(150, 10, 30, 100);
        break;
      default:
        break;
    }

    this.material = new THREE.MeshLambertMaterial({
      color: this.defaultColor,
    });

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  update() {
    this.mesh.rotation.y += this.rotateValue.y * 0.01;
    this.mesh.rotation.z += this.rotateValue.z * 0.01;
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
