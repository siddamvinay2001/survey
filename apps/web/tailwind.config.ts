import type { Config } from 'tailwindcss';
import { preset } from '@survey/config/tailwind.preset';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [{ theme: preset.theme, darkMode: preset.darkMode }],
  plugins: [],
};

export default config;
