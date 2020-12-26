import * as THREE from 'three';
// import waterVertexShader from '../glsl/objectWater.vert';
import stormVertexShader from '../glsl/objectStorm.vert';
import spaceVertexShader from '../glsl/objectSpace.vert';
// import stormFragmentShader from '../glsl/objectStorm.frag';
// import fragmentShader from '../glsl/objectCommon.frag';
import { colors } from './variable';

export default class MainObject {
  constructor(route, pos) {
    this.position = pos;
    this.defaultColor = null;
    this.rotateValue = {
      y: Math.random() - 1,
      z: Math.random() - 1,
    };

    // カーソルへの影響範囲（オブジェクトの半径ではなく、カーソルがインタラクションし始める範囲）
    this.interactRadius = 0;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    // uniform timeは共通なので最初に定義
    this.uniforms = {
      uTime: {
        value: 0,
      },
    };

    this.frameCount = 0;

    this.init(route);
  }

  init(route) {
    switch (route) {
      case 'stage1':
        this.interactRadius = 150;
        this.defaultColor = colors.red;
        this.createWaterObject(this.interactRadius, this.defaultColor);
        break;
      case 'stage2':
        this.interactRadius = 300;
        this.defaultColor = colors.blue;
        this.createStormObject(this.interactRadius);
        break;
      case 'stage3':
        this.interactRadius = 240;
        this.defaultColor = colors.white;
        this.createSpaceObject(this.interactRadius);
        break;
      default:
        break;
    }

    // メッシュを作成
    if (this.geometry) {
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }
  }

  createWaterObject(radius, colorCode) {
    this.geometry = new THREE.SphereBufferGeometry(radius, 128, 128);
    this.material = new THREE.MeshLambertMaterial({
      color: colorCode,
    });
    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: this.frameCount };
      shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
      const token = '#include <begin_vertex>';
      const customTransform = `
          vec3 transformed = vec3(position);
          transformed.x = position.x
               + sin(position.y*0.5 + time*5.0)*2.0;
      `;
      shader.vertexShader = shader.vertexShader.replace(token, customTransform);
    };
  }

  createStormObject(radius) {
    const instanceNum = 100;
    const offsets = []; // ポジションからのオフセット
    const initialRotate = []; // 回転の初期角

    // 元となるジオメトリ
    const originGeometry = new THREE.BoxBufferGeometry(20, 20, 20);

    this.geometry = new THREE.InstancedBufferGeometry();

    // 各パラメータをoriginからコピーしてセット
    const positions = originGeometry.attributes.position.clone();
    this.geometry.setAttribute('position', positions);

    const normal = originGeometry.attributes.normal.clone();
    this.geometry.setAttribute('normals', normal);

    const uv = originGeometry.attributes.uv.clone();
    this.geometry.setAttribute('uv', uv);

    const indices = originGeometry.index.clone();
    this.geometry.setIndex(indices);

    // offsetPosition、initialRotateを自作
    // instanceGeoから離れる = 一つ一つのパーティクルの座標
    for (let i = 0; i < instanceNum; i++) {
      offsets.push(
        Math.random() * radius - radius / 2,
        Math.random() * (2 * radius) - (2 * radius) / 2,
        Math.random() * radius - radius / 2
      );

      // パーティクルごとの回転の初期値
      initialRotate.push(Math.random() * 360);
    }

    this.geometry.setAttribute(
      'offsetPosition',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    );
    this.geometry.setAttribute(
      'initialRotate',
      new THREE.InstancedBufferAttribute(new Float32Array(initialRotate), 1)
    );

    // uniformを追加
    this.uniforms.diffuse = {
      value: new THREE.Vector3(1.0, 1.0, 1.0),
    };
    this.uniforms.roughness = {
      value: 0.5,
    };
    this.uniforms = THREE.UniformsUtils.merge([
      THREE.ShaderLib.standard.uniforms,
      this.uniforms,
    ]);

    // this.uni.uColor.value = new THREE.Color(colors.blue);

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: stormVertexShader,
      fragmentShader: THREE.ShaderLib.standard.fragmentShader,
      transparent: true,
      flatShading: true,
      lights: true,
    });
  }

  createSpaceObject(radius) {
    const instanceNum = 100;
    const offsets = []; // ポジションからのオフセット
    const initialRotate = []; // 回転の初期角

    // 元となるジオメトリ
    const originGeometry = new THREE.SphereBufferGeometry(20, 20, 20);

    this.geometry = new THREE.InstancedBufferGeometry();

    // 各パラメータをoriginからコピーしてセット
    const positions = originGeometry.attributes.position.clone();
    this.geometry.setAttribute('position', positions);

    const normal = originGeometry.attributes.normal.clone();
    this.geometry.setAttribute('normals', normal);

    const uv = originGeometry.attributes.uv.clone();
    this.geometry.setAttribute('uv', uv);

    const indices = originGeometry.index.clone();
    this.geometry.setIndex(indices);

    // offsetPosition、initialRotateを自作
    // instanceGeoから離れる = 一つ一つのパーティクルの座標
    for (let i = 0; i < instanceNum; i++) {
      offsets.push(
        Math.random() * radius - radius / 2,
        Math.random() * (2 * radius) - (2 * radius) / 2,
        Math.random() * radius - radius / 2
      );

      // パーティクルごとの回転の初期値
      initialRotate.push(Math.random() * 360);
    }

    this.geometry.setAttribute(
      'offsetPosition',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    );
    this.geometry.setAttribute(
      'initialRotate',
      new THREE.InstancedBufferAttribute(new Float32Array(initialRotate), 1)
    );

    // uniformをさらに追加
    this.uniforms.diffuse = {
      value: new THREE.Vector3(1.0, 1.0, 1.0),
    };
    this.uniforms.roughness = {
      value: 0.5,
    };
    this.uniforms = THREE.UniformsUtils.merge([
      THREE.ShaderLib.standard.uniforms,
      this.uniforms,
    ]);

    // this.uni.uColor.value = new THREE.Color(colors.blue);

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: spaceVertexShader,
      fragmentShader: THREE.ShaderLib.standard.fragmentShader,
      transparent: true,
      flatShading: true,
      lights: true,
    });
  }

  update() {
    this.uniforms.uTime.value += 0.01;
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
