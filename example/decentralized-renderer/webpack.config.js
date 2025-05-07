/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  // ...webpackConfig,
  mode: process.env.NODE_ENV ?? "development",
  entry: path.join(__dirname, "./app.tsx"),
  externals: {},
  output: {
    filename: "bundle.js",
  },
  devServer: {
    compress: true,
    port: 9000,
    static: {
      directory: path.join(__dirname, "."),
      serveIndex: true,
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
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
};
