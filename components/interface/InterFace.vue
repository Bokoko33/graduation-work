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
  background-color: white;
  opacity: 0.5;
  border-radius: 10px;

  -webkit-touch-callout: none; // リンク長押しのポップアップを無効化
  -webkit-user-select: none; // テキスト長押しの選択ボックスを無効化
  @include device-pc {
    display: none;
  }
}
</style>
