module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        if (process.env.NODE_ENV == 'production') {
          args[0].filename = '../index.html'
        }
        return args
      })
  },
  publicPath: process.env.NODE_ENV == 'production'
    ? '/CFE-scoreboard/dist/'
    : '/'
}
