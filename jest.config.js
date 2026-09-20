/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // react-native-worklets ships a resolver that swaps its native module for the JS fallback in Jest.
  resolver: 'react-native-worklets/jest/resolver',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.expo/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-view-shot|react-native-reanimated|react-native-worklets|standard-navigation|@react-native-async-storage/.*)',
  ],
  collectCoverageFrom: ['src/domain/**/*.ts', 'src/repositories/**/*.ts', '!**/*.d.ts'],
  moduleNameMapper: {
    // expo-router/testing-library mocks Reanimated with this module; ours adds the css API.
    '^react-native-reanimated/mock$': '<rootDir>/src/test-utils/reanimatedMock.js',
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
