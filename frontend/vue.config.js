const fs = require("fs");
const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    resolve: {
        fallback: {
          buffer: require.resolve('buffer/'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
    ],
  },
  devServer: {
    https: {
      key: fs.readFileSync("./certificates/server.key"),
      cert: fs.readFileSync("./certificates/server.crt"),
    },
  },
};
