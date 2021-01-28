const rate = { pc: 0.3, sp: 0.2 };

export const state = {
  imageShrinkRate: rate.pc,
  isMobile: false,
};

export const setDevice = (isMobile) => {
  state.isMobile = isMobile;
};

export const setImageShrinkRate = (isMobile) => {
  if (isMobile) state.imageShrinkRate = rate.sp;
  else state.imageShrinkRate = rate.pc;
};
