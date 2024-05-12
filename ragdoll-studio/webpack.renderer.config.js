const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules
  },
  plugins: [
    'img',
    'font'
  ].map(asset => new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', asset),
          to: asset
        }
      ],
    })
  )
};
