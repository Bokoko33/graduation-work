export const state = () => ({
  isMobile: false,
});

export const mutations = {
  changeDevice(state, bool) {
    state.isMobile = bool;
  },
};
