<template>
  <div class="modal">
    <p class="modal__text">
      In this web site, you can handle cursor if you access here using a smart
      phone. Please touch “Virtual Pad” at the bottom right of the screen to
      move cursor. <br />You can change the position of “Virtual Pad” by the
      icon at the bottom left of the screen.
    </p>
    <p class="modal__text">
      このサイトでは、<strong>スマートフォンでもカーソルを扱います</strong>。通常のタッチ操作をする代わりに、<strong>画面右下の仮想トラックパッド</strong>を指で操作して、カーソルを動かしてね。<br />仮想トラックパッドの位置は、画面左下のアイコンから変更できます。
    </p>
    <ButtonClickable
      ref="okButton"
      class="modal__button"
      :text="'OK'"
      :click-action="closeModal"
    />
    <div ref="cursor" class="modal__cursor"></div>
    <AnimationUpDown class="modal__animation" />
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
  background-color: black;
  opacity: 0.8;
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

.modal__animation {
  position: absolute;
  bottom: 15vh;
  right: 5vw;
}
</style>
