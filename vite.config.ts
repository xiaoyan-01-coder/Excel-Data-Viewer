import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'


// https://vite.dev/config/
export default defineConfig({
  base: '/Excel-Data-Viewer/',
  plugins: [react(), basicSsl()],
  server: {
    host: true,
    port: 5173,
    https: {} as import('https').ServerOptions,        // browsers will warn about self-signed certs
  },
})
