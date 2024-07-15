const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { constants } = require("buffer");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      assets: path.resolve(__dirname, "src/assets"),
      constants: path.resolve(__dirname, "src/constants"),
      entities: path.resolve(__dirname, "src/entities"),
      helpers: path.resolve(__dirname, "src/helpers"),
      ui: path.resolve(__dirname, "src/ui"),
      app: path.resolve(__dirname, "src/app"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext][query]",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      minify: isProd
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
          }
        : false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets"),
          to: path.resolve(__dirname, "dist/assets"),
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    open: true,
    hot: true,
  },
  mode: isProd ? "production" : "development",
  devtool: isProd ? "source-map" : "inline-source-map",
};
