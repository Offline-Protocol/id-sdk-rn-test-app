const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const sdkRoot = path.resolve(projectRoot, "../id-sdk-react-native");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [sdkRoot];
config.resolver.unstable_enableSymlinks = true;

const sharedModules = new Set(["react", "react-dom", "react-native"]);

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isFromSdk = context.originModulePath?.startsWith(sdkRoot);
  const isSharedModule =
    sharedModules.has(moduleName) ||
    moduleName.startsWith("react/") ||
    moduleName.startsWith("react-native/");

  // SDK code must use the app's React/RN instances, not the SDK's node_modules copy.
  if (isFromSdk && isSharedModule) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(projectRoot, "package.json") },
      moduleName,
      platform
    );
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
