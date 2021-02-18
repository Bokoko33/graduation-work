<template>
  <transition name="loading">
    <div v-if="loading" :style="bgColor" class="loading">
      <p class="loading__text">Loading...</p>
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
    };
  },
  computed: {
    bgColor() {
      return {
        '--bg-color-next': this.bgColorAfter,
        '--bg-color-before': this.bgColorBefore,
      };
    },
  },
  watch: {
    '$route.name'(to, from) {
      this.bgColorAfter = this.getColor(to);
      this.bgColorBefore = this.getColor(from);
    },
  },
  mounted() {
    this.bgColorBefore = this.getColor(this.$route.name);
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
    getColor(route) {
      let beforeColor;
      switch (route) {
        case 'stage1':
          beforeColor = colors.blue;
          break;
        case 'stage2':
          beforeColor = colors.green;
          break;
        case 'stage3':
          beforeColor = colors.darkPurple;
          break;
        default:
          beforeColor = colors.lightPurple;
      }
      return '#' + beforeColor.toString(16);
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

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 99999;

  animation-name: color-change;
  animation-duration: 2s;
  animation-fill-mode: both;
}

.loading__text {
  color: white;
  font-size: 24px;
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

.loading-leave-active {
  transition: transform 0.5s;
}

.loading-leave-to {
  transform: translateY(-100%);
}
</style>
