/**
 * Stub for @clerk/expo/dist/specs/NativeClerkModule.js
 *
 * On web (browser & Node.js SSR), React Native's TurboModuleRegistry is
 * undefined, so calling TurboModuleRegistry.get("ClerkExpo") crashes.
 *
 * Metro replaces the real NativeClerkModule with this file on the web
 * platform (see metro.config.js). Clerk's JS SDK handles a null native
 * module gracefully and falls back to its pure-JS / web implementation.
 */
module.exports = null;
