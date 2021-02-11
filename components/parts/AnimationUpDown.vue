<template>
  <div class="animation">
    <div class="animation__circle"></div>
    <img
      class="animation__finger"
      src="@/assets/images/svg/finger.svg"
      alt=""
    />
  </div>
</template>

<style lang="scss" scoped>
@keyframes updown {
  0% {
    transform: translateY(10%);
  }
  100% {
    transform: translateY(90%);
  }
}

.animation {
  position: absolute;
  transform-origin: center;
  animation: updown 1.2s ease-out 0s infinite normal both running;
}

.animation__circle {
  width: 24px;
  height: 24px;
  // border: solid 2px white;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

.animation__finger {
  width: 50px;
  height: 50px;
  transform: translate(-8px, -15px);
}
</style>
