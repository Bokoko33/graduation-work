import * as THREE from 'three';

let textures = [];
const loader = new THREE.TextureLoader();

export const initTexture = () => {
  textures = [
    {
      name: 'bg_main_pc',
      value: loader.load(require('@/assets/images/background_main_pc.jpg')),
    },
    {
      name: 'bg_water_pc',
      value: loader.load(require('@/assets/images/background_water_pc.jpg')),
    },
    {
      name: 'bg_storm_pc',
      value: loader.load(require('@/assets/images/background_storm_pc.jpg')),
    },
    {
      name: 'bg_space_pc',
      value: loader.load(require('@/assets/images/background_space_pc.jpg')),
    },
    {
      name: 'cursor',
      value: loader.load(require('@/assets/images/cursor.png')),
    },
    {
      name: 'logo',
      value: loader.load(require('@/assets/images/logo.png')),
    },
    {
      name: 'menu_water',
      value: loader.load(require('@/assets/images/menu_water.png')),
    },
    {
      name: 'menu_storm',
      value: loader.load(require('@/assets/images/menu_storm.png')),
    },
    {
      name: 'menu_space',
      value: loader.load(require('@/assets/images/menu_space.png')),
    },
    {
      name: 'menu_about',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'goal_top',
      value: loader.load(require('@/assets/images/panel_goal_water.png')),
    },
    {
      name: 'goal_water',
      value: loader.load(require('@/assets/images/panel_goal_water.png')),
    },
    {
      name: 'goal_storm',
      value: loader.load(require('@/assets/images/panel_goal_water.png')),
    },
    {
      name: 'goal_space',
      value: loader.load(require('@/assets/images/panel_goal_water.png')),
    },
    {
      name: 'goal_back',
      value: loader.load(require('@/assets/images/panel_goal_back.png')),
    },
    {
      name: 'panel_top_mv_pc',
      value: loader.load(require('@/assets/images/panel_top_mv_pc.png')),
    },
    {
      name: 'panel_top_desc_1',
      value: loader.load(require('@/assets/images/panel_top_desc_1.png')),
    },
    {
      name: 'panel_top_desc_2',
      value: loader.load(require('@/assets/images/panel_top_desc_2.png')),
    },
    {
      name: 'panel_top_desc_3',
      value: loader.load(require('@/assets/images/panel_top_desc_3.png')),
    },
    {
      name: 'panel_top_desc_4',
      value: loader.load(require('@/assets/images/panel_top_desc_4.png')),
    },
    {
      name: 'panel_top_desc_5',
      value: loader.load(require('@/assets/images/panel_top_desc_5.png')),
    },
    {
      name: 'panel_water',
      value: loader.load(require('@/assets/images/panel_water.png')),
    },
    {
      name: 'panel_storm',
      value: loader.load(require('@/assets/images/panel_storm.png')),
    },
    {
      name: 'panel_space',
      value: loader.load(require('@/assets/images/panel_space.png')),
    },
    {
      name: 'text_top',
      value: loader.load(require('@/assets/images/text_top.png')),
    },
    {
      name: 'text_goal_en',
      value: loader.load(require('@/assets/images/text_goal_en.png')),
    },
    {
      name: 'text_goal_ja',
      value: loader.load(require('@/assets/images/text_goal_ja.png')),
    },
  ];
};

export const getTexture = (name) => {
  const texture = textures.find((tex) => tex.name === name);

  return texture.value;
};
