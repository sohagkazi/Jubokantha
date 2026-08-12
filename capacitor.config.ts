import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.jubokantha.app',
  appName: 'Jubokantha',
  webDir: 'out',
  server: {
    allowNavigation: ['*']
  }
};

export default config;
