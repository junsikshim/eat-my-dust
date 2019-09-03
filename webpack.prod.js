const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const exec = require('child_process').exec;

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            ecma: 6,
            inline: false,
            keep_fargs: false,
            passes: 3,
            reduce_vars: false
          },
          topLevel: true
        }
      }),
      new OptimizeCssAssetsPlugin({})
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Eat My Dust!',
      template: './public/index.html',
      filename: './index.html',
      minify: {
        collapseWhitespace: true
      },
      inlineSource: '.(js|css)$'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new OptimizeCssAssetsPlugin({}),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    {
      apply: compiler => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
          exec('sh pack.sh', (err, stdout, stderr) => {
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          });
        });
      }
    }
  ]
});
