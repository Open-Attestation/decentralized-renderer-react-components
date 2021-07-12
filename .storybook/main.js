module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.@(js|mdx)"],
  addons: ["@storybook/addon-docs/preset", "@storybook/addon-actions/register", "@storybook/addon-docs/register"],
  webpackFinal: async (config) => {
    // looks like storybook having trouble with emotion as for now => manually configuration webpack

    // re-apply babel configuration as available in package.json (storybook doesn't pick it)
    config.module.rules[0].use[0].loader = require.resolve("babel-loader");
    config.module.rules[0].use[0].options.presets = [
      require.resolve("@babel/preset-env", {
        targets: {
          node: "current",
        },
      }),
      require.resolve("@babel/preset-typescript"),
      require.resolve("@babel/preset-react"),
      require.resolve("@emotion/babel-preset-css-prop"),
    ];
    return config;
  },
};
