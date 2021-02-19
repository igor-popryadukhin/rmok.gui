
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const package = require('./package.json')

module.exports = {
  devServer: {
    host: '0.0.0.0',
    public: '0.0.0.0:3000',
    disableHostCheck: true
  },

  parallel: 4,

  transpileDependencies: [
    'vuetify'
  ],

  productionSourceMap: false,
  filenameHashing: true,

  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: true
    }
  },

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
  configureWebpack: config => {
    config.output.filename = '[name].[contenthash].' + package.version + '.js'
    config.output.chunkFilename = '[name].[contenthash].' + package.version + '.js'

    // remove the existing ForkTsCheckerWebpackPlugin
    config.plugins = config.plugins.filter(
      p => !(p instanceof ForkTsCheckerWebpackPlugin)
    )
  }
}
