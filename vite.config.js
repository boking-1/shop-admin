import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import WindiCSS from 'vite-plugin-windicss'

import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      '~':path.resolve(__dirname,"src"),//path.resolve() 方法会将多个路径片段拼接成一个绝对路径，确保在不同操作系统下都能正确工作

    },
  },
  server:{
    proxy:{
      '/api':{
        target:'http://ceshi13.dishait.cn',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api/,'')
      },
    }
  }
})
