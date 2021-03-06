const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const ScriptExtHtmlPlugin = require('script-ext-html-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const CopyPlugin = require('copy-webpack-plugin');
// const { GenerateSW } = require('workbox-webpack-plugin');
// const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const envify = require('process-envify');

const env = require('./env');
const pkg = require('./package');

const SOURCE_ROOT = path.join(__dirname, 'src');
const DISTRIBUTION_ROOT = path.join(__dirname, 'public');

module.exports = ({ prod = false } = {}) => ({
  mode: prod ? 'production' : 'development',
  context: SOURCE_ROOT,
  entry: ['./main.ts'],
  output: {
    path: DISTRIBUTION_ROOT,
    filename: prod ? '[name].[hash].js' : '[name].js',
    chunkFilename: prod ? '[id].[chunkhash].js' : '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
        // Removing this will cause deprecation warnings to appear.
        test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
        parser: { system: true },
      },
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack',
      },
      {
        test: /\.css$/,
        use: [
          'to-string-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
        ],
        exclude: [path.join(SOURCE_ROOT, 'assets')],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
        ],
        include: [path.join(SOURCE_ROOT, 'assets')],
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('assets', 'images/[name].[hash].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('assets', 'medias/[name].[hash].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('assets', 'fonts/[name].[hash].[ext]'),
        },
      },
    ].filter(Boolean),
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '~': SOURCE_ROOT,
    },
  },
  plugins: [
    new webpack.DefinePlugin(envify(env)),
    new HtmlPlugin({
      template: 'index.html',
      minify: prod && {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: prod ? 'manual' : 'auto',
    }),
    new ScriptExtHtmlPlugin({
      defaultAttribute: 'defer',
      preload: {
        test: /\.js$/,
        chunks: 'initial',
      },
      prefetch: {
        test: /\.js$/,
        chunks: 'all',
      },
    }),
    new AngularCompilerPlugin({
      tsConfigPath: path.join(__dirname, 'tools/tsconfig.app.json'),
      entryModule: path.join(SOURCE_ROOT, 'app.module#AppModule'),
      sourceMap: true,
      skipCodeGeneration: true,
    }),
    new CopyPlugin([
      {
        from: 'assets/**/*',
        to: DISTRIBUTION_ROOT,
        ignore: ['assets/styles/**/*'],
      },
    ]),
    !prod && new webpack.HotModuleReplacementPlugin(),
    prod && new webpack.optimize.AggressiveSplittingPlugin(),
    // prod && new GenerateSW({
    //   skipWaiting: true,
    //   clientsClaim: true,
    //   runtimeCaching: [{
    //     urlPattern: new RegExp(env.SITE_URL),
    //     handler: 'staleWhileRevalidate',
    //   }],
    //   navigateFallback: '/',
    //   navigateFallbackWhitelist: [/^(?!\/__).*/],
    //   cacheId: pkg.name,
    // }),
    // prod && new RobotstxtPlugin(),
  ].filter(Boolean),
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },
  devServer: {
    contentBase: DISTRIBUTION_ROOT,
    historyApiFallback: true,
    host: env.HOST_NAME,
    hot: true,
    inline: true,
    overlay: true,
    port: env.SITE_PORT,
  },
  devtool: prod ? 'hidden-source-map' : 'cheap-module-eval-source-map',
});
