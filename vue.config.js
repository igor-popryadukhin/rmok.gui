// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  devServer: {
    host: '0.0.0.0',
    public: '0.0.0.0:3000',
    disableHostCheck: true
  },
  transpileDependencies: [
    'vuetify'
  ],

  configureWebpack: config => {
    // remove the existing ForkTsCheckerWebpackPlugin
    config.plugins = config.plugins.filter(
      p => !(p instanceof ForkTsCheckerWebpackPlugin)
    )
  }
}
