/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ajustado para encontrar seus arquivos dentro de src
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // Caso tenha arquivos na pasta app na raiz
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}