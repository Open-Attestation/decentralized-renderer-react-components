/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: process.env.NODE_ENV ?? "development",
  entry: path.join(__dirname, "./app.tsx"),
  externals: {},
  output: {
    filename: "bundle.js",
  },
  devServer: {
    compress: true,
    port: 9001,
    static: {
      directory: path.join(__dirname, "."),
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      process: "process/browser",
    },
    fallback: {
      vm: require.resolve("vm-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};
