import Vue from 'vue';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';

Vue.prototype.EffectComposer = EffectComposer;
Vue.prototype.RenderPass = RenderPass;
Vue.prototype.BloomPass = BloomPass;
Vue.prototype.UnrealBloomPass = UnrealBloomPass;
Vue.prototype.ShaderPass = ShaderPass;
Vue.prototype.CopyShader = CopyShader;
