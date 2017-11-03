module.exports = {
    plugins: [
        require('stylelint')({
            configFile: 'postcss/stylelint.json'
        }),
        require('autoprefixer'),
        require('postcss-reporter')
    ]
  }