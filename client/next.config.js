const path = require('path');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  reactStrictMode: false, // Strict mode for better debugging and development
  swcMinify: true, // Enabling SWC for JavaScript minification
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true, // Allows custom optimization of images (can be enabled later)
  },

  webpack: (config, { dev, isServer, defaultLoaders }) => {
    // MDX Support
    config.module.rules.push({
      test: /\.mdx$/,
      use: [
        defaultLoaders.babel, // Use default Babel loader
        {
          loader: "@mdx-js/loader",
          options: {
            // Options for MDX can go here if needed
          },
        },
      ],
    });

    // Webpack Alias for cleaner imports
    config.resolve.alias['@components'] = path.resolve(__dirname, 'components');
    config.resolve.alias['@pages'] = path.resolve(__dirname, 'pages');
    config.resolve.alias['@styles'] = path.resolve(__dirname, 'styles');
    config.resolve.alias['@utils'] = path.resolve(__dirname, 'utils');

    // Production optimizations for CSS
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }

    // Handling static file imports with proper resolution
    // config.module.rules.push({
    //   test: /\.(png|jpg|jpeg|gif|svg|eot|otf|webp|woff|woff2|ttf|mp3|mp4)$/i,
    //   loader: 'url-loader',
    //   options: {
    //     limit: 8192, // Files below 8 KB will be converted to base64 encoded URLs
    //     fallback: 'file-loader',
    //     name: '[path][name].[ext]',
    //   },
    // });

    return config;
  },

  // Customizing the Tailwind CSS setup in production
  experimental: {
    optimizeCss: true, // Enable automatic CSS optimizations
  },

  // Adding environment variables and values for production
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 3500,
  },

  // Enabling analytics for performance monitoring (optional)
  // reactStrictMode: true for performance boosts and React error boundaries
  // The following will work in Next.js 13+ (Optional)
  // i18n: {
  //   locales: ['en', 'es'],
  //   defaultLocale: 'en',
  // },
  
  // Enable gzip compression in production (can be done through Nginx, but also works in Next.js)
  compress: true,

  // Allows you to set a custom build directory
  distDir: 'build',

  // Optional PWA (Progressive Web App) Setup
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },

  // Custom Document settings (HTML and <head>)
  reactStrictMode: false, // Always enabled in production for best practices
  future: {
    webpack5: true, // Ensure Webpack 5 is used in the production build
  },
};

