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
  },

  destroyed() {
    // canvasを作ったり壊したりする前提の場合はここに処理停止する処理を書く（今回省略）。
  },
  methods: {
    // この中にthree.jsの処理をばりばり書かない。
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
}

.scene__canvas {
  width: 100%;
  height: 100%;
}
</style>
