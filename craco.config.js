const path = require('path')
module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
      '@helpers': path.resolve(__dirname, 'src/helpers/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@typedefs': path.resolve(__dirname, 'src/types/'),
      '@style': path.resolve(__dirname, 'src/style/'),
    },
  },
}
