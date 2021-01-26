import * as THREE from 'three';

export default class TextObject {
  constructor(pos, width, heigh, texture) {
    this.position = pos;

    // 画像ごとに決める幅と高さ
    this.width = width;
    this.height = heigh;

    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.init();
  }

  init(key) {
    this.geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 2);
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0,
    });

    // メッシュを作成
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
