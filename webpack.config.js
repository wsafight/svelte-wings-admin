const webpack = require('webpack')
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const glob = require("glob");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const modules = glob.sync("./src/modules/*/index.ts")

const fileNameRegExp = /\/modules\/(.+)\/index.ts/

function getEntry() {
  const entry = {};
  //读取src目录所有page入口
  modules.forEach(function (filePath) {
    const name = filePath.match(fileNameRegExp)[1];
    entry[name] = filePath;
  });
  return entry;
}

function getHtmlModule() {
  const outHtml = [];
  //读取src目录所有page入口
  modules.forEach(function (filePath) {
    const name = filePath.match(fileNameRegExp)[1];
    outHtml.push(
      new HtmlWebpackPlugin({
        appMountId: "app",
        filename: `./${name}/index.html`,
        template: 'static/template.html',
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
    filename: "./[name]/main.[contenthash].js",
    chunkFilename: "./dynamic/[id].[contenthash].js",
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
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
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
    extensions: [".mjs", ".js", ".svelte", '.tsx', '.ts'],
  },
  externals: {
    dompurify: "DOMPurify"
  },
  plugins: [
    new webpack.ids.HashedModuleIdsPlugin(),
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
