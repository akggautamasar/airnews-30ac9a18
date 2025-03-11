
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.174f5aa5c9694878942aad9acf68384b',
  appName: 'airnews',
  webDir: 'dist',
  server: {
    url: 'https://174f5aa5-c969-4878-942a-ad9acf68384b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // We would add plugins here that might allow background running
    // or lockscreen integration when available
  }
};

export default config;
