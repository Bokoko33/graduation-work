import * as THREE from 'three';
import waterVertexShader from '../glsl/subObjectWater.vert';
import stormVertexShader from '../glsl/subObjectStorm.vert';
import spaceVertexShader from '../glsl/subObjectSpace.vert';
import { colors } from './variable';
import { state } from './state';

export default class SubObject {
  constructor(route, pos) {
    this.position = pos;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    // uniform timeは共通なので最初に定義
    this.uniforms = {
      uTime: { value: 0 },
    };

    this.init(route);
  }

  init(route) {
    switch (route) {
      case 'index':
        this.createMainObject();
        break;
      case 'stage1':
        this.createWaterObject();
        break;
      case 'stage2':
        this.createStormObject();
        break;
      case 'stage3':
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

  createMainObject() {
    const transformList = [
      // sはサイズ
      { x: -0.25, y: -0.25, z: 7800, s: 120 },
      { x: 0.18, y: 0.1, z: 7500, s: 120 },
      { x: -0.45, y: 1, z: 6200, s: 320 },
      { x: 0.07, y: -0.6, z: 6000, s: 200 },
      { x: 0.4, y: -0.4, z: 4500, s: 100 },
      { x: 0.6, y: 0.6, z: 4300, s: 100 },
      { x: -0.57, y: -0.2, z: 3200, s: 200 },
      { x: 0.42, y: 0.14, z: 2700, s: 120 },
      { x: 0.3, y: -0.6, z: 2000, s: 200 },
      { x: -0.5, y: 0.8, z: 1600, s: 150 },
    ];

    // 空のジオメトリを作成
    this.geometry = new THREE.Geometry();

    // 球体
    for (let i = 0; i < transformList.length; i++) {
      // 立方体個別の要素を作成
      const meshTemp = new THREE.Mesh(
        new THREE.SphereGeometry(
          transformList[i].s * state.objectSizeRate,
          64,
          64
        )
      );
      // ひとつひとつの座標を設定
      meshTemp.position.set(
        state.windowSize.w * transformList[i].x,
        state.windowSize.h * transformList[i].y,
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

  createWaterObject() {
    const instanceNum = 500;
    const offsets = []; // ポジションからのオフセット（実質これがパーティクルの座標）
    const initialRotate = []; // 回転の初期値

    // 元となるジオメトリ
    const originGeometry = new THREE.TorusBufferGeometry(10, 5, 30, 100);

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
    const windowSize = state.windowSize;
    for (let i = 0; i < instanceNum; i++) {
      offsets.push(
        Math.random() * 4 * windowSize.w - 2 * windowSize.w,
        Math.random() * 4 * windowSize.h - 2 * windowSize.h,
        Math.random() * 8000
      );

      // パーティクルごとの回転の初期値
      initialRotate.push(
        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360
      );
    }

    this.geometry.setAttribute(
      'offsetPosition',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    );
    this.geometry.setAttribute(
      'initialRotate',
      new THREE.InstancedBufferAttribute(new Float32Array(initialRotate), 3)
    );

    // uniformを追加
    this.uniforms.diffuse = { value: new THREE.Vector3(1.0, 1.0, 1.0) };
    this.uniforms.roughness = { value: 0.1 };
    this.uniforms.color = { value: new THREE.Color(colors.mint) };
    this.uniforms.windowSize = {
      value: new THREE.Vector2(windowSize.w, windowSize.h),
    };

    this.uniforms = THREE.UniformsUtils.merge([
      this.uniforms,
      THREE.ShaderLib.standard.uniforms,
      THREE.UniformsLib.fog,
    ]);

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: waterVertexShader,
      fragmentShader: THREE.ShaderLib.standard.fragmentShader,
      transparent: true,
      flatShading: true,
      lights: true,
      fog: true,
    });
  }

  createStormObject() {
    const instanceNum = 500;
    const offsets = []; // ポジションからのオフセット（実質これがパーティクルの座標）
    const initialRotate = []; // 回転の初期値

    // 元となるジオメトリ
    const originGeometry = new THREE.BoxBufferGeometry(10, 10, 10);

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
    const windowSize = state.windowSize;
    for (let i = 0; i < instanceNum; i++) {
      offsets.push(
        Math.random() * 4 * windowSize.w - 2 * windowSize.w,
        Math.random() * 4 * windowSize.h - 2 * windowSize.h,
        Math.random() * 8000
      );

      // パーティクルごとの回転の初期値
      initialRotate.push(
        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360
      );
    }

    this.geometry.setAttribute(
      'offsetPosition',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    );
    this.geometry.setAttribute(
      'initialRotate',
      new THREE.InstancedBufferAttribute(new Float32Array(initialRotate), 3)
    );

    // uniformを追加
    this.uniforms.diffuse = { value: new THREE.Vector3(1.0, 1.0, 1.0) };
    this.uniforms.roughness = { value: 0.1 };
    this.uniforms.color = { value: new THREE.Color(colors.mint) };
    this.uniforms.windowSize = {
      value: new THREE.Vector2(windowSize.w, windowSize.h),
    };

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

  createSpaceObject() {
    const instanceNum = 5000;
    const offsets = []; // ポジションからのオフセット（実質これがパーティクルの座標）
    const initialRotate = []; // 回転の初期値

    // 元となるジオメトリ
    const originGeometry = new THREE.SphereBufferGeometry(10, 10, 10, 10);

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
    const windowSize = state.windowSize;
    for (let i = 0; i < instanceNum; i++) {
      offsets.push(
        Math.random() * 4 * windowSize.w - 2 * windowSize.w,
        Math.random() * 4 * windowSize.h - 2 * windowSize.h,
        Math.random() * 8000
      );

      // パーティクルごとの回転の初期値
      initialRotate.push(
        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360
      );
    }

    this.geometry.setAttribute(
      'offsetPosition',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    );
    this.geometry.setAttribute(
      'initialRotate',
      new THREE.InstancedBufferAttribute(new Float32Array(initialRotate), 3)
    );

    // uniformを追加
    this.uniforms.diffuse = { value: new THREE.Vector3(1.0, 1.0, 1.0) };
    this.uniforms.roughness = { value: 0.1 };
    this.uniforms.color = { value: new THREE.Color(colors.mint) };
    this.uniforms.windowSize = {
      value: new THREE.Vector2(windowSize.w, windowSize.h),
    };

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
