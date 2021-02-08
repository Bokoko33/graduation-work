// デバイスごとに用意する画像の固定の縮小率
const imageRate = 0.32;
// pc/sp共通で使う画像のそれぞれでの縮小率
const commonImageRate = { pc: 0.32, sp: 0.2 };

// オブジェクトの縮小率をデバイスごとに変える
const objectSizeRate = { pc: 1, sp: 0.5 };

export const state = {
  windowSize: {
    w: 0,
    h: 0,
  },
  isMobile: false,
  fixedImageRate: imageRate, // 使いまわさない画像の縮小率
  variableImageRate: imageRate, // 使いまわす画像の縮小率
  objectSizeRate: objectSizeRate.pc, // オブジェクトの縮小率
};

export const setWindowSize = (size) => {
  state.windowSize.w = size.w;
  state.windowSize.h = size.h;
};

export const setDevice = (isMobile) => {
  state.isMobile = isMobile;
};

export const setImageShrinkRate = (isMobile) => {
  if (isMobile) state.variableImageRate = commonImageRate.sp;
  else state.variableImageRate = commonImageRate.pc;
};

export const setObjectSizeRate = (isMobile) => {
  if (isMobile) state.objectSizeRate = objectSizeRate.sp;
  else state.objectSizeRate = objectSizeRate.pc;
};
