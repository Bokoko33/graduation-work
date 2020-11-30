import * as THREE from 'three';

export default class MainObject {
  constructor(route, pos) {
    this.position = pos;
    this.defaultColor = 0xdc7bae;
    this.rotateValue = {
      y: Math.random() - 1,
      z: Math.random() - 1,
    };

    // カーソルへの影響範囲
    this.interactRadius = 150;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.hitBox = null;

    this.init(route);
  }

  init(route) {
    switch (route) {
      case 'stage1':
        this.geometry = new THREE.SphereBufferGeometry(
          this.interactRadius,
          30,
          30
        );
        break;
      case 'stage2':
        this.geometry = new THREE.BoxBufferGeometry(
          this.interactRadius * 2,
          this.interactRadius * 2,
          300
        );
        break;
      case 'stage3':
        this.geometry = new THREE.TorusBufferGeometry(
          this.interactRadius,
          10,
          30,
          100
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

    if (this.geometry.boundingSphere === null) {
      this.geometry.computeBoundingSphere();
      this.geometry.boundingSphere.radius *= 0.1;
    }

    this.hitBox = new THREE.Box3().setFromObject(this.mesh);
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
