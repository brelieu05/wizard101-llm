module.exports = {
  content: [
    './src/renderer/**/*.{ts,tsx,html}',
    './src/renderer/index.html'
  ],
  theme: {
    extend: {
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
       }
    }
  },
  plugins: []
}
