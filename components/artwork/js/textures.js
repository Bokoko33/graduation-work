import * as THREE from 'three';

let textures = [];
const loader = new THREE.TextureLoader();

export const initTexture = () => {
  textures = [
    {
      name: 'globalMenuLogo',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'globalMenuWater',
      value: loader.load(require('@/assets/images/menu_water.png')),
    },
    {
      name: 'globalMenuStorm',
      value: loader.load(require('@/assets/images/menu_storm.png')),
    },
    {
      name: 'globalMenuSpace',
      value: loader.load(require('@/assets/images/menu_space.png')),
    },
    {
      name: 'globalMenuAbout',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'goalLinkTop',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'goalLinkWater',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'goalLinkStorm',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'goalLinkSpace',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'startPanelWater',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'startPanelStorm',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'startPanelSpace',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'descPanelTop1',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'descPanelTop2',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'descPanelTop3',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'descPanelTop4',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
    {
      name: 'descPanelAbout1',
      value: loader.load(require('@/assets/images/menu_about.png')),
    },
  ];
};

export const getTexture = (name) => {
  const texture = textures.find((tex) => tex.name === name);

  return texture.value;
};
