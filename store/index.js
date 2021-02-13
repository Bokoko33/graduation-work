export const state = () => ({
  isMobile: false,
  howToTouch: 'none',
});

export const mutations = {
  setDevice(state, bool) {
    state.isMobile = bool;
  },
  setHowToTouch(state, value) {
    state.howToTouch = value;
  },
};
