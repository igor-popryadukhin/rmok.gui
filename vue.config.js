
module.exports = {
  chainWebpack: config => {
    config.plugins.delete('prefetch')

    config.plugin('VuetifyLoaderPlugin').tap(args => [{
      match (originalTag, { kebabTag, camelTag, path, component }) {
        if (kebabTag.startsWith('core-')) {
          return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
        }
      }
    }])
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
  },

  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    public: 'https://dev.rmok.tech',
    port: 443,
    watchOptions: {
      poll: true
    }
  },

  filenameHashing: true,
  parallel: 4,

  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: true
    }
  },

  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ]
}
