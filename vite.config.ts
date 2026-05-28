import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from "vite-plugin-vue-devtools"

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), vueDevTools()],
  server: {
      proxy: {  
       '/api-book': {
          target: "http://localhost:8089",
          changeOrigin: true,
       },
        '/api-orders': {
          target: "http://localhost:8089",
          changeOrigin: true,
       },
       '/api-rating': {
          target: "http://localhost:8089",
          changeOrigin: true,
       }
    }
  }
})
