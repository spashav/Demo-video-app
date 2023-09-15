const path = require('path')
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  if (config.target === 'web') {
    config.entry.player = path.resolve(__dirname, '../player/src/entry/player.tsx')

    // Версии api плеера при подключении через iframe
    config.entry.player_iframe_v1 = path.resolve(__dirname, '../player/src/entry/player-iframe-v1.ts')
    config.entry.player_iframe_v2 = path.resolve(__dirname, '../player/src/entry/player-iframe-v2.ts')
    config.entry.player_iframe_v3 = path.resolve(__dirname, '../player/src/entry/player-iframe-v3.ts')
  }
  return config;
});
