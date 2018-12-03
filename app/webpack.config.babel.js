const webpack = require("webpack");
const path = require("path");

module.exports = {
  watch: true,
  entry: {
    main: path.join(__dirname, "src", "client", "index")
    // app: path.join(__dirname, "src", "client", "dash", "app")
  },
  output: {
    path: path.join(__dirname, "public", "js"),
    filename: "[name].min.js"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  plugins: [

    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify("production") }
    })
  ]
};
