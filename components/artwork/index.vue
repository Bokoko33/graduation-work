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
  watch: {
    '$route.name'(_new, _old) {
      this.artworkGL.transition(_new);
    },
  },
  mounted() {
    // canvas要素を渡す。
    this.artworkGL = new ArtworkGL({
      $canvas: this.$refs.canvas,
      $route: this.$route.name,
    });

    // mql
    this.$nextTick(() => {
      const mql = window.matchMedia('(max-width:960px)');
      this.changeDevice(mql);
      mql.addEventListener('change', this.changeDevice);
    });
  },

  destroyed() {
    // canvasを作ったり壊したりする前提の場合はここに処理停止する処理を書く（今回省略）。
  },
  methods: {
    // この中にthree.jsの処理をばりばり書かない。
    changeDevice(mql) {
      if (mql.matches) {
        this.$store.commit('changeDevice', true);
      } else {
        this.$store.commit('changeDevice', false);
      }
      console.log(this.$store.state.isMobile);
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
