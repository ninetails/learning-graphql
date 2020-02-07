module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard-with-typescript',
    'standard-react'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json'
  },
  rules: {
    "jsx-quotes": ["error", "prefer-double"],
    "@typescript-eslint/no-floating-promises": "off",
    "import/no-duplicates": "off"
  }
}
