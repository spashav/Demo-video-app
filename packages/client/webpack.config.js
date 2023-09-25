const path = require('path')
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  if (config.target === 'web') {
    config.output.scriptType = false
    config.entry.inline_lib = path.resolve(__dirname, './src/entry/inline-lib.ts')
    // Версии api плеера при подключении без iframe (реализация плеера)
    config.entry.player_v1 = path.resolve(__dirname, '../player/src/entry/player-v1.tsx')
    config.entry.player_v2 = path.resolve(__dirname, '../player/src/entry/player-v2.tsx')
    config.entry.player_v3 = path.resolve(__dirname, '../player/src/entry/player-v3.tsx')

    // Версии api плеера при подключении через iframe (прокси к реализация плеера)
    config.entry.player_iframe_v1 = path.resolve(__dirname, '../player/src/entry/player-iframe-v1.ts')
    config.entry.player_iframe_v2 = path.resolve(__dirname, '../player/src/entry/player-iframe-v2.ts')
    config.entry.player_iframe_v3 = path.resolve(__dirname, '../player/src/entry/player-iframe-v3.ts')
  } else  {
    config.externals = []
  }
  return config;
});
