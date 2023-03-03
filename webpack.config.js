const webpack = require("webpack");
const path = require("path");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

dotenv.config();

console.log(process.env.KAKAO_KEY);

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  plugins: [
    // dotenv 사용을 위한 설정
    new webpack.DefinePlugin({
      KAKAO_KEY: JSON.stringify(process.env.KAKAO_KEY),
      PUBLIC_KEY: JSON.stringify(process.env.PUBLIC_KEY),
    }),
    new HtmlWebpackPlugin({
      template: "./index.html", // index.html을 기본 템플릿으로 반영할 수 있도록 설정
    }),
    new MiniCssExtractPlugin({
      filename: "common.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  devServer: {
    // 개발 서버가 dist 폴더를 제공할 수 있도록 설정
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 5507,
  },
};
