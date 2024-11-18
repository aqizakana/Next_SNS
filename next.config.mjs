const nextConfig = { 
  reactStrictMode: false,
  webpack(config, { isServer }) {
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
