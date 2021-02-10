import * as THREE from 'three';

let textures = [];
const loader = new THREE.TextureLoader();

export const initTexture = () => {
  textures = [
    // 共通
    {
      name: 'cursor',
      value: loader.load(require('@/assets/images/common/cursor.png')),
    },
    {
      name: 'logo',
      value: loader.load(require('@/assets/images/common/logo.png')),
    },
    {
      name: 'menu_water',
      value: loader.load(require('@/assets/images/common/menu_water.png')),
    },
    {
      name: 'menu_storm',
      value: loader.load(require('@/assets/images/common/menu_storm.png')),
    },
    {
      name: 'menu_space',
      value: loader.load(require('@/assets/images/common/menu_space.png')),
    },
    {
      name: 'menu_about',
      value: loader.load(require('@/assets/images/common/menu_about.png')),
    },
    {
      name: 'goal_top',
      value: loader.load(require('@/assets/images/common/goal_top.png')),
    },
    {
      name: 'goal_water',
      value: loader.load(require('@/assets/images/common/goal_water.png')),
    },
    {
      name: 'goal_storm',
      value: loader.load(require('@/assets/images/common/goal_storm.png')),
    },
    {
      name: 'goal_space',
      value: loader.load(require('@/assets/images/common/goal_space.png')),
    },
    {
      name: 'goal_back',
      value: loader.load(require('@/assets/images/common/goal_back.png')),
    },
    {
      name: 'goal_text_en',
      value: loader.load(require('@/assets/images/common/goal_text_en.png')),
    },
    {
      name: 'goal_text_ja',
      value: loader.load(require('@/assets/images/common/goal_text_ja.png')),
    },
    // --- PC ---
    {
      name: 'bg_main_pc',
      value: loader.load(require('@/assets/images/pc/background_main.jpg')),
    },
    {
      name: 'bg_water_pc',
      value: loader.load(require('@/assets/images/pc/background_water.jpg')),
    },
    {
      name: 'bg_storm_pc',
      value: loader.load(require('@/assets/images/pc/background_storm.jpg')),
    },
    {
      name: 'bg_space_pc',
      value: loader.load(require('@/assets/images/pc/background_space.jpg')),
    },
    {
      name: 'mv_title_pc',
      value: loader.load(require('@/assets/images/pc/mv_title.png')),
    },
    {
      name: 'mv_text_pc',
      value: loader.load(require('@/assets/images/pc/mv_text.png')),
    },
    {
      name: 'panel_top_1_pc',
      value: loader.load(require('@/assets/images/pc/panel_top_1.png')),
    },
    {
      name: 'panel_top_2_pc',
      value: loader.load(require('@/assets/images/pc/panel_top_2.png')),
    },
    {
      name: 'panel_top_3_pc',
      value: loader.load(require('@/assets/images/pc/panel_top_3.png')),
    },
    {
      name: 'panel_top_4_pc',
      value: loader.load(require('@/assets/images/pc/panel_top_4.png')),
    },
    {
      name: 'panel_top_5_pc',
      value: loader.load(require('@/assets/images/pc/panel_top_5.png')),
    },
    {
      name: 'panel_water_pc',
      value: loader.load(require('@/assets/images/pc/panel_water.png')),
    },
    {
      name: 'panel_storm_pc',
      value: loader.load(require('@/assets/images/pc/panel_storm.png')),
    },
    {
      name: 'panel_space_pc',
      value: loader.load(require('@/assets/images/pc/panel_space.png')),
    },
    // --- ---
    // --- SP ---
    {
      name: 'bg_main_sp',
      value: loader.load(require('@/assets/images/sp/background_main.jpg')),
    },
    {
      name: 'bg_water_sp',
      value: loader.load(require('@/assets/images/sp/background_water.jpg')),
    },
    {
      name: 'bg_storm_sp',
      value: loader.load(require('@/assets/images/sp/background_storm.jpg')),
    },
    {
      name: 'bg_space_sp',
      value: loader.load(require('@/assets/images/sp/background_space.jpg')),
    },
    {
      name: 'mv_title_sp',
      value: loader.load(require('@/assets/images/sp/mv_title.png')),
    },
    {
      name: 'mv_text_sp',
      value: loader.load(require('@/assets/images/sp/mv_text.png')),
    },
    {
      name: 'panel_top_1_sp',
      value: loader.load(require('@/assets/images/sp/panel_top_1.png')),
    },
    {
      name: 'panel_top_2_sp',
      value: loader.load(require('@/assets/images/sp/panel_top_2.png')),
    },
    {
      name: 'panel_top_3_sp',
      value: loader.load(require('@/assets/images/sp/panel_top_3.png')),
    },
    {
      name: 'panel_top_4_sp',
      value: loader.load(require('@/assets/images/sp/panel_top_4.png')),
    },
    {
      name: 'panel_top_5_sp',
      value: loader.load(require('@/assets/images/sp/panel_top_5.png')),
    },
    {
      name: 'panel_water_sp',
      value: loader.load(require('@/assets/images/sp/panel_water.png')),
    },
    {
      name: 'panel_storm_sp',
      value: loader.load(require('@/assets/images/sp/panel_storm.png')),
    },
    {
      name: 'panel_space_sp',
      value: loader.load(require('@/assets/images/sp/panel_space.png')),
    },
  ];
};

export const getTexture = (name) => {
  const texture = textures.find((tex) => tex.name === name);

  return texture.value;
};
