<template>
  <div class="animation">
    <div class="animation__circle"></div>
    <img
      class="animation__finger"
      src="@/assets/images/svg/finger.svg"
      width="44"
      height="44"
      alt=""
    />
  </div>
</template>

<style lang="scss" scoped>
@keyframes double-tap-effect {
  0% {
    opacity: 0;
  }
  14% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  24% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  81% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@keyframes double-tap-finger {
  0% {
    transform: rotateZ(0deg);
  }
  10% {
    transform: rotateZ(-20deg);
  }
  15% {
    transform: rotateZ(10deg);
  }
  20% {
    transform: rotateZ(-20deg);
  }
  25% {
    transform: rotateZ(10deg);
  }
  80% {
    transform: rotateZ(10deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}

.animation {
  position: absolute;
  transform-origin: center;
}

.animation__circle {
  width: 24px;
  height: 24px;
  // border: solid 2px white;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;

  animation: double-tap-effect 2.2s ease-out 0s infinite normal both running;
}

.animation__finger {
  position: absolute;
  width: 50px;
  height: 50px;
  top: 8px;
  left: -10px;

  animation: double-tap-finger 2.2s ease-out 0s infinite normal both running;
}
</style>
