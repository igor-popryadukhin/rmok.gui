import path from 'path'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
module.exports = {
  configureWebpack: {
    resolve: {
      symlinks: false
    }
  },

  devServer: {
    writeToDisk: true
  },

  plugins: [
    new VuetifyLoaderPlugin()
  ],

  module: {
    rules: [
      {
        loader: 'vue-loader',
        test: /\.vue$/
      },
      {
        test: /\.(json5?|ya?ml)$/, // target json, json5, yaml and yml files
        type: 'javascript/auto',
        resourceQuery: /\bblockType=i18n\b/,
        loader: '@kazupon/vue-i18n-loader',
        include: [ // Use `Rule.include` to specify the files of locale messages to be pre-compiled
          path.resolve(__dirname, 'src/locales')
        ]
      }
    ]
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname)
    },
    extensions: ['.js', '.json', '.vue', '.ts', '.css'],
    root: path.resolve(__dirname)
  }
}
