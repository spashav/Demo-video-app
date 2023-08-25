const path = require('path')
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  if (config.target === 'web') {
    config.entry.loader = path.resolve(__dirname, './src/player/entry/loader.ts')
    config.entry.player = path.resolve(__dirname, './src/player/entry/player.ts')
    config.entry.player_iframe = path.resolve(__dirname, './src/player/entry/player-iframe.ts')
    config.entry.player_skin = path.resolve(__dirname, './src/player/entry/player-skin.ts')
  }
  return config;
});
