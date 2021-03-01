const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const glob = require("glob");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function getEntry() {
  const entry = {};
  //读取src目录所有page入口
  glob.sync("./src/modules/*/index.js").forEach(function (filePath) {
    const name = filePath.match(/\/modules\/(.+)\/index.js/)[1];
    entry[name] = filePath;
  });
  return entry;
}

function getHtmlModule() {
  const outHtml = [];
  //读取src目录所有page入口
  glob.sync("./src/modules/*/index.js").forEach(function (filePath) {
    const name = filePath.match(/\/modules\/(.+)\/index.js/)[1];
    outHtml.push(
      new HtmlWebpackPlugin({
        appMountId: "app",
        filename: `./${name}/index.html`,
        chunks: [name],
      })
    );
  });
  return outHtml;
}

const config = {
  entry: getEntry(),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "./[name]/[name].[contenthash].js",
    chunkFilename: "./[name]/[id].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        loader: "svelte-loader",
        options: {
          preprocess: require("svelte-preprocess")({ postcss: true }),
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".mjs", ".js", ".svelte"],
  },
  plugins: [
    ...getHtmlModule(),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};

module.exports = config;
