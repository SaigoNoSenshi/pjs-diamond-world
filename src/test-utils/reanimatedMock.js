/**
 * Jest stand-in for `react-native-reanimated/mock`.
 *
 * `expo-router/testing-library` swaps Reanimated for the library's own mock, which
 * predates the CSS-animation API (`css.keyframes` / `css.create`) our ambient
 * animations use. jest.config.js maps the mock path here so those tests get the
 * upstream mock plus a no-op `css` namespace. Animation styles are inert in tests.
 */
const upstream = require('react-native-reanimated/src/mock');

const css = {
  keyframes: (keyframes) => keyframes,
  create: (styles) => styles,
};

module.exports = {
  ...upstream,
  css,
  createCSSAnimatedComponent: upstream.createAnimatedComponent,
};
