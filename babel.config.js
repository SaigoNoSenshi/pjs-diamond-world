/* eslint-env node */
// Expo's default preset. In Jest (NODE_ENV=test) dynamic `import()` is turned into a
// promise-wrapped `require` so code-split content (`loadGradeContent`) runs in tests.
module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      test: { plugins: ['@babel/plugin-transform-dynamic-import'] },
    },
  };
};
