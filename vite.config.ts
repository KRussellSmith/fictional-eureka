import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.ELECTRON=="true" ? './' : ".",
  plugins: [],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})