import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// 部署在 GitHub Pages 的仓库页面时资源在 /REVERIE/ 下，由工作流传入 VITE_BASE；本地开发与构建仍是根路径。
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  build: {
    // 把 React 运行时与图标库分包：业务代码改动不会再让依赖包缓存失效。
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor'
          if (id.includes('node_modules/lucide-react')) return 'icons'
          return undefined
        },
      },
    },
  },
})
