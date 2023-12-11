import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'map-page-image': "url('/map-page-image.png')"
      },
      width: {
        '9/10': '90%',
      },
      colors: {
        'navbar-orange': '#FB4D42'
      }
    },
  },
  plugins: [],
}
export default config
