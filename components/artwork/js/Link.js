import * as THREE from 'three';
import vertexShader from '../glsl/globalMenu.vert';
import fragmentShader from '../glsl/globalMenu.frag';
import { colors } from './variable';
import { getTexture } from './textures';

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
      let texture = null;
      // テクスチャわけ
      switch (this.nextPathName) {
        case '/':
          texture = getTexture('globalMenuLogo');
          break;
        case 'stage1':
          texture = getTexture('globalMenuWater');
          break;
        case 'stage2':
          texture = getTexture('globalMenuStorm');
          break;
        case 'stage3':
          texture = getTexture('globalMenuSpace');
          break;
        case 'about':
          texture = getTexture('globalMenuAbout');
      }
      this.geometry = new THREE.PlaneBufferGeometry(133, 40, 2); // サイズはいずれ画像から取る
      this.material = new THREE.RawShaderMaterial({
        uniforms: {
          uTex: { type: 't', value: texture },
          uColor: { type: 'c', value: new THREE.Color(this.defaultColor) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
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
