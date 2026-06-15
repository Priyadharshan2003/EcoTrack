// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/**
 * When Expo Router does SSR (static rendering / dev server), it runs routes
 * in a Node.js environment where React Native's TurboModuleRegistry is
 * undefined. @clerk/expo's NativeClerkModule.js calls
 *   TurboModuleRegistry.get("ClerkExpo")
 * at module load time, which crashes immediately.
 *
 * We intercept the resolver for the web & node environments and swap that
 * one file for a safe stub that returns null.
 */
config.resolver = config.resolver ?? {};

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Only stub for the web platform (includes the node SSR renderer)
  if (
    platform === 'web' &&
    context.originModulePath &&
    (context.originModulePath.includes('@clerk/expo') || context.originModulePath.includes('@clerk\\expo')) &&
    moduleName.includes('NativeClerkModule')
  ) {
    return {
      filePath: require.resolve('./src/mocks/NativeClerkModule.stub.js'),
      type: 'sourceFile',
    };
  }

  // Fall through to the original resolver (or default)
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Disable COOP/COEP headers to fix Clerk Web OAuth & CAPTCHA popups
const originalEnhanceMiddleware = config.server?.enhanceMiddleware;
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    const enhanced = originalEnhanceMiddleware ? originalEnhanceMiddleware(middleware, server) : middleware;
    return (req, res, next) => {
      // Intercept setHeader to prevent Expo from adding COOP/COEP
      const originalSetHeader = res.setHeader;
      res.setHeader = function (name, value) {
        const lowerName = name.toLowerCase();
        if (lowerName === 'cross-origin-opener-policy' || lowerName === 'cross-origin-embedder-policy') {
          return this;
        }
        return originalSetHeader.call(this, name, value);
      };
      return enhanced(req, res, next);
    };
  },
};

module.exports = config;
