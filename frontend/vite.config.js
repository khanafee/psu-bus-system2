import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // อนุญาตให้รันบน Docker network
    port: 5173,
    watch: {
      usePolling: true, // <--- จุดสำคัญอยู่ตรงนี้! สั่งให้คอยเช็กการเปลี่ยนแปลงของไฟล์
    }
  }
})