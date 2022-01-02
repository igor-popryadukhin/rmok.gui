
module.exports = {
  chainWebpack: config => {
    config.plugins.delete('prefetch')

    // config.plugin('VuetifyLoaderPlugin').tap(args => [{
    //   match (originalTag, { kebabTag, camelTag, path, component }) {
    //     if (kebabTag.startsWith('core-')) {
    //       return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
    //     }
    //   }
    // }])
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
  },

  devServer: {
    disableHostCheck: true,
    ...(process.env.VUE_APP_DEV_SERVER_HOST ? { host: process.env.VUE_APP_DEV_SERVER_HOST } : {}),
    ...(process.env.VUE_APP_DEV_SERVER_PUBLIC ? { public: process.env.VUE_APP_DEV_SERVER_PUBLIC } : {}),
    ...(process.env.VUE_APP_DEV_SERVER_PORT ? { port: process.env.VUE_APP_DEV_SERVER_PORT } : {}),
    watchOptions: {
      watch: true,
      poll: 1000,
      aggregateTimeout: 500,
      ignored: /node_modules/
    }
  },

  filenameHashing: true,
  parallel: 2,

  pluginOptions: {},

  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ]
}
