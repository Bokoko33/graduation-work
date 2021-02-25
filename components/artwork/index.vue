<template>
  <div class="scene">
    <canvas ref="canvas" class="scene__canvas"></canvas>
  </div>
</template>

<script>
import ArtworkGL from './js/ArtworkGL';

export default {
  data() {
    // 基本的にはここにthree.jsのオブジェクトを追加しない。
    return {
      artworkGL: null,
    };
  },
  mounted() {
    // 先にデバイスをチェックしてstateに格納
    const mql = window.matchMedia('(max-width:960px)');
    this.changeDevice(mql);

    // safariだけmql.addEventListenerがない
    if (mql.addEventListener === undefined) {
      mql.addListener(this.changeDevice);
    } else {
      mql.addEventListener('change', this.changeDevice);
    }

    // canvas要素を渡す。
    this.artworkGL = new ArtworkGL({
      $canvas: this.$refs.canvas,
      routeName: this.$route.name,
      isMobile: this.$store.state.isMobile,
    });
  },
  methods: {
    // この中にthree.jsの処理をばりばり書かない。
    changeDevice(mql) {
      this.$store.commit('setDevice', mql.matches);
      if (this.artworkGL) this.artworkGL.changeDevice(mql.matches);
    },
  },
};
</script>

<style>
.scene {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.scene__canvas {
  width: 100%;
  height: 100%;
}
</style>
