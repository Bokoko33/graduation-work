import * as THREE from 'three';

export default class Link {
  constructor(z) {
    this.radius = 60;
    this.position = new THREE.Vector3(0, 0, z);
    this.defaultColor = new THREE.Color(0xdc7bae);
    this.hoverColor = new THREE.Color(0xff0000);
    this.init();
  }

  init() {
    this.geometry = new THREE.CircleBufferGeometry(this.radius, 50);
    this.material = new THREE.MeshLambertMaterial({
      color: this.defaultColor,
      side: THREE.DoubleSide,
    });

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
