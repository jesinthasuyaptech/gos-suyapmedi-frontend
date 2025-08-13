/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const opn = require("opn"); // Import the 'opn' package

const publicPath = "/"; // To run this file in local
//  const publicPath = "/react/template/"; // To build the file
module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    onAfterSetupMiddleware() {
      opn(`http://localhost:${this.port}/`);
    },
  },
  
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: "",
      publicPath : '/'   ,
      // publicPath: "/react/template/",
    }),
  },
  output: {
    filename: "js/[name].bundle.js",
    path: path.resolve(__dirname, "dist"), // base path where to send compiled assets
    publicPath: publicPath, // base path where referenced files will be look for
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        // config for sass compilation
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          {
            loader: "sass-loader",
          },
        ],
      },

      {
        test: /\.(jpg|png|svg|gif)$/,
        type: "asset/resource",
      },
       {
        test: /\.(mp3|wav|ogg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'audio/', // optional
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      title: "Hot Module Replacement",
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico",
    }),
    new MiniCssExtractPlugin({
      // plugin for controlling how compiled css will be outputted and named
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "css/*.*",
        "js/*.*",
        "fonts/*.*",
        "images/*.*",
      ],
    }),
  ],
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public', 'assets','img'), // path to your assets folder
          to: path.resolve(__dirname, 'dist', 'assets','img') // path to the build folder where assets should be copied
        }
      ]
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      title: "Hot Module Replacement",
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico",
    }),
    new MiniCssExtractPlugin({
      // plugin for controlling how compiled css will be outputted and named
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "css/*.*",
        "js/*.*",
        "fonts/*.*",
        "images/*.*",
      ],
    }),
    new webpack.ProvidePlugin({
      //To automatically load jquery
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
  ],

};
