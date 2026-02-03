import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        canvas: '#ffffff',
        slate: '#2f2f2f',
        coral: '#f87575',
        lime: '#cbff4d',
        mint: '#a8f0cb',
        purple: '#af42ae',
        sand: '#f2f2e8'
      },
      borderRadius: {
        xl: '1.25rem'
      }
    }
  },
  plugins: []
};

export default config;
