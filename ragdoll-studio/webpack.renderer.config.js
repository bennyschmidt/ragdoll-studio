const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

const assets = ['static'];

module.exports = {
  module: {
    rules
  },
  plugins: assets.map(asset => {
    return new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', asset),
          to: asset
        }
      ],
    });
  })
};
