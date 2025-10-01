const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.watchFolders = [
  path.resolve(__dirname, "../sdk"), // path to your SDK
];

module.exports = config;
