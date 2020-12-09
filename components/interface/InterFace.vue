<template>
  <div id="trackpad" class="trackpad"></div>
</template>

<script>
import Cursor from './js/Cursor';

export default {
  mounted() {
    // Cursor.jsに遷移イベントを追加
    Cursor.setClickEvent(this.pageTransition);
  },
  methods: {
    // Cursor.jsから呼ばれる
    pageTransition(pathName) {
      this.$router.push(pathName);
    },
  },
};
</script>

<style lang="scss" scoped>
.trackpad {
  display: block;
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 35vw;
  height: 35vh;
  background-color: skyblue;
  opacity: 0.5;
  border-radius: 10px;
  @include device-pc {
    display: none;
  }
}
</style>
