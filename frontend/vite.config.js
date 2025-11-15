import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api":{
        target: "http://127.0.0.1:3000",
        secure: "false",
      }
    }
  },
  plugins: [react(), tailwindcss(), flowbiteReact(), ],
})