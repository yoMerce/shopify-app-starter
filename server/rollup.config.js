import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    dir: "../dist/server",
    format: "cjs",
  },
  plugins: [typescript()],
};
