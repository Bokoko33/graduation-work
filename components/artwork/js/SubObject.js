import * as THREE from 'three';
import waterVertexShader from '../glsl/objectWater.vert';
import stormVertexShader from '../glsl/objectStorm.vert';
import spaceVertexShader from '../glsl/objectSpace.vert';
import { colors } from './variable';

export default class SubObject {
  constructor(path, pos, windowSize) {
    this.position = pos;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    // uniform timeは共通なので最初に定義
    this.uniforms = {
      uTime: { value: 0 },
    };

    this.init(path, windowSize);
  }

  init(path, windowSize) {
    switch (path) {
      case '/':
        this.createMainObject(windowSize);
        break;
      case '/stage1':
        this.createWaterObject();
        break;
      case '/stage2':
        this.createStormObject();
        break;
      case '/stage3':
        this.createSpaceObject();
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

  createMainObject(windowSize) {
    const transformList = [
      // sはサイズ
      { x: -0.25, y: -0.2, z: 2800, s: 140 },
      { x: 0.18, y: 0.1, z: 2500, s: 120 },
      { x: -0.45, y: 1, z: 1200, s: 320 },
      { x: 0.07, y: -0.6, z: 1000, s: 200 },
      { x: 0.4, y: -0.4, z: -500, s: 100 },
      { x: 0.6, y: 0.6, z: -700, s: 100 },
      { x: -0.57, y: -0.2, z: -1800, s: 200 },
      { x: 0.42, y: 0.14, z: -2000, s: 120 },
      { x: 0.3, y: -0.6, z: -3000, s: 200 },
      { x: -0.5, y: 0.8, z: -3300, s: 150 },
    ];

    // 空のジオメトリを作成
    this.geometry = new THREE.Geometry();

    // 球体
    for (let i = 0; i < transformList.length; i++) {
      // 立方体個別の要素を作成
      const meshTemp = new THREE.Mesh(
        new THREE.SphereGeometry(transformList[i].s, 64, 64)
      );
      // ひとつひとつの座標を設定
      meshTemp.position.set(
        windowSize.w * transformList[i].x,
        windowSize.h * transformList[i].y,
        transformList[i].z
      );
      // メッシュをマージ（結合）
      this.geometry.mergeMesh(meshTemp);
    }

    // マテリアルを作成
    this.material = new THREE.MeshLambertMaterial({
      color: colors.lightGray,
    });
  }

  createWaterObject(radius) {
    const vertexNum = 128;
    const offsets = [];
    this.geometry = new THREE.SphereBufferGeometry(
      radius,
      vertexNum,
      vertexNum
    );

    for (let i = 0; i < vertexNum; i++) {
      offsets.push(Math.random());
    }
    this.geometry.setAttribute(
      'offset',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 1)
    );

    // uniformを追加
    this.uniforms.diffuse = { value: new THREE.Vector3(1.0, 1.0, 1.0) };
    this.uniforms.roughness = { value: 0.1 };
    this.uniforms.color = { value: new THREE.Color(colors.mint) };
    this.uniforms = THREE.UniformsUtils.merge([
      this.uniforms,
      THREE.ShaderLib.standard.uniforms,
      THREE.UniformsLib.fog,
    ]);
    this.uniforms.opacity = { value: 0.5 }; // libraryを上書きするために後に書く

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: waterVertexShader,
      fragmentShader: THREE.ShaderLib.standard.fragmentShader,
      transparent: true,
      flatShading: true,
      lights: true,
      fog: true,
      depthWrite: false,
    });
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
    this.uniforms.diffuse = { value: new THREE.Vector3(1.0, 1.0, 1.0) };
    this.uniforms.roughness = { value: 0.1 };
    this.uniforms.color = { value: new THREE.Color(colors.mint) };
    this.uniforms = THREE.UniformsUtils.merge([
      this.uniforms,
      THREE.ShaderLib.standard.uniforms,
      THREE.UniformsLib.fog,
    ]);

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: stormVertexShader,
      fragmentShader: THREE.ShaderLib.standard.fragmentShader,
      transparent: true,
      flatShading: true,
      lights: true,
      fog: true,
    });
  }

  createSpaceObject(radius) {
    const instanceNum = 2000;
    const offsets = []; // ポジションからのオフセット
    const initialRotate = []; // 回転の初期角
    const rotateDirections = []; // 回転の方向-1or1
    const slVariables = []; // 球面補間の補間値

    // 元となるジオメトリ
    const originGeometry = new THREE.SphereBufferGeometry(2, 2, 10);

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

    // offsetPosition、velocitiesを自作
    // instanceGeoから離れる = 一つ一つのパーティクルの座標
    for (let i = 0; i < instanceNum; i++) {
      offsets.push(
        Math.random() * radius - radius / 2,
        Math.random() * radius - radius / 2,
        Math.random() * radius - radius / 2
      );

      // パーティクルごとの回転の初期値
      initialRotate.push(Math.random() * 360);

      // 回転の方向 -1or1
      const dir = [-1, 1];
      rotateDirections.push(
        dir[Math.floor(Math.random() * 2)],
        dir[Math.floor(Math.random() * 2)]
      );

      slVariables.push(Math.random());
    }

    this.geometry.setAttribute(
      'offsetPosition',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    );
    this.geometry.setAttribute(
      'initialRotate',
      new THREE.InstancedBufferAttribute(new Float32Array(initialRotate), 1)
    );
    this.geometry.setAttribute(
      'rotateDirections',
      new THREE.InstancedBufferAttribute(new Float32Array(rotateDirections), 2)
    );
    this.geometry.setAttribute(
      'slVariable',
      new THREE.InstancedBufferAttribute(new Float32Array(slVariables), 1)
    );

    // uniformをさらに追加
    this.uniforms.diffuse = { value: new THREE.Vector3(1.0, 1.0, 1.0) };
    this.uniforms.roughness = { value: 0.1 };
    this.uniforms.color = { value: new THREE.Color(colors.black) };
    this.uniforms = THREE.UniformsUtils.merge([
      this.uniforms,
      THREE.ShaderLib.standard.uniforms,
      THREE.UniformsLib.fog,
    ]);

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: spaceVertexShader,
      fragmentShader: THREE.ShaderLib.standard.fragmentShader,
      transparent: true,
      flatShading: true,
      lights: true,
      fog: true,
    });
  }

  update() {
    this.uniforms.uTime.value++;
  }

  delete() {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
  }
}
