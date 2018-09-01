const {favicon} = require('./images')

const manifest = {
  'short_name': 'Subby',
  'name': 'Subby',
  'icons': [{
    'src': favicon,
    'sizes': '64x64 32x32 24x24 16x16',
    'type': 'image/x-icon'
  }],
  'display': 'standalone',
  'theme_color': '#000000',
  'background_color': '#ffffff'
}

module.exports = manifest
