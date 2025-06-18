import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: {
      disableDotRule: true,
    },
    cors: true,
    port: 3001,
  },
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: "index.html",
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          form: ['react-hook-form', 'formik', 'yup'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          pdf: ['react-pdf', 'pdfjs-dist'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react-hook-form'],
  },
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.otf'],
});