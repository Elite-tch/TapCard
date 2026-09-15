import { defineConfig } from "vite";
import uniPlugin from "@dcloudio/vite-plugin-uni";
import UnoCSS from "unocss/vite";

const uni = (uniPlugin as any).default || uniPlugin;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), uni()],
});
