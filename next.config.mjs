/** @type {import('next').NextConfig} */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    entry: path.resolve(__dirname, 'src/index.js');
    output: {
      path: path.resolve(__dirname, 'dist');
      filename: 'bundle.js';
    };
    plugins: [new HtmlWebpackPlugin()];
    
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });

    return config;
  },
};

export default nextConfig;