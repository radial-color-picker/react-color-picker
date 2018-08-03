module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactColorPicker',
      externals: {
        react: 'React'
      }
    }
  },
  webpack: {
    extractText: {
      allChunks: true,
      filename: process.env.NODE_ENV === 'production' ? `react-color-picker.min.css` : 'react-color-picker.css'
    },
    hoisting: true
  }
}
