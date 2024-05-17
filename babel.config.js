module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react",
    "@emotion/babel-preset-css-prop",
    "@babel/preset-flow",
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3,
      },
      "@babel/plugin-proposal-class-properties",
    ],
  ],
};
