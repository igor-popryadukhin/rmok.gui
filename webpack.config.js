import path from 'path'

module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.vue', '.ts', '.css'],
    root: path.resolve(__dirname),
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname)
    }
  },

  configureWebpack: {
    resolve: {
      symlinks: false
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@kazupon/vue-i18n-loader'
      }
    ]
  }
}
