class HtmlWebpackPathAssetsFix {
  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlWebpackPathAssetsFix', compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
        'HtmlWebpackPathAssetsFix',
        htmlPluginData => {
          for (const entry of Object.values(compilation.chunks)) {
            entry.files = entry.files.map(path => 'dist/' + path)
          }
          // above is going to fix preload
          const assets = htmlPluginData.assets
          const publicPath = assets.publicPath
          assets.js = assets.js.map(path => {
            return path.replace(publicPath, publicPath + 'dist/')
          })
          assets.css = assets.css.map(path => {
            return path.replace(publicPath, publicPath + 'dist/')
          })
        }
      )
    })
  }
}
module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV == 'production', config => {
      config
        .plugin('html')
        .tap(args => {
          args[0].filename = '../index.html'
          return args
        })
      config
        .plugin('assetsFix')
        .use(HtmlWebpackPathAssetsFix)
        .before('preload')
    })
  },
  publicPath: process.env.NODE_ENV == 'production'
    ? '/CFE-scoreboard/'
    : '/'
}
