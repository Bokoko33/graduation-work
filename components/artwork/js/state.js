// デバイスごとに用意する画像の固定の縮小率
const imageRate = 0.32;
// pc/sp共通で使う画像のそれぞれでの縮小率
const commonImageRate = { pc: 0.32, sp: 0.2 };

export const state = {
  fixedImageRate: imageRate,
  variableImageRate: imageRate, // 初期値
  isMobile: false,
};

export const setDevice = (isMobile) => {
  state.isMobile = isMobile;
};

export const setImageShrinkRate = (isMobile) => {
  if (isMobile) state.variableImageRate = commonImageRate.sp;
  else state.variableImageRate = commonImageRate.pc;
};
