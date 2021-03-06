export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    htmlAttrs: {
      lang: 'ja',
      prefix: 'og: http://ogp.me/ns#',
    },
    title: 'IM Cursor',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Immersive contents on Multi-device with Cursor | IM Cursorは、「カーソルの動きによってユーザーに擬似感覚を提示する」というテーマ、「手持ちのデバイスで手軽に体験できる没入型コンテンツ」というコンセプトのWebコンテンンツです。',
      },
      { hid: 'og:site_name', property: 'og:site_name', content: 'IM Cursor' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://im-cursor.netlify.app',
      },
      { hid: 'og:title', property: 'og:title', content: 'IM Cursor' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Immersive contents on Multi-device with Cursor',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://im-cursor.netlify.app/ogp_image.jpg',
      },
      { name: 'twitter:card', content: 'summary_large_image' }, // twitterの画像サイズ
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/scss/style.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: '~/plugins/InterFace.js', mode: 'client' }],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [],

  styleResources: {
    scss: [
      '~/assets/scss/base/_variable.scss',
      '~/assets/scss/base/_mixin.scss',
    ],
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, ctx) {
      if (config.module) {
        config.module.rules.push({
          test: /\.(vert|frag)$/i,
          use: ['raw-loader'],
        });
      }
    },
  },

  server: {
    host: '0.0.0.0', // デフォルト: localhost
  },

  loading: '~/components/loading/Loading.vue',

  sitemap: {
    trailingSlash: true,
  },

  router: {
    trailingSlash: true,
    middleware: ['redirect'],
  },
};
