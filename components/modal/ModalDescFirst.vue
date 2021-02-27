<template>
  <div class="modal">
    <p class="modal__text">
      In this web site, you operate cursor if you access here using a smart
      phone. Please touch “Virtual Pad” at the bottom right of the screen to
      move cursor. <br />You can change the position of “Virtual Pad” by swiping
      it two fingers.
    </p>
    <p class="modal__text">
      このサイトでは、<strong>スマートフォンでもカーソルを扱います</strong>。通常のタッチ操作やスクロールをする代わりに、<strong>画面右下の仮想トラックパッド</strong>を指で操作して、カーソルを動かしてね。<br />二本指操作で仮想トラックパッドの位置を自由に変えられます。
    </p>
    <ButtonClickable
      ref="okButton"
      class="modal__button"
      :text="'OK'"
      :click-action="closeModal"
    />
    <div ref="cursor" class="modal__cursor"></div>
  </div>
</template>

<script>
export default {
  props: {
    closeFunc: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      loopCallbackId: null,
    };
  },
  mounted() {
    this.loop();
  },
  beforeDestroy() {},
  methods: {
    loop() {
      // カーソルの移動
      const x = this.$interFace.cursorPos.x;
      const y = this.$interFace.cursorPos.y;
      this.$refs.cursor.style.transform = `translate(${x}px, ${y}px)`;

      // ボタンとの当たり判定
      this.$refs.okButton.detectCollision();
      this.loopCallbackId = requestAnimationFrame(this.loop);
    },
    closeModal() {
      cancelAnimationFrame(this.loopCallbackId);
      this.$store.commit('setHowToTouch', 'double');
      this.closeFunc();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(#000000, 0.85);
  padding: 8vh 5vw;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal__text {
  margin-top: 20px;
  font-size: 14px;
}

.modal__button {
  margin-top: 40px;
}

.modal__cursor {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background-image: url('~@/assets/images/common/cursor.png');
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
