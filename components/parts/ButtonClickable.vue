<template>
  <button ref="button" class="button" :class="{ hover }">{{ text }}</button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    clickAction: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
      pos: {
        x: 0,
        y: 0,
      },
      hover: false,
    };
  },
  mounted() {
    this.initTransform();
    this.$interFace.setClickEvent(this.click);
  },
  methods: {
    initTransform() {
      const element = this.$refs.button;
      // 大きさを参照
      this.width = element.clientWidth;
      this.height = element.clientHeight;
      // 座標をcssから参照して格納
      const clientRect = element.getBoundingClientRect();
      this.pos.x = clientRect.left;
      this.pos.y = clientRect.top;
    },
    detectCollision() {
      // 当たり判定
      this.hover = this.$interFace.detectCollision(
        this.pos.x,
        this.pos.y,
        this.width,
        this.height
      );
    },
    click() {
      if (!this.hover) return;

      this.clickAction();
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  width: 60px;
  height: 40px;
  color: white;
  border: solid 1px white;
  border-radius: 2px;
}

.hover {
  color: black;
  background-color: white;
}
</style>
