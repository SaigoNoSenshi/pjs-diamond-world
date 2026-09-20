// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Allow .wasm assets (needed if expo-sqlite on web is ever enabled; harmless otherwise).
config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];

module.exports = config;
