/* import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = new URL('.', import.meta.url).pathname;*/
const nextConfig = { 
  reactStrictMode: false,
  webpack(config, { isServer }) {
    // webpack設定
    /* config.entry = path.resolve(__dirname, 'src/index.js');
    config.output = {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    };
    config.plugins.push(new HtmlWebpackPlugin()); */

    // GLSLファイルに対するローダー設定
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });

    return config;
  },
};

export default nextConfig;
