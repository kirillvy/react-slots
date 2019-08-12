var path = require('path');

var prodPath = 'lib';

module.exports = {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: path.join(__dirname,  prodPath),
    filename: '[name].js',
    library: 'react-slots-library',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ['ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx']
  },
  externals: {
    'react': 'react', // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    'react-dom': 'react-dom',
  }
};