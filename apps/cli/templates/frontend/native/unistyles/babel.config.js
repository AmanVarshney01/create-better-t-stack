module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  plugins.push([
    'react-native-unistyles/plugin',
    {
      root: "src",
      autoProcessRoot: 'app',
      autoProcessImports: ['@/components']
    },
  ]);

  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['babel-preset-expo'],

    plugins,
  };
};
