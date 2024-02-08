const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.

  config.devServer.hot = true;
  config.devServer.liveReload = true;

  config.plugins = config.plugins.filter(plugin => !(plugin instanceof HotModuleReplacementPlugin));

  return config;
};
