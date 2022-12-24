const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new HtmlInlineScriptPlugin({
      scriptMatchPattern: [/index[.]js$/],
    }),
  ],
  output: {
    path: `${__dirname}/docs/`,
    filename: "[name].js",
    publicPath: "",
  },
});
