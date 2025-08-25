import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'css'
      })],
    }),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'api': path.resolve(__dirname, './src/api'),
      'common': path.resolve(__dirname, './src/common'),
      'components': path.resolve(__dirname, './src/components'),
      'hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5300,
    proxy: {
      '/api': {
        // target: 'https://rclonesync.yemianzai.com',
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
        target: 'http://192.168.31.246:5051',
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        changeOrigin: true
      }
    }
  }
})
