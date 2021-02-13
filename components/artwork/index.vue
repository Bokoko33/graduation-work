<template>
  <div class="scene">
    <canvas ref="canvas" class="scene__canvas"></canvas>
    <ModalDescFirst v-if="visibleDescSp" :close-func="closeDescSp" />
  </div>
</template>

<script>
import ArtworkGL from './js/ArtworkGL';

export default {
  data() {
    // 基本的にはここにthree.jsのオブジェクトを追加しない。
    return {
      artworkGL: null,
      visibleDescSp: false,
    };
  },
  // watch: {
  //   '$route.name'(_new, _old) {
  //     // this.artworkGL.transition(_new);
  //   },
  // },
  mounted() {
    // 先にデバイスをチェックしてstateに格納
    const mql = window.matchMedia('(max-width:960px)');
    this.changeDevice(mql);
    mql.addEventListener('change', this.changeDevice);

    // spなら説明モーダルを表示
    if (this.$store.state.isMobile) {
      this.visibleDescSp = true;
      this.$store.commit('setHowToTouch', 'first');
    }

    // canvas要素を渡す。
    this.artworkGL = new ArtworkGL({
      $canvas: this.$refs.canvas,
      path: this.$route.path,
      isMobile: this.$store.state.isMobile,
    });
  },
  methods: {
    // この中にthree.jsの処理をばりばり書かない。
    changeDevice(mql) {
      this.$store.commit('setDevice', mql.matches);
      if (this.artworkGL) this.artworkGL.changeDevice(mql.matches);
    },
    closeDescSp() {
      this.visibleDescSp = false;
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
