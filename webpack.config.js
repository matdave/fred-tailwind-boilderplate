const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const devMode = process.env.NODE_ENV !== 'production';
const webpack = require("webpack");
const path = require("path");
const globSync = require("glob").sync;

module.exports = {
  entry: './src/index.js',
  devServer: {
      compress: true,
      contentBase: "./dist",
      watchOptions: {
        poll: true,
      },
      watchContentBase: true,
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode
          ? "style-loader"
          : {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "../",
                sourceMap: true
              }
            },
        {
          loader: 'css-loader',
          options: { sourceMap: true },
        },
        {
          loader: 'postcss-loader', 
          options: {
            plugins: function () {
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }, 
            sourceMap: true
          }
        },
        {
            loader: 'sass-loader',
            options: { sourceMap: true },
        }
      ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
              context: "src"
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-srcsets-loader",
          options: {
            attrs: [":src", ':srcset']
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: 'styles.css'
    }),
    new CleanWebpackPlugin(),
    ...globSync("src/**/*.html").map(fileName => {
      return new HtmlWebpackPlugin({
        template: fileName,
        inject: "body",
        filename: fileName.replace("src/", "")
      });
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    })
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: ""
  }
}