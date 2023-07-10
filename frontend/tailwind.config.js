/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.rs"],
  theme: {
    fontFamily: {
      sans: ["poppins", ...defaultTheme.fontFamily.sans]
    },
    extend: {
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)"
      },
      backgroundImage: {
        hero: "linear-gradient(rgba(255, 252, 250, 0.4), #f9fafb), url('images/background.jpg')",
        herod:
          "linear-gradient(180deg,rgba(64,64,142,0.5) 40%,  #1a1631), url('images/background.jpg')"
      }
    }
  },
  variants: {
    fill: ['hover', 'focus'],
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ]
};
