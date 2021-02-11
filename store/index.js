export const state = () => ({
  isMobile: false,
});

export const mutations = {
  setDevice(state, bool) {
    state.isMobile = bool;
  },
};
