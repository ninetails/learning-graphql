module.exports = {
  presets: [
    ['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-numeric-separator',
    ['@babel/plugin-transform-runtime', { corejs: 3, proposals: true }],
    'babel-plugin-macros'
  ],
  env: {
    production: {
      plugins: [
        'transform-react-remove-prop-types',
        'jsx-remove-data-test-id'
      ]
    }
  }
}
