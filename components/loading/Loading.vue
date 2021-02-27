<template>
  <transition name="loading">
    <div v-if="loading" :style="bgColor" class="loading">
      <p class="loading__text-before">{{ textBefore }}</p>
      <p class="loading__text-after">{{ textAfter }}</p>
    </div>
  </transition>
</template>

<script>
import { colors } from '../artwork/js/variable';

export default {
  data() {
    return {
      loading: false,
      bgColorAfter: '',
      bgColorBefore: '',
      textBefore: 'Next is ...',
      textAfter: '',
    };
  },
  computed: {
    bgColor() {
      // cssで参照するためのcomputed
      return {
        '--bg-color-next': this.bgColorAfter,
        '--bg-color-before': this.bgColorBefore,
      };
    },
  },
  watch: {
    '$route.name'(to, from) {
      // url変更を検知して背景色や文字を設定
      const bgAfter = this.getContent(to);
      const bgBefore = this.getContent(from);
      this.bgColorAfter = bgAfter.color;
      this.bgColorBefore = bgBefore.color;

      this.textAfter = bgAfter.text;
    },
  },
  mounted() {
    this.bgColorBefore = this.getContent(this.$route.name).color;
  },
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      setTimeout(() => {
        this.loading = false;
        this.bgPreColor = this.bgColor.beforeColor;
      }, 2000);
    },
    getContent(route) {
      // ローディング画面の情報
      const bgObject = { color: '', text: '' };
      switch (route) {
        case 'index':
          bgObject.color = colors.lightPurple;
          bgObject.text = 'Site Top';
          break;
        case 'water-world':
          bgObject.color = colors.blue;
          bgObject.text = 'Water World';
          break;
        case 'storm-world':
          bgObject.color = colors.green;
          bgObject.text = 'Storm World';
          break;
        case 'space-world':
          bgObject.color = colors.darkPurple;
          bgObject.text = 'Space World';
          break;
        case 'about':
          bgObject.color = colors.purple;
          bgObject.text = 'About this product';
          break;
        default:
          bgObject.color = colors.lightPurple;
          bgObject.text = '???';
      }
      bgObject.color = '#' + bgObject.color.toString(16);
      return bgObject;
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--bg-color-before);
  padding: 0 25vw;

  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;

  z-index: 99999;

  animation-name: color-change;
  animation-duration: 2s;
  animation-fill-mode: both;
  @include device-pc {
    flex-direction: row;
    align-items: center;
    padding: 0;
  }
}

.loading__text-before {
  color: white;
  font-size: 16px;

  animation-name: text-flash;
  animation-duration: 2s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;

  @include device-pc {
    font-size: 24px;
  }
}
.loading__text-after {
  color: white;
  font-size: 24px;
  font-weight: 700;

  animation-name: text-flash;
  animation-duration: 2s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  @include device-pc {
    margin-left: 30px;
    font-size: 32px;
  }
}

@keyframes color-change {
  0% {
    background-color: var(--bg-color-before);
  }
  30% {
    background-color: var(--bg-color-before);
  }
  70% {
    background-color: var(--bg-color-next);
  }
  100% {
    background-color: var(--bg-color-next);
  }
}

@keyframes text-flash {
  0%,
  100% {
    opacity: 1;
  }
  30%,
  34%,
  38% {
    opacity: 1;
  }
  32%,
  36%,
  40% {
    opacity: 0;
  }
  70%,
  74%,
  78%,
  80% {
    opacity: 1;
  }
  72%,
  76%,
  80% {
    opacity: 0;
  }
}

.loading-leave-active {
  transition: transform 0.5s;
}

.loading-leave-to {
  transform: translateY(-100%);
}
</style>
