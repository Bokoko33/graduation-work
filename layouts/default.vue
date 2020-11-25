<template>
  <div>
    <Artwork />
    <Nuxt />
    <InterFace />
  </div>
</template>

<script>
export default {
  components: {},
  watch: {
    // routeが変わるときにシーンを変えるなどなにか処理する
    '$route.name'(_new, _old) {},
  },
};
</script>
