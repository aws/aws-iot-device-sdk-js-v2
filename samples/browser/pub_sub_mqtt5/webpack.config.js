const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: "./index.ts",
  devtool: "source-map",
  target: "web",
  output: {
    filename: "index.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
    ],
  },
  plugins: [new NodePolyfillPlugin()],
};
