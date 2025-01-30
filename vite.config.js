import { defineConfig } from "vite";

export default defineConfig({
  base: "/location-API/", // Adjust to your repo name
  build: {
    target: "esnext",
  },
  server: {
    open: true,
  },
});
