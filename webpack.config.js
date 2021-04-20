import path from 'path'

module.exports = {
  configureWebpack: {
    resolve: {
      symlinks: false
    }
  },

  module: {
    rules: [
      {
        loader: 'vue-loader',
        test: /\.vue$/
      },
      {
        loader: '@kazupon/vue-i18n-loader',
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto'
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
