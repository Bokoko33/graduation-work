<template>
  <div>
    <Artwork />
    <Nuxt />
    <ModalDescFirst v-if="visibleDescSp" :close-func="closeDescSp" />
    <InterFace />
  </div>
</template>

<script>
export default {
  data() {
    return {
      visibleDescSp: false,
    };
  },
  mounted() {
    // spなら説明モーダルを表示
    if (this.$store.state.isMobile) {
      this.visibleDescSp = true;
      this.$store.commit('setHowToTouch', 'first');
    }
  },
  methods: {
    closeDescSp() {
      this.visibleDescSp = false;
    },
  },
};
</script>
