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
      if (pathName === 'next') {
        switch (this.$route.name) {
          case 'index':
            this.$router.push('stage1');
            break;
          case 'stage1':
            this.$router.push('stage2');
            break;
          case 'stage2':
            this.$router.push('stage3');
            break;
          case 'stage3':
            this.$router.push('ending');
            break;
          case 'ending':
            this.$router.push('/');
            break;
          default:
            break;
        }
      } else {
        this.$router.push(pathName);
      }
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
