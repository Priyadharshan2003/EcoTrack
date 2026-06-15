import { Platform } from 'react-native';

// expo-secure-store is native-only — it has no web implementation.
// When Expo Router does static rendering (SSG), it runs on Node/web,
// so we must guard the import. On web, tokenCache is not needed anyway
// because ClerkProvider accepts `tokenCache={undefined}` for web.
const getSecureStore = () => {
  if (Platform.OS === 'web') return null;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('expo-secure-store') as typeof import('expo-secure-store');
};

export const tokenCache = {
  async getToken(key: string): Promise<string | null> {
    const SecureStore = getSecureStore();
    if (!SecureStore) return null;
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string): Promise<void> {
    const SecureStore = getSecureStore();
    if (!SecureStore) return;
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // ignore
    }
  },
};
