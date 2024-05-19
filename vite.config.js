import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500, // Set the chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            // You can customize the chunk name based on your criteria
            return 'vendor-' + id.toString().split('node_modules/')[1].split('/')[0];
          }
        }
      }
    }
  }
})
