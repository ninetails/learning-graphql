module.exports = {
  presets: [
    ['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }],
    '@babel/preset-react',
    '@babel/preset-typescript',
    '@xstyled/babel-preset-emotion-css-prop'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-numeric-separator',
    ['@babel/plugin-transform-runtime', { corejs: 3, proposals: true }],
    'macros',
    'emotion'
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
