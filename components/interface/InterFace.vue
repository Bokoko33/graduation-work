<template>
  <div class="interface">
    <div ref="trackpad" class="trackpad" @touchend="updateCursorZ()">
      <AnimationUpDown
        v-if="$store.state.howToTouch === 'first'"
        class="trackpad__animation"
      />
      <AnimationDoubleTap
        v-else-if="$store.state.howToTouch === 'double' && visibleDouble"
        class="trackpad__animation"
      />
    </div>
  </div>
</template>

<script>
import Cursor from './js/Cursor';

const initialCursorZ = Cursor.inputZ;

export default {
  data() {
    return {
      cursorZ: initialCursorZ,
    };
  },
  computed: {
    visibleDouble() {
      return this.cursorZ === 0 && this.$route.name !== 'about';
    },
  },
  mounted() {
    // pluginsを初期化
    this.$interFace.cursorInit();
    this.$interFace.trackPadInit(this.$refs.trackpad);
    // Cursor.jsに遷移イベントを追加
    Cursor.setClickEvent(this.pageTransition);
  },
  methods: {
    // Cursor.jsから呼ばれる
    pageTransition(routeName) {
      this.$router.push({ name: routeName });
      this.cursorZ = initialCursorZ;
    },
    updateCursorZ() {
      this.cursorZ = Cursor.inputZ;
    },
  },
};
</script>

<style lang="scss" scoped>
.trackpad {
  display: block;
  position: fixed;
  width: 28vw;
  height: 28vh;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;

  // jsで位置を制御
  top: 0;
  left: 0;

  -webkit-touch-callout: none; // リンク長押しのポップアップを無効化
  -webkit-user-select: none; // テキスト長押しの選択ボックスを無効化
  @include device-pc {
    display: none;
  }
}

.trackpad__animation {
  position: absolute;
  top: 5vh;
  left: 40%;
}
</style>
