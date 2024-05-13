import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "index-upc.js"),
      formats: ["es", "cjs", "umd", "iife"],
      name: "applyJsBarcodeUpc",
      fileName: (format) => `js-barcode-upc.${format}.js`,
    },
    outDir: "vite-dist",
    minify: "terser",
    rollupOptions: {
      output: {
        banner: ``,
      },
    },
    terserOptions: {
      toplevel: true,
      compress: {
        passes: 2,
        unsafe_arrows: true,
      },
      mangle: {
                // debug: '',
      },
    },
  },
  plugins: [],
  test: {},
});
